'use strict';

const fs = require('fs');
const path = require('path');
const Module = require('module');

// require hack
// @see https://github.com/nodejs/node/blob/master/lib/module.js
exports.install = function (context, opts) {
	opts = opts || {};
	let cache = opts['cache'] !== false;

	let assets;
	let files;
	let extensions;

	function loadAssets() {
		let filename = path.join(context, 'webpack.assets.json');
		try {
			assets = JSON.parse(fs.readFileSync(filename));
		} catch (e) {
			console.warn('Warning: \'' + filename + '\' is not valid.');
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

	let original = Module._findPath;
	Module._findPath = function (request, paths) {
		if (!assets || !cache) {
			loadAssets();
		}
		let i, l;
		let filename;
		let relative;
		let ext = path.extname(request).slice(1);
		for (i = 0, l = paths.length; i < l; ++i) {
			filename = path.join(paths[i], request);
			if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
				return filename;
			}
		}
		if (extensions.indexOf(ext) < 0) {
			return original.apply(Module, arguments);
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
		return assets.chunks || {};
	};

};
