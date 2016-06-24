var fs = require('fs');
var path = require('path');
var Module = require('module');

// require hack
// @see https://github.com/nodejs/node/blob/master/lib/module.js
exports.install = function (context, opts) {
	opts = opts || {};
	var cache = opts['cache'] !== false;

	var assets;
	var files;
	var extensions;

	function loadAssets() {
		var filename = path.join(context, 'webpack.assets.json');
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
				var relative = path.relative(context, filename);
				module._compile(files[relative], filename);
			}
		});
	}

	var original = Module._resolveFilename;
	Module._resolveFilename = function (request, parent) {
		if (!assets || !cache) {
			loadAssets();
		}
		var ext = path.extname(request).slice(1);
		var filename = path.join(path.dirname(parent.filename), request);
		if (extensions.indexOf(ext) >= 0) {
			var relative = path.relative(context, filename);
			if (files[relative] !== undefined) {
				return filename;
			}
		}
		var parentExt = path.extname(parent.filename).slice(1);
		if (extensions.indexOf(parentExt) >= 0 && !path.isAbsolute(request)) {
			return filename;
		}
		return original.apply(Module, arguments);
	};

};
