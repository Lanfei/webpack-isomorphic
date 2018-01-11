'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const ssr = require('./ssr');

const common = require('./webpack.common.js');

process.env.NODE_ENV = 'development';

module.exports = merge(common, {
	entry: [
		'react-hot-loader/patch',
		'./entry'
	],
	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		hot: true,
		port: 8080,
		compress: true,
		contentBase: false,
		after: function (app) {
			app.use(ssr(common.output.path));
		}
	}
});
