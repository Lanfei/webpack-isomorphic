'use strict';

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const IsomorphicPlugin = require('../plugin');

module.exports = {
	context: path.join(__dirname, '/views/src'),
	output: {
		publicPath: '/',
		path: path.join(__dirname, '/views/dist'),
		filename: 'assets/js/[name].[hash:6].js'
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			use: 'babel-loader',
			exclude: /node_modules/
		}, {
			test: /\.css$/,
			use: [MiniCssExtractPlugin.loader, 'css-loader']
		}, {
			test: /\.(jpg|png|gif$)/,
			use: 'file-loader?name=assets/img/[name].[hash:6].[ext]'
		}]
	},
	plugins: [
		new IsomorphicPlugin({extensions: ['jpg', 'png', 'gif', 'css']}),
		new MiniCssExtractPlugin({filename: 'assets/css/[name].[contenthash:6].css'})
	]
};
