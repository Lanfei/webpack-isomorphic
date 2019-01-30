'use strict';

const fs = require('fs');
const url = require('url');
const path = require('path');
const Module = require('module');

// require hack
// @see https://github.com/nodejs/node/blob/master/lib/module.js
exports.install = function (context, options) {
	exports.uninstall && exports.uninstall();

	if (!path.isAbsolute(context)) {
		context = path.join(process.cwd(), context);
	}

	options = options || {};
	let cache = options['cache'] !== false;
	let assetsFilePath = options.assetsFilePath || path.join(context, 'webpack.assets.json');
	if (!path.isAbsolute(assetsFilePath)) {
		assetsFilePath = path.join(process.cwd(), assetsFilePath);
	}

	let assets;
	let files = {};
	let extensions = [];

	function loadAssets() {
		try {
			assets = JSON.parse(fs.readFileSync(assetsFilePath).toString());
		} catch (e) {
			console.warn('Warning: \'' + assetsFilePath + '\' is not valid.');
			return;
		}

		files = assets.files || {};
		extensions = assets.extensions || [];

		extensions.forEach(function (ext) {
			Module._extensions['.' + ext] = function (module, filename) {
				if (!cache) {
					delete Module._cache[filename];
				}
				let relative = path.relative(context, filename);
				module._compile(files[relative], filename);
			}
		});
	}

	let originalLoad = Module._load;
	Module._load = function (request, parent, isMain) {
		let filename = Module._resolveFilename(request, parent, isMain);
		if (path.relative(context, filename).indexOf('node_modules') < 0) {
			delete Module._cache[filename];
		}
		return originalLoad.apply(Module, arguments);
	};

	let originalFindPath = Module._findPath;
	Module._findPath = function (request, paths) {
		if (!assets || !cache) {
			loadAssets();
		}
		let i, l;
		let filename;
		let relative;
		let ext = path.extname(url.parse(request).pathname).slice(1);
		if (extensions.indexOf(ext) < 0) {
			return originalFindPath.apply(Module, arguments);
		}
		for (i = 0, l = paths.length; i < l; ++i) {
			filename = path.join(paths[i], request);
			relative = path.relative(context, filename);
			if (files[relative] !== undefined) {
				return filename;
			}
		}
	};

	exports.getChunks = function () {
		if (!assets || !cache) {
			loadAssets();
		}
		return assets && assets.chunks ? assets.chunks : {};
	};

	exports.uninstall = function () {
		exports.getChunks = null;
		extensions.forEach(function (ext) {
			delete Module._extensions['.' + ext];
		});
	};

};
