

const CopyPlugin = require( 'copy-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const path = require( 'path' );

module.exports = {
	context: __dirname,
	entry: ['./index'],
	mode: 'production',
	output: {
		path: path.resolve( __dirname, 'out' ),
		filename: 'bundle.js'
	},
	devServer: {
		overlay: true,
		compress: true,
		port: 9001
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/
			}
		]
	},

	plugins: [
		new HtmlWebpackPlugin( { template: './index.html' } ),
		new CopyPlugin( {
			patterns: [
				{
					from: 'assets',
					to: 'assets'
				},
				{
					from: 'favicon.svg',
					to: 'favicon.svg'
				}
			]
		} )
	]
};
