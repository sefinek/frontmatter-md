const parseFrontmatter = require('../src/index.js');

describe('Module exports', () => {
	it('parseFrontmatter is a function', () => {
		expect(typeof parseFrontmatter).toBe('function');
	});

	it('version is a non-empty string', () => {
		expect(typeof parseFrontmatter.version).toBe('string');
		expect(parseFrontmatter.version.length).toBeGreaterThan(0);
	});
});

describe('No frontmatter', () => {
	it('returns empty data and full content when no frontmatter', () => {
		const { data, content } = parseFrontmatter('# Hello\n\nWorld');
		expect(data).toEqual({});
		expect(content).toBe('# Hello\n\nWorld');
	});

	it('handles empty string', () => {
		const { data, content } = parseFrontmatter('');
		expect(data).toEqual({});
		expect(content).toBe('');
	});

	it('returns raw content when opening delimiter missing', () => {
		const raw = 'title: Hello\n---\ncontent';
		const { data, content } = parseFrontmatter(raw);
		expect(data).toEqual({});
		expect(content).toBe(raw);
	});

	it('returns raw content when closing delimiter missing', () => {
		const raw = '---\ntitle: Hello\n';
		const { data, content } = parseFrontmatter(raw);
		expect(data).toEqual({});
		expect(content).toBe(raw);
	});
});

describe('String values', () => {
	it('parses unquoted string', () => {
		const { data } = parseFrontmatter('---\ntitle: Hello World\n---\n');
		expect(data.title).toBe('Hello World');
	});

	it('parses double-quoted string', () => {
		const { data } = parseFrontmatter('---\ntitle: "Hello World"\n---\n');
		expect(data.title).toBe('Hello World');
	});

	it('parses single-quoted string', () => {
		const { data } = parseFrontmatter('---\ntitle: \'Hello World\'\n---\n');
		expect(data.title).toBe('Hello World');
	});

	it('preserves colons in value', () => {
		const { data } = parseFrontmatter('---\ndesc: Hello: World\n---\n');
		expect(data.desc).toBe('Hello: World');
	});
});

describe('Boolean values', () => {
	it('parses true', () => {
		const { data } = parseFrontmatter('---\ndraft: true\n---\n');
		expect(data.draft).toBe(true);
	});

	it('parses false', () => {
		const { data } = parseFrontmatter('---\npublished: false\n---\n');
		expect(data.published).toBe(false);
	});
});

describe('Number values', () => {
	it('parses integer', () => {
		const { data } = parseFrontmatter('---\norder: 42\n---\n');
		expect(data.order).toBe(42);
	});

	it('parses float', () => {
		const { data } = parseFrontmatter('---\nrating: 4.5\n---\n');
		expect(data.rating).toBe(4.5);
	});
});

describe('Array values', () => {
	it('parses YAML list', () => {
		const { data } = parseFrontmatter('---\ntags:\n  - foo\n  - bar\n---\n');
		expect(data.tags).toEqual(['foo', 'bar']);
	});

	it('parses inline array', () => {
		const { data } = parseFrontmatter('---\ntags: [foo, bar, baz]\n---\n');
		expect(data.tags).toEqual(['foo', 'bar', 'baz']);
	});

	it('parses empty list as empty array', () => {
		const { data } = parseFrontmatter('---\ntags:\n---\n');
		expect(data.tags).toEqual([]);
	});
});

describe('Content extraction', () => {
	it('returns content after frontmatter', () => {
		const { content } = parseFrontmatter('---\ntitle: Hi\n---\n# Hello\n\nWorld');
		expect(content).toBe('# Hello\n\nWorld');
	});

	it('returns empty content when nothing after frontmatter', () => {
		const { content } = parseFrontmatter('---\ntitle: Hi\n---\n');
		expect(content).toBe('');
	});
});

describe('CRLF line endings', () => {
	it('handles CRLF in frontmatter', () => {
		const { data, content } = parseFrontmatter('---\r\ntitle: Hello\r\n---\r\n# World');
		expect(data.title).toBe('Hello');
		expect(content).toBe('# World');
	});
});

describe('Edge cases', () => {
	it('ignores blank lines inside frontmatter', () => {
		const { data } = parseFrontmatter('---\ntitle: Hi\n\ndesc: Yo\n---\n');
		expect(data.title).toBe('Hi');
		expect(data.desc).toBe('Yo');
	});

	it('ignores comment lines inside frontmatter', () => {
		const { data } = parseFrontmatter('---\n# comment\ntitle: Hi\n---\n');
		expect(data.title).toBe('Hi');
	});

	it('parses multiple fields', () => {
		const raw = '---\ntitle: Test\ndesc: Description\norder: 1\ndraft: false\n---\ncontent';
		const { data, content } = parseFrontmatter(raw);
		expect(data.title).toBe('Test');
		expect(data.desc).toBe('Description');
		expect(data.order).toBe(1);
		expect(data.draft).toBe(false);
		expect(content).toBe('content');
	});
});
