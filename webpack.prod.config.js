"use strict";

const webpack = require("webpack");
const path = require("path");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");


const BrotliGzipPlugin = require("brotli-gzip-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");


module.exports = {

	mode: "production",

	bail: true,

	entry: {
		"main": [
			"./src/static/ts/main.ts",
		]
	},

	externals: {
		three: "THREE",
		Ammo: "Ammo"
	},

	output: {
		path: path.resolve(process.cwd(), "deploy"),
		publicPath: "/",
		filename: "static/js/[name].js"
	},

	devtool: false,

	resolve: {
		extensions: [".ts", ".js", ".scss"]
	},

	module: {
		rules: [{
			test: /\.ts$/,
			loader: "ts-loader"
		}, {
			test: /\.scss$/,
			use: [{
				loader: MiniCssExtractPlugin.loader,
			}, {
				loader: "css-loader",
				options: {
					importLoaders: 1
				}
			}, {
				loader: "postcss-loader",
				options: {
					ident: "postcss",
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
			}, {
				loader: "sass-loader"
			}]
		}, {
			test: /\.(eot|otf|ttf|woff|woff2)$/,
			loader: "file-loader?publicPath=/static/fonts/&outputPath=static/fonts/&name=[name].[ext]"
		}, {
			test: /\.(jpg|png|webp|gif|svg|ico)$/,
			include: path.resolve(process.cwd(), "src/static/gfx"),
			loader: "file-loader?publicPath=/static/gfx/&outputPath=static/gfx/&name=[name].[ext]"
		}, {
			test: /\.js$/,
			include: path.resolve(process.cwd(), "src/static/js"),
			loader: "file-loader?publicPath=/static/js/&outputPath=static/js/&name=[name].[ext]"
		}, {
			test: /\.json$/,
			include: path.resolve(process.cwd(), "src/static/models"),
			loader: "file-loader?publicPath=/static/models/&outputPath=static/models/&name=[name].[ext]"
		}]
	},

	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: "production",
			DEBUG: false
		}),

		new CopyWebpackPlugin([
			{from: "src/robots.txt", to: "."},
			{from: "src/sitemap.xml", to: "."},
			{from: "src/static/js/*.*", to: "./static/js/", flatten: true},
			{from: "src/static/gfx/*.*", to: "./static/gfx/", flatten: true},
			{from: "src/static/models/*.*", to: "./static/models/", flatten: true},
			{from: "node_modules/three/build/three.min.js", to: "./static/js/three.js"}
		]),

		new MiniCssExtractPlugin({
			filename: "static/css/[name].css"
		}),

		new HtmlWebpackPlugin({
			template: "src/index.html",
			filename: "index.html",
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
			chunksSortMode: "manual",
			chunks: ["main"]
		}),

		new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: "defer"
		}),

		new BrotliGzipPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.(json|js|css|svg)$/,
			threshold: 0,
			minRatio: 0.8
		})
	],

	optimization: {
		minimizer: [
			new UglifyJSPlugin({
				parallel: true, // !important to speedup the build process
				cache: true,
				uglifyOptions: {
					mangle: true,
					output: {
						comments: false
					},
					compress: {
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
		],
	},

	performance: {
		hints: false,
	},

	watchOptions: {
		ignored: /node_modules|deploy/
	},
};
