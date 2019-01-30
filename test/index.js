'use strict';

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const IsomorphicPlugin = require('../plugin');
const webpackIsomorphic = require('..');
const assert = require('chai').assert;

const jsPattern = /assets\/main\.\w{6}\.js/;
const cssPattern = /assets\/main\.\w{6}\.css/;
const imagePattern = /assets\/image\.\w{6}\.jpg/;
const srcDir = path.join(__dirname, 'fixtures');
const distDir = path.join(__dirname, 'dist');
const assetsFilePath = path.join(distDir, 'webpack.assets.json');
const extensions = ['css', 'jpg', 'png', 'gif', 'svg', 'eot', 'woff2', 'woff', 'ttf'];
const baseConfig = {
	context: srcDir,
	mode: 'development',
	output: {
		publicPath: '/',
		path: distDir,
		filename: 'assets/[name].[hash:6].js'
	},
	module: {
		rules: [{
			test: /\.(jpg|png|gif|svg|eot|woff2|woff|ttf)$/,
			use: 'file-loader?name=assets/[name].[hash:6].[ext]'
		}]
	},
	plugins: [
		new IsomorphicPlugin({extensions})
	]
};
const cssExtractConfig = {
	module: {
		rules: [{
			test: /\.css$/,
			use: [MiniCssExtractPlugin.loader, 'css-loader?modules']
		}]
	},
	plugins: [
		new MiniCssExtractPlugin({filename: 'assets/[name].[contenthash:6].css'})
	]
};

describe('webpack-isomorphic/plugin', () => {
	it('should emit `webpack.assets.json`', done => {
		const config = webpackMerge(baseConfig, {entry: './import-image'});
		webpack(config, (err, stats) => {
			assert.ifError(err || stats.compilation.errors[0]);
			let assets = JSON.parse(fs.readFileSync(assetsFilePath).toString());
			assert.isOk(assets);
			assert.sameMembers(assets.extensions, extensions);
			assert.match(assets.files['image.jpg'], imagePattern);
			assert.property(assets.chunks, 'main');
			assert.match(assets.chunks.main[0], jsPattern);
			done();
		});
	});

	it('should work with `mini-css-extract-plugin`', done => {
		const config = webpackMerge(baseConfig, cssExtractConfig, {entry: './import-css'});
		webpack(config, (err, stats) => {
			assert.ifError(err || stats.compilation.errors[0]);
			let assets = JSON.parse(fs.readFileSync(assetsFilePath).toString());
			assert.isOk(assets);
			assert.sameMembers(assets.extensions, extensions);
			assert.property(assets.files, 'image.css');
			assert.property(assets.chunks, 'main');
			assert.match(assets.chunks.main[0], cssPattern);
			assert.match(assets.chunks.main[1], jsPattern);
			done();
		});
	});

	it('should work with assets in node_modules', done => {
		const config = webpackMerge(baseConfig, cssExtractConfig, {entry: './import-node-modules'});
		webpack(config, (err, stats) => {
			assert.ifError(err || stats.compilation.errors[0]);
			let assets = JSON.parse(fs.readFileSync(assetsFilePath).toString());
			assert.isOk(assets);
			assert.sameMembers(assets.extensions, extensions);
			assert.property(assets.files, 'image.css');
			assert.property(assets.files, 'image.jpg');
			assert.property(assets.files, '../../node_modules/material-design-icons/iconfont/material-icons.css');
			assert.property(assets.chunks, 'main');
			assert.match(assets.chunks.main[0], cssPattern);
			assert.match(assets.chunks.main[1], jsPattern);
			done();
		});
	});
});

describe('webpack-isomorphic', () => {
	it('should be able to import assets after `.install()`', () => {
		webpackIsomorphic.install(srcDir, {assetsFilePath});
		let chunks = webpackIsomorphic.getChunks();
		assert.property(chunks, 'main');
		assert.match(chunks.main[0], cssPattern);
		assert.match(chunks.main[1], jsPattern);
		let main = require('./fixtures/import-node-modules');
		assert.property(main.css, 'image');
		assert.match(main.image, imagePattern);
		assert.property(main.materialIcons, 'material-icons');
	});
	it('should work with relative paths', () => {
		webpackIsomorphic.install('test/fixtures', {assetsFilePath: 'test/dist/webpack.assets.json'});
		let chunks = webpackIsomorphic.getChunks();
		assert.property(chunks, 'main');
		assert.match(chunks.main[0], cssPattern);
		assert.match(chunks.main[1], jsPattern);
		let main = require('./fixtures/import-node-modules');
		assert.property(main.css, 'image');
		assert.match(main.image, imagePattern);
		assert.property(main.materialIcons, 'material-icons');
	});

	it('should work with `cache` option', () => {
		let cache = false;
		webpackIsomorphic.install(srcDir, {cache, assetsFilePath});
		let assets = JSON.parse(fs.readFileSync(assetsFilePath).toString());
		let main = require('./fixtures/import-node-modules');
		assert.match(main.image, imagePattern);
		assets.files['image.jpg'] = 'module.exports = "replaced";';
		assets.chunks.main.push('new-chunk.js');
		fs.writeFileSync(assetsFilePath, JSON.stringify(assets));
		main = require('./fixtures/import-node-modules');
		assert.strictEqual(main.image, 'replaced');
		let chunks = webpackIsomorphic.getChunks();
		assert.include(chunks.main, 'new-chunk.js');
	});

	it('should have no chunks after `.uninstall()`', () => {
		webpackIsomorphic.uninstall();
		assert.isNotOk(webpackIsomorphic.getChunks);
	});

	after(() => {
		rimraf.sync(distDir);
	});
});
