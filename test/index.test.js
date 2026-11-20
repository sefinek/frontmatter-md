import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { describe, it } from 'node:test';
import parseFrontmatter from '../src/index.js';

const { version: packageVersion } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

describe('Module exports', () => {
	it('parseFrontmatter is a function', () => {
		assert.equal(typeof parseFrontmatter, 'function');
	});

	it('version is a non-empty string', () => {
		assert.equal(typeof parseFrontmatter.version, 'string');
		assert.ok(parseFrontmatter.version.length > 0);
	});

	it('version matches package.json', () => {
		assert.equal(parseFrontmatter.version, packageVersion);
	});

	it('require() returns the function directly', () => {
		assert.equal(typeof createRequire(import.meta.url)('../src/index.js'), 'function');
	});
});

describe('No frontmatter', () => {
	it('returns empty data and full content when no frontmatter', () => {
		const { data, content } = parseFrontmatter('# Hello\n\nWorld');
		assert.deepEqual(data, {});
		assert.equal(content, '# Hello\n\nWorld');
	});

	it('handles empty string', () => {
		const { data, content } = parseFrontmatter('');
		assert.deepEqual(data, {});
		assert.equal(content, '');
	});

	it('returns raw content when opening delimiter missing', () => {
		const raw = 'title: Hello\n---\ncontent';
		const { data, content } = parseFrontmatter(raw);
		assert.deepEqual(data, {});
		assert.equal(content, raw);
	});

	it('returns raw content when closing delimiter missing', () => {
		const raw = '---\ntitle: Hello\n';
		const { data, content } = parseFrontmatter(raw);
		assert.deepEqual(data, {});
		assert.equal(content, raw);
	});
});

describe('String values', () => {
	it('parses unquoted string', () => {
		const { data } = parseFrontmatter('---\ntitle: Hello World\n---\n');
		assert.equal(data.title, 'Hello World');
	});

	it('parses double-quoted string', () => {
		const { data } = parseFrontmatter('---\ntitle: "Hello World"\n---\n');
		assert.equal(data.title, 'Hello World');
	});

	it('parses single-quoted string', () => {
		const { data } = parseFrontmatter('---\ntitle: \'Hello World\'\n---\n');
		assert.equal(data.title, 'Hello World');
	});

	it('preserves colons in value', () => {
		const { data } = parseFrontmatter('---\ndesc: Hello: World\n---\n');
		assert.equal(data.desc, 'Hello: World');
	});

	it('preserves inner quotes in unquoted string', () => {
		const { data } = parseFrontmatter('---\ntitle: Browser example0000 "xd"\n---\n');
		assert.equal(data.title, 'Browser example0000 "xd"');
	});

	it('preserves a single trailing quote in unquoted string', () => {
		const { data } = parseFrontmatter('---\ntitle: Say "hi\n---\n');
		assert.equal(data.title, 'Say "hi');
	});

	it('keeps quoted "true" as a string, not boolean', () => {
		const { data } = parseFrontmatter('---\nflag: "true"\n---\n');
		assert.equal(data.flag, 'true');
	});

	it('keeps quoted number as a string, not a number', () => {
		const { data } = parseFrontmatter('---\ncode: "42"\n---\n');
		assert.equal(data.code, '42');
	});

	it('unescapes escaped quotes and backslashes in double-quoted string', () => {
		const { data } = parseFrontmatter('---\ntitle: "He said \\"hi\\" and left\\\\home"\n---\n');
		assert.equal(data.title, 'He said "hi" and left\\home');
	});

	it('unescapes doubled single-quotes in single-quoted string', () => {
		const { data } = parseFrontmatter('---\ntitle: \'It\'\'s here\'\n---\n');
		assert.equal(data.title, 'It\'s here');
	});

	it('does not treat scientific notation as string', () => {
		const { data } = parseFrontmatter('---\nvalue: 1e10\n---\n');
		assert.equal(data.value, 1e10);
	});
});

describe('Boolean values', () => {
	it('parses true', () => {
		const { data } = parseFrontmatter('---\ndraft: true\n---\n');
		assert.equal(data.draft, true);
	});

	it('parses false', () => {
		const { data } = parseFrontmatter('---\npublished: false\n---\n');
		assert.equal(data.published, false);
	});
});

describe('Number values', () => {
	it('parses integer', () => {
		const { data } = parseFrontmatter('---\norder: 42\n---\n');
		assert.equal(data.order, 42);
	});

	it('parses float', () => {
		const { data } = parseFrontmatter('---\nrating: 4.5\n---\n');
		assert.equal(data.rating, 4.5);
	});
});

describe('Array values', () => {
	it('parses YAML list', () => {
		const { data } = parseFrontmatter('---\ntags:\n  - foo\n  - bar\n---\n');
		assert.deepEqual(data.tags, ['foo', 'bar']);
	});

	it('parses inline array', () => {
		const { data } = parseFrontmatter('---\ntags: [foo, bar, baz]\n---\n');
		assert.deepEqual(data.tags, ['foo', 'bar', 'baz']);
	});

	it('parses empty list as empty array', () => {
		const { data } = parseFrontmatter('---\ntags:\n---\n');
		assert.deepEqual(data.tags, []);
	});
});

describe('Content extraction', () => {
	it('returns content after frontmatter', () => {
		const { content } = parseFrontmatter('---\ntitle: Hi\n---\n# Hello\n\nWorld');
		assert.equal(content, '# Hello\n\nWorld');
	});

	it('returns empty content when nothing after frontmatter', () => {
		const { content } = parseFrontmatter('---\ntitle: Hi\n---\n');
		assert.equal(content, '');
	});
});

describe('CRLF line endings', () => {
	it('handles CRLF in frontmatter', () => {
		const { data, content } = parseFrontmatter('---\r\ntitle: Hello\r\n---\r\n# World');
		assert.equal(data.title, 'Hello');
		assert.equal(content, '# World');
	});
});

describe('Edge cases', () => {
	it('ignores blank lines inside frontmatter', () => {
		const { data } = parseFrontmatter('---\ntitle: Hi\n\ndesc: Yo\n---\n');
		assert.equal(data.title, 'Hi');
		assert.equal(data.desc, 'Yo');
	});

	it('ignores comment lines inside frontmatter', () => {
		const { data } = parseFrontmatter('---\n# comment\ntitle: Hi\n---\n');
		assert.equal(data.title, 'Hi');
	});

	it('parses multiple fields', () => {
		const raw = '---\ntitle: Test\ndesc: Description\norder: 1\ndraft: false\n---\ncontent';
		const { data, content } = parseFrontmatter(raw);
		assert.equal(data.title, 'Test');
		assert.equal(data.desc, 'Description');
		assert.equal(data.order, 1);
		assert.equal(data.draft, false);
		assert.equal(content, 'content');
	});
});
