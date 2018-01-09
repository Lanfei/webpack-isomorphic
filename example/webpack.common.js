'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IsomorphicPlugin = require('../plugin');

module.exports = {
	context: path.join(__dirname, '/views/src'),
	output: {
		publicPath: '/',
		path: path.join(__dirname, '/views/dist'),
		filename: 'statics/js/[name].[hash:6].js'
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
			use: 'file-loader?name=statics/img/[name].[hash:6].[ext]'
		}]
	},
	plugins: [
		new ExtractTextPlugin('statics/css/[name].[contenthash:6].css'),
		new IsomorphicPlugin({extensions: ['jpg', 'png', 'gif', 'css']})
	]
};
