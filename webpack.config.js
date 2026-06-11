const path = require('node:path');

module.exports = {
	entry: './src/index.js',
	target: 'web',
	mode: 'production',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'mdFrontmatter.min.js',
		globalObject: 'this',
		library: {
			name: 'mdFrontmatter',
			type: 'umd',
		},
	},
	devtool: 'source-map',
};
