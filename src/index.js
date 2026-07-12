const VERSION = '1.0.2'; // TODO: Keep this in sync with package.json for new releases.

const FRONTMATTER_OPEN = /^---\r?\n/;
const FRONTMATTER_CLOSE = /\n---\r?\n/;
const LIST_ITEM = /^\s+-\s+(.*)/;
const INLINE_ARRAY = /^\[(.+)]$/;
const NUMBER = /^[+-]?(?:\d+\.\d+|\d+)(?:[eE][+-]?\d+)?$/;
const DOUBLE_ESCAPE = /\\(.)/g;

const unescapeDouble = str => str.replace(DOUBLE_ESCAPE, (_, ch) => {
	switch (ch) {
	case 'n': return '\n';
	case 't': return '\t';
	case 'r': return '\r';
	case 'b': return '\b';
	case 'f': return '\f';
	default: return ch; // handles \" and \\
	}
});

const parseValue = raw => {
	const val = raw.trim();
	const first = val[0];
	const last = val[val.length - 1];
	const isQuoted = val.length >= 2 && first === last && (first === '"' || first === '\'');

	if (isQuoted) {
		const inner = val.slice(1, -1);
		return first === '"' ? unescapeDouble(inner) : inner.replace(/''/g, '\'');
	}

	if (val === 'true') return true;
	if (val === 'false') return false;
	if (val !== '' && NUMBER.test(val)) return Number(val);
	return val;
};

const parseFrontmatter = raw => {
	const openMatch = FRONTMATTER_OPEN.exec(raw);
	if (!openMatch) return { data: {}, content: raw };

	const startLen = openMatch[0].length;
	const closeMatch = FRONTMATTER_CLOSE.exec(raw.slice(startLen));
	if (!closeMatch) return { data: {}, content: raw };

	const block = raw.slice(startLen, startLen + closeMatch.index);
	const content = raw.slice(startLen + closeMatch.index + closeMatch[0].length);
	const lines = block.split(/\r?\n/);
	const data = {};
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];
		const trimmedLine = line.trim();
		if (!trimmedLine || trimmedLine.startsWith('#')) {
			i++;
			continue;
		}

		const colon = line.indexOf(':');
		if (colon === -1) {
			i++;
			continue;
		}

		const key = line.slice(0, colon).trim();
		const rest = line.slice(colon + 1).trim();

		if (rest === '') {
			const arr = [];
			i++;
			let match;
			while (i < lines.length && (match = LIST_ITEM.exec(lines[i]))) {
				arr.push(parseValue(match[1]));
				i++;
			}
			data[key] = arr;
		} else {
			const inlineArr = INLINE_ARRAY.exec(rest);
			if (inlineArr) {
				data[key] = inlineArr[1].split(',').map(s => parseValue(s.trim()));
			} else {
				data[key] = parseValue(rest);
			}
			i++;
		}
	}

	return { data, content };
};

parseFrontmatter.version = VERSION;
module.exports = parseFrontmatter;
