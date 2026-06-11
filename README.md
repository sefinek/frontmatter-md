# frontmatter-md
[![npm version](https://img.shields.io/npm/v/frontmatter-md.svg)](https://www.npmjs.com/package/frontmatter-md)
[![npm downloads](https://img.shields.io/npm/dm/frontmatter-md.svg)](https://www.npmjs.com/package/frontmatter-md)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/frontmatter-md/badge)](https://www.jsdelivr.com/package/npm/frontmatter-md)
[![license](https://img.shields.io/npm/l/frontmatter-md.svg)](./LICENSE)

Lightweight YAML frontmatter parser for Markdown files.

The package extracts metadata written at the beginning of a Markdown file between `---` delimiters and returns the remaining document content.

Do you have questions or want to receive notifications about important changes or new features in my repositories?
Join my [Discord server](https://discord.gg/S7NDzCzQTg)! If you do not use Discord, you can also open an issue on GitHub.

If you like this repository, leave a star ⭐. Thank you!


## Installation
```bash
npm install frontmatter-md
```


## Node.js usage
### Markdown

```md
---
title: "Hello World"
description: Simple post showing supported data types
author: Sefinek
order: 3
rating: 4.5
draft: false
featured: true
tags: [markdown, frontmatter, parser]
categories:
  - JavaScript
  - Markdown
  - Tools
---

# Heading
The document content is returned separately, without the frontmatter block.
```

### Example

```js
const parseFrontmatter = require('frontmatter-md');

const { data, content } = parseFrontmatter(markdown);
```

### Output
```json
{
	"data": {
		"title": "Hello World",
		"description": "Simple post showing supported data types",
		"author": "Sefinek",
		"order": 3,
		"rating": 4.5,
		"draft": false,
		"featured": true,
		"tags": ["markdown", "frontmatter", "parser"],
		"categories": ["JavaScript", "Markdown", "Tools"]
	},
	"content": "# Heading\nThe document content is returned separately, without the frontmatter block."
}
```


## Browser usage

### URL
https://cdn.jsdelivr.net/npm/frontmatter-md@1/dist/mdFrontmatter.min.js

### Example
```html
<script src="https://cdn.jsdelivr.net/npm/frontmatter-md@1/dist/mdFrontmatter.min.js"></script>
<script>
	const markdown = `---
title: Browser example
tags: [html, browser, markdown]
draft: false
---

# Browser example
Parsed directly in the browser.`;

	const { data, content } = mdFrontmatter(markdown);
	console.log(data);
	console.log(content);
</script>
```


## Supported values
- strings, including quoted strings
- numbers
- `true` and `false` values
- YAML lists
- inline arrays, e.g. `[foo, bar, baz]`
- comments and empty lines inside the frontmatter block


## API
```js
const result = parseFrontmatter(markdown);
```

The function returns an object:

```js
{
	data: {},   // Metadata from frontmatter
	content: '' // Markdown content without frontmatter
}
```

If the text does not contain valid frontmatter, `data` will be an empty object and `content` will remain unchanged.


## Development
```bash
npm test
npm run lint
npm run build
```


## MIT License
Copyright © 2024-2026 [Sefinek](https://sefinek.net)
