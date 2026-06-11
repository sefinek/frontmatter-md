const VERSION = '1.0.0';

const FRONTMATTER_OPEN = /^---\r?\n/;
const FRONTMATTER_CLOSE = /\n---\r?\n/;
const LIST_ITEM = /^\s+-\s+(.*)/;
const INLINE_ARRAY = /^\[(.+)]$/;

const parseValue = raw => {
	const val = raw.replace(/^["']|["']$/g, '').trim();
	if (val === 'true') return true;
	if (val === 'false') return false;
	if (val !== '' && !isNaN(val)) return Number(val);
	return val;
};

const parseFrontmatter = raw => {
	if (!FRONTMATTER_OPEN.test(raw)) return { data: {}, content: raw };

	const startLen = raw.match(FRONTMATTER_OPEN)[0].length;
	const closeMatch = FRONTMATTER_CLOSE.exec(raw.slice(startLen));
	if (!closeMatch) return { data: {}, content: raw };

	const block = raw.slice(startLen, startLen + closeMatch.index);
	const content = raw.slice(startLen + closeMatch.index + closeMatch[0].length);
	const lines = block.split(/\r?\n/);
	const data = {};
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];
		if (!line.trim() || line.trim().startsWith('#')) {
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
