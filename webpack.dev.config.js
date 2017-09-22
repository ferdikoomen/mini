"use strict";

const webpack = require("webpack");
const path = require("path");
const autoprefixer = require("autoprefixer");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackAlterAssetPlugin = require("html-webpack-alter-asset-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const Visualizer = require("webpack-visualizer-plugin");

module.exports = {

	devtool: "source-map",

	resolve: {
		extensions: [".ts", ".js", ".scss"]
	},

	externals: {
		three: "THREE",
		Ammo: "Ammo"
	},

	entry: {
		main: "./source/static/ts/main.ts"
	},

	output: {
		path: path.join(process.cwd(), "deploy"),
		filename: "static/js/[name].bundle.js",
		chunkFilename: "static/js/[id].chunk.js"
	},

	module: {
		rules: [{
			test: /\.js$/,
			enforce: "pre",
			loader: "source-map-loader",
			exclude: /node_modules/
		}, {
			enforce: "pre",
			test: /\.ts$/,
			exclude: /\$\$_gendir/,
			loader: "tslint-loader"
		}, {
			test: /\.ts$/,
			loader: "ts-loader"
		}, {
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract({
				fallback: "style-loader",
				use: [{
					loader: "css-loader",
					options: {
						sourceMap: true,
						importLoaders: 1
					}
				}, {
					loader: "postcss-loader",
					options: {
						sourceMap: true,
						ident: "postcss",
						plugins: () => {
							return [
								autoprefixer()
							];
						}
					}
				}, {
					loader: "sass-loader",
					options: {
						sourceMap: true,
						precision: 8
					}
				}]
			})
		}, {
			test: /\.(eot|otf|ttf|woff|woff2)$/,
			loader: "file-loader?publicPath=/&outputPath=static/fonts/&name=[name].[ext]"
		}, {
			test: /\.(jpg|png|gif|svg|ico)$/,
			loader: "file-loader?publicPath=/&outputPath=static/gfx/&name=[name].[ext]"
		}, {
			test: /\.js$/,
			include: path.join(process.cwd(), "source/static/js"),
			loader: "file-loader?publicPath=/&outputPath=static/js/&name=[name].[ext]"
		}, {
			test: /\.json/,
			include: path.join(process.cwd(), "source/static/models"),
			loader: "file-loader?publicPath=/&outputPath=static/models/&name=[name].[ext]"
		}, {
			test: /\.html$/,
			loader: "raw-loader"
		}]
	},

	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.ProgressPlugin(),
		new webpack.DefinePlugin({
			"process.env": {
				"PRODUCTION": JSON.stringify(false)
			}
		}),
		new webpack.EnvironmentPlugin({
			"NODE_ENV": "development"
		}),
		new CleanWebpackPlugin(["deploy"], {
			verbose: true
		}),
		new HtmlWebpackPlugin({
			template: "source/index.ejs",
			filename: "index.html",
			hash: false,
			inject: true,
			compile: true,
			cache: true,
			showErrors: true,
			chunks: [
				"main"
			],
			chunksSortMode: "manual",
			xhtml: true,
			minify: false
		}),
		new ExtractTextPlugin({
			filename: "static/css/[name].css"
		}),
		new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: "defer"
		}),
		new HtmlWebpackAlterAssetPlugin(),
		new Visualizer({
			filename: "statistics.html"
		})
	],

	node: {
		fs: "empty",
		global: true,
		crypto: "empty",
		tls: "empty",
		net: "empty",
		process: true,
		module: false,
		clearImmediate: false,
		setImmediate: false
	},

	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000,
		ignored: /node_modules|deploy/
	},

	devServer: {
		port: 8080,
		host: "0.0.0.0",
		historyApiFallback: true,
		disableHostCheck: true
	}
};
