const fs = require('node:fs');
const path = require('node:path');
const parseFrontmatter = require('../src/index.js');

const files = [
	'basic.md',
	'tags.md',
	'inline-array.md',
	'no-frontmatter.md',
];

for (const file of files) {
	const markdown = fs.readFileSync(path.join(__dirname, file), 'utf8');
	const { data } = parseFrontmatter(markdown);

	console.log(`-- ${file} --`);
	console.log(data);
	console.log();
}
