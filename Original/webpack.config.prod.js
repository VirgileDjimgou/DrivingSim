/* eslint-disable camelcase */
const path = require( 'path' );
const TerserPlugin = require( 'terser-webpack-plugin' );

module.exports = {
	entry: path.resolve( __dirname, 'src/index.js' ),
	mode: 'production',
	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: 'bundle.js',
		library: '$',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/
			}
		]
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin( {
				terserOptions: {
					keep_classnames: false,
					keep_fnames: false,
					output: { comments: false },
					compress: { drop_console: true }
				},
				extractComments: false,
				test: /\.js(\?.*)?$/i
			} )
		]

	}
};
