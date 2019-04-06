"use strict";

const webpack = require("webpack");
const path = require("path");
const autoprefixer = require("autoprefixer");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");


module.exports = {

	mode: "development",

	bail: true,

	entry: {
		"main": [
			"./src/static/ts/main.ts",
			"webpack-dev-server/client?http://localhost:8080"
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

	devtool: "cheap-module-eval-source-map",

	devServer: {
		port: 8080,
		host: "0.0.0.0",
		contentBase: path.resolve(process.cwd(), "deploy"),
		historyApiFallback: true,
		disableHostCheck: true,
		inline: true,
		open: true
	},

	resolve: {
		extensions: [".ts", ".js", ".scss"]
	},

	module: {
		rules: [{
			test: /\.js$/,
			enforce: "pre",
			loader: "source-map-loader",
			exclude: /node_modules/
		}, {
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
						autoprefixer()
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
			loader: "file-loader?publicPath=/static/data/&outputPath=static/models/&name=[name].[ext]"
		}, {
			test: /\.hbs$/,
			loader: "handlebars-loader"
		}]
	},

	plugins: [
		new HardSourceWebpackPlugin({
			cacheDirectory: "../node_modules/.cache/hard-source/[confighash]",
			environmentHash: {
				root: process.cwd(),
				directories: [],
				files: [
					"package-lock.json",
					"yarn.lock",
					"webpack.dev.config.js"
				],
			},
		}),

		new webpack.EnvironmentPlugin({
			NODE_ENV: "development",
			DEBUG: true
		}),

		new CopyWebpackPlugin([
			{from: "src/robots.txt", to: "."},
			{from: "src/sitemap.xml", to: "."},
			{from: "src/static/js/*.*", to: "./static/js/", flatten: true},
			{from: "src/static/gfx/*.*", to: "./static/gfx/", flatten: true},
			{from: "src/static/models/*.*", to: "./static/models/", flatten: true},
			{from: "node_modules/three/build/three.js", to: "./static/js/three.js"}
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
			minify: false,
			chunksSortMode: "manual",
			chunks: ["main"]
		}),

		new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: "defer"
		})
	],

	optimization: {
		minimize: false,
	},

	performance: {
		hints: false,
	},

	watchOptions: {
		ignored: /node_modules|deploy/
	},
};
