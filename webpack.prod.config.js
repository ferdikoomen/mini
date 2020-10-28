'use strict';

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');


const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


module.exports = {

	mode: 'production',

	bail: true,

	entry: {
		'main': [
			'./src/static/ts/main.ts',
		]
	},

	externals: {
		three: 'THREE',
		Ammo: 'Ammo'
	},

	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		filename: 'static/js/[name].js'
	},

	devtool: false,

	resolve: {
		extensions: ['.ts', '.js', '.scss']
	},

	module: {
		rules: [{
			test: /\.ts$/,
			include: path.resolve(__dirname, 'src/static/ts'),
			use: [{
				loader: 'babel-loader',
				options: {
					presets: [
						['@babel/env', {
							modules: false,
							useBuiltIns: 'entry',
							corejs: 2
						}]
					]
				}
			}, {
				loader: 'ts-loader',
				options: {
					onlyCompileBundledFiles: true,
					transpileOnly: true,
					compilerOptions: {
						sourceMap: false
					}
				}
			}]
		}, {
			test: /\.scss$/,
			include: path.resolve(__dirname, 'src/static/scss'),
			use: [{
				loader: MiniCssExtractPlugin.loader,
			}, {
				loader: 'css-loader',
				options: {
					importLoaders: 1
				}
			}, {
				loader: 'postcss-loader',
				options: {
					postcssOptions: {
						ident: 'postcss',
						plugins: [
							autoprefixer(),
							cssnano({
								safe: true,
								autoprefixer: false,
								discardComments: {
									removeAll: true
								}
							})
						]
					}
				}
			}, {
				loader: 'sass-loader'
			}]
		}, {
			test: /\.(eot|otf|ttf|woff|woff2)$/,
			include: path.resolve(__dirname, 'src/static/fonts'),
			loader: 'file-loader',
			options: {
				publicPath: '/static/fonts/',
				outputPath: 'static/fonts/',
				name: '[name].[ext]'
			}
		}, {
			test: /\.(jpg|png|webp|gif|svg|ico)$/,
			include: path.resolve(__dirname, 'src/static/gfx'),
			loader: 'file-loader',
			options: {
				publicPath: '/static/gfx/',
				outputPath: 'static/gfx/',
				name: '[name].[ext]'
			}
		}, {
			test: /\.js$/,
			include: path.resolve(__dirname, 'src/static/js'),
			loader: 'file-loader',
			options: {
				publicPath: '/static/js/',
				outputPath: 'static/js/',
				name: '[name].[ext]'
			}
		}, {
			test: /\.json$/,
			include: path.resolve(__dirname, 'src/static/models'),
			loader: 'file-loader',
			options: {
				publicPath: '/static/models/',
				outputPath: 'static/models/',
				name: '[name].[ext]'
			}
		}, {
			test: /\.glsl$/,
			include: path.resolve(__dirname, 'src/static/shaders'),
			use: [{
				loader: 'raw-loader'
			}]
		}]
	},

	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'production',
			DEBUG: false
		}),

		new ForkTsCheckerWebpackPlugin({
			async: false
		}),

		new CopyWebpackPlugin({
			patterns: [
				{from: 'src/robots.txt', to: '.'},
				{from: 'src/sitemap.xml', to: '.'},
				{from: 'src/static/js/*.*', to: './static/js/', flatten: true},
				{from: 'src/static/gfx/*.*', to: './static/gfx/', flatten: true},
				{from: 'src/static/models/*.*', to: './static/models/', flatten: true},
				{from: 'node_modules/three/build/three.min.js', to: './static/js/three.js'}
			]
		}),

		new MiniCssExtractPlugin({
			filename: 'static/css/[name].css'
		}),

		new HtmlWebpackPlugin({
			template: 'src/index.html',
			filename: 'index.html',
			hash: false,
			inject: true,
			compile: true,
			cache: true,
			showErrors: true,
			minify: {
				html5: true,
				caseSensitive: true,
				collapseWhitespace: true,
				removeComments: true,
				lint: false,
				minifyJS: true,
				minifyCSS: true
			},
			chunksSortMode: 'manual',
			chunks: ['main']
		}),

		new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: 'defer'
		})
	],

	optimization: {
		splitChunks: false,
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					mangle: true,
					output: {
						comments: false
					},
					compress: {
						arrows: true,
						booleans: true,
						comparisons: true,
						conditionals: true,
						dead_code: true,
						drop_console: true,
						drop_debugger: true,
						evaluate: true,
						if_return: true,
						inline: true,
						join_vars: true,
						loops: true,
						properties: true,
						sequences: true,
						unused: true,
						warnings: false
					}
				}
			})
		]
	},

	performance: {
		hints: false,
	},

	watchOptions: {
		ignored: /node_modules|dist/
	},
};
