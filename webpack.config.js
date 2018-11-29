'use strict';
var path = require('path'),
	webpack = require("webpack"),
	autoprefixer = require("autoprefixer"),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	MiniCssExtractPlugin = require("mini-css-extract-plugin"),
	BabelMinifyPlugin = require("babel-minify-webpack-plugin");

let isProduction = (process.env.NODE_ENV === 'production');

module.exports = {
	entry: './src/js/main.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'release')
	},
	devtool: isProduction ? null : "cheap-module-source-map",
	devServer: {
		contentBase: path.join(__dirname, './src/'),
		watchContentBase: true,
		inline: true,
		progress: true,
		compress: true,
		overlay: true
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			}
		}, {
			test: /\.css$/,
			use: [
				'style-loader',
				MiniCssExtractPlugin.loader,
				"css-loader",
				'postcss-loader'
			]
		}, {
			test: /\.(png|gif|jpe?g)$/i,
			loaders: [{
					loader: 'file-loader',
					options: {
						context: 'src',
						name: '[path][name].[ext]'
					}
				},
				'img-loader',
			]
		}, {
			test: /\.svg$/,
			loader: 'svg-url-loader',
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: false,
			hash: false,
			template: './src/index.html',
			filename: 'index.html',
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true
			}
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				postcss: [
					autoprefixer()
				]
			}
		}),
		isProduction ?
		new webpack.LoaderOptionsPlugin({
			minimize: true
		}) :
		false,
		isProduction ?
		new BabelMinifyPlugin() :
		false
	].filter(Boolean)
};