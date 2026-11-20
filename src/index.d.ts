/**
 * Parses YAML frontmatter from a Markdown string.
 * Returns the extracted key-value data and the remaining content.
 *
 * @example
 * import parseFrontmatter from 'frontmatter-md';
 *
 * const { data, content } = parseFrontmatter('---\ntitle: Hello\n---\n# World');
 * // data    → { title: 'Hello' }
 * // content → '# World'
 *
 * @version 2.0.0
 */
declare const parseFrontmatter: {
	(raw: string): { data: Record<string, unknown>; content: string };
	readonly version: string;
};

export default parseFrontmatter;
