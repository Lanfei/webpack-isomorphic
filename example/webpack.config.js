var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var PagePlugin = require('page-webpack-plugin');
var IsomorphicPlugin = require('../plugin');

var pagePlugin = new PagePlugin({
	cwd: __dirname + '/views/src',
	files: '**/*.tpl'
});
var isomorphicPlugin = new IsomorphicPlugin({
	extensions: ['jpg', 'png', 'gif', 'css']
});
var extractTextPlugin = new ExtractTextPlugin('css/[name].[contenthash:6].css');

var config = {
	context: __dirname + '/views/src',
	output: {
		path: __dirname + '/views/dist',
		filename: 'js/[name].[chunkhash:6].js'
	},
	// watch: true,
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel-loader?presets[]=react&presets[]=es2015'
		}, {
			test: /\.css$/,
			loader: ExtractTextPlugin.extract('style-loader', 'css-loader?module', {publicPath: '../'})
		}, {
			test: /\.(jpg|png|gif$)/,
			loader: 'file-loader?name=img/[name].[hash:6].[ext]'
		}, {
			test: /\.(tpl|html$)/,
			loader: 'html-loader?removeAttributeQuotes=false&collapseWhitespace=false'
		}]
	},
	resolve: {
		extentions: ['js', 'jsx']
	},
	plugins: [
		pagePlugin,
		isomorphicPlugin,
		extractTextPlugin
	]
};

module.exports = config;
