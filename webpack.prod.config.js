"use strict";

const webpack = require("webpack");
const path = require("path");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const BrotliGzipPlugin = require("brotli-gzip-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackAlterAssetPlugin = require("html-webpack-alter-asset-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin");
const Visualizer = require("webpack-visualizer-plugin");

module.exports = {

	devtool: false,

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
		filename: "static/js/[name].[hash:8].bundle.js",
		chunkFilename: "static/js/[id].[hash:8].chunk.js"
	},

	module: {
		rules: [{
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
						sourceMap: false,
						importLoaders: 1
					}
				}, {
					loader: "postcss-loader",
					options: {
						sourceMap: false,
						ident: "postcss",
						plugins: () => {
							return [
								autoprefixer(),
								cssnano({
									safe: true,
									autoprefixer: false,
									discardComments: {
										removeAll: true
									}
								})
							];
						}
					}
				}, {
					loader: "sass-loader",
					options: {
						sourceMap: false,
						precision: 8
					}
				}]
			})
		}, {
			test: /\.(eot|otf|ttf|woff|woff2)$/,
			loader: "file-loader?publicPath=/&outputPath=static/fonts/&name=[name].[hash:8].[ext]"
		}, {
			test: /\.(jpg|png|gif|svg|ico)$/,
			loader: "file-loader?publicPath=/&outputPath=static/gfx/&name=[name].[hash:8].[ext]"
		}, {
			test: /\.js$/,
			include: path.join(process.cwd(), "source/static/js"),
			loader: "file-loader?publicPath=/&outputPath=static/js/&name=[name].[hash:8].[ext]"
		}, {
			test: /\.json/,
			include: path.join(process.cwd(), "source/static/models"),
			loader: "file-loader?publicPath=/&outputPath=static/models/&name=[name].[hash:8].[ext]"
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
				"PRODUCTION": JSON.stringify(true)
			}
		}),
		new webpack.EnvironmentPlugin({
			"NODE_ENV": "production"
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
			minify: {
				html5: true,
				caseSensitive: true,
				collapseWhitespace: true,
				removeComments: true,
				lint: false,
				minifyJS: true,
				minifyCSS: true
			}
		}),
		new ExtractTextPlugin({
			filename: "static/css/[name].[hash:8].css"
		}),
		new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: "defer"
		}),
		new StyleExtHtmlWebpackPlugin({
			chunks: ["main"]
		}),
		new HtmlWebpackAlterAssetPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(true),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: false,
			mangle: true,
			output: {
				comments: false
			},
			compress: {
				booleans: true,
				cascade: true,
				comparisons: true,
				conditionals: true,
				dead_code: true,
				drop_console: true,
				drop_debugger: true,
				evaluate: true,
				if_return: true,
				join_vars: true,
				loops: true,
				properties: true,
				screw_ie8: true,
				sequences: true,
				unused: true
			}
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.HashedModuleIdsPlugin({
			"hashFunction": "md5",
			"hashDigest": "base64",
			"hashDigestLength": 4
		}),
		new BrotliGzipPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.(json|js|css|svg)$/,
			threshold: 0,
			minRatio: 0.8
		}),
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
