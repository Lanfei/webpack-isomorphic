'use strict';

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IsomorphicPlugin = require('../plugin');

const cleanPlugin = new CleanWebpackPlugin(path.join(__dirname, '/views/dist'));
const extractTextPlugin = new ExtractTextPlugin('css/[name].[contenthash:6].css');
const isomorphicPlugin = new IsomorphicPlugin({
	extensions: ['jpg', 'png', 'gif', 'css']
});

module.exports = {
	context: path.join(__dirname, '/views/src'),
	entry: './js/index.js',
	output: {
		path: path.join(__dirname, '/views/dist'),
		filename: 'js/[name].[chunkhash:6].js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: 'babel-loader'
		}, {
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: 'css-loader?modules'
			})
		}, {
			test: /\.(jpg|png|gif$)/,
			use: 'file-loader?name=img/[name].[hash:6].[ext]'
		}]
	},
	plugins: [
		cleanPlugin,
		isomorphicPlugin,
		extractTextPlugin
	]
};
