import fs from 'node:fs';
import path from 'node:path';
import parseFrontmatter from '../src/index.js';

const files = [
	'basic.md',
	'tags.md',
	'inline-array.md',
	'no-frontmatter.md',
];

for (const file of files) {
	const markdown = fs.readFileSync(path.join(import.meta.dirname, file), 'utf8');
	const { data } = parseFrontmatter(markdown);

	console.log(`-- ${file} --`);
	console.log(data);
	console.log();
}
