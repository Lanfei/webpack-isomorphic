'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IsomorphicPlugin = require('../plugin');

const isomorphicPlugin = new IsomorphicPlugin({
	extensions: ['jpg', 'png', 'gif', 'css']
});
const extractTextPlugin = new ExtractTextPlugin('css/[name].[contenthash:6].css');

module.exports = {
	context: __dirname + '/views/src',
	entry: './js/index.js',
	output: {
		path: __dirname + '/views/dist',
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
		isomorphicPlugin,
		extractTextPlugin
	]
};
