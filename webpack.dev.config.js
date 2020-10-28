'use strict';

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {

	mode: 'development',

	bail: true,

	entry: {
		'main': [
			'./src/static/ts/main.ts',
			'webpack-dev-server/client?http://localhost:8080'
		]
	},

	externals: {
		three: 'THREE',
		Ammo: 'Ammo'
	},

	output: {
		path: path.resolve(process.cwd(), 'dist'),
		publicPath: '/',
		filename: 'static/js/[name].js'
	},

	devtool: 'cheap-module-source-map',

	devServer: {
		port: 8080,
		host: '0.0.0.0',
		contentBase: path.resolve(process.cwd(), 'dist'),
		historyApiFallback: true,
		disableHostCheck: true,
		inline: true,
		open: true
	},

	resolve: {
		extensions: ['.ts', '.js', '.scss']
	},

	module: {
		rules: [{
			test: /\.js$/,
			enforce: 'pre',
			loader: 'source-map-loader',
			exclude: /node_modules/
		}, {
			test: /\.ts$/,
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
					experimentalWatchApi: true,
					onlyCompileBundledFiles: true,
					transpileOnly: true,
					compilerOptions: {
						sourceMap: true
					}
				}
			}]
		}, {
			test: /\.scss$/,
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
							autoprefixer()
						]
					}
				}
			}, {
				loader: 'sass-loader'
			}]
		}, {
			test: /\.(eot|otf|ttf|woff|woff2)$/,
			loader: 'file-loader',
			options: {
				publicPath: '/static/fonts/',
				outputPath: 'static/fonts/',
				name: '[name].[ext]'
			}
		}, {
			test: /\.(jpg|png|webp|gif|svg|ico)$/,
			include: path.resolve(process.cwd(), 'src/static/gfx'),
			loader: 'file-loader',
			options: {
				publicPath: '/static/gfx/',
				outputPath: 'static/gfx/',
				name: '[name].[ext]'
			}
		}, {
			test: /\.js$/,
			include: path.resolve(process.cwd(), 'src/static/js'),
			loader: 'file-loader',
			options: {
				publicPath: '/static/js/',
				outputPath: 'static/js/',
				name: '[name].[ext]'
			}
		}, {
			test: /\.json$/,
			include: path.resolve(process.cwd(), 'src/static/models'),
			loader: 'file-loader',
			options: {
				publicPath: '/static/models/',
				outputPath: 'static/models/',
				name: '[name].[ext]'
			}
		}]
	},

	plugins: [

		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development',
			DEBUG: true
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
				{from: 'node_modules/three/build/three.js', to: './static/js/three.js'}
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
			minify: false,
			chunksSortMode: 'manual',
			chunks: ['main']
		}),

		new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: 'defer'
		})
	],

	optimization: {
		minimize: false,
	},

	performance: {
		hints: false,
	},

	watchOptions: {
		ignored: /node_modules|dist/
	},
};
