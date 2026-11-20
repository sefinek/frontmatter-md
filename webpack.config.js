import path from 'node:path';

export default {
	entry: './src/index.js',
	target: 'web',
	mode: 'production',
	output: {
		path: path.resolve(import.meta.dirname, 'dist'),
		filename: 'mdFrontmatter.min.js',
		globalObject: 'this',
		library: {
			name: 'mdFrontmatter',
			type: 'umd',
			export: 'default',
		},
	},
	devtool: 'source-map',
};
