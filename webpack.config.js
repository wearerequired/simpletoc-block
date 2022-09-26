const path = require( 'path' );
const defaultConfig = require( './node_modules/@wordpress/scripts/config/webpack.config' );

module.exports = {
	// https://github.com/WordPress/gutenberg/blob/master/packages/scripts/config/webpack.config.js
	...defaultConfig,

	// https://webpack.js.org/configuration/entry-context/#context
	context: path.resolve( __dirname, 'assets/js/src' ),

	// https://webpack.js.org/configuration/entry-context/#entry
	entry: {
		blocks: './blocks.js',
		'block-simpletoc': './blocks/simpletoc/view.js',
	},

	// https://webpack.js.org/configuration/output/
	output: {
		...defaultConfig.output,
		uniqueName: '@wearerequired/simpletoc-block',
		path: path.resolve( __dirname, 'assets/js/dist' ),
		filename: '[name].js',
	},
};
