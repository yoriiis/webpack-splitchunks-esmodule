const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ChunksWebpackPlugin = require('chunks-webpack-plugin');

/**
 * Generator for Webpack configuration according to the target browsers (modern | legacy)
 *
 * @param {String} browsers Browsers type (modern|legacy)
 * @param {Boolean} isProduction Webpack mode (development|production)
 * @param {Object} presets Babel presets according to the browsers type (modern|legacy)
 *
 * @returns {Object} Object with the Webpack base configuration
 */
const generateWebpackConfig = ({ browsers, isProduction, presets }) => {
	return {
		name: browsers,
		watch: !isProduction,
		devtool: !isProduction ? 'source-map' : 'none',
		entry: {
			home: './src/home.js',
			news: './src/news.js'
		},
		output: {
			path: path.resolve(__dirname, `./dist/assets/${browsers}`),
			filename: '[name].js',
			sourceMapFilename: '[file].map'
		},
		stats: {
			modules: false,
			entrypoints: false,
			excludeAssets: /.map$/,
			assetsSort: '!size'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					options: {
						presets
					}
				},
				{
					test: /\.css$/i,
					use: [MiniCssExtractPlugin.loader, 'css-loader']
				}
			]
		},
		resolve: {
			extensions: ['.js', '.css']
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[name].css'
			}),
			new ChunksWebpackPlugin({
				outputPath: path.resolve(__dirname, `./dist/templates/${browsers}`),
				fileExtension: '.html.twig',
				templateStyle: `<link rel="stylesheet" href="{{chunk}}" />`,
				templateScript: `<script defer${
					browsers === 'modern' ? ' type="module"' : ' nomodule'
				} src="{{chunk}}"></script>`
			})
		],
		optimization: {
			splitChunks: {
				chunks: 'all',
				name: true
			}
		}
	};
};

/**
 * Export Webpack configuration for modern and legacy browsers
 *
 * @param {Object} env Node.js environment variables
 * @param {Object} argv Options passed to Webpack (argv)
 *
 * @returns {Array} Array of Webpack configurations
 */
module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';

	const configModern = generateWebpackConfig({
		browsers: 'modern',
		isProduction,
		presets: [
			[
				'@babel/preset-env',
				{
					targets: {
						esmodules: true
					}
				}
			]
		]
	});

	const configLegacy = generateWebpackConfig({
		browsers: 'legacy',
		isProduction,
		presets: [
			[
				'@babel/preset-env',
				{
					targets: {
						esmodules: false
					},
					useBuiltIns: 'usage',
					corejs: 3
				}
			]
		]
	});

	return [configModern, configLegacy];
};
