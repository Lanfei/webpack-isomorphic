var fs = require('fs');
var path = require('path');
var Module = require('module');

function loadAssets(context) {
	var filename = path.join(context, 'webpack.assets.json');
	try {
		return JSON.parse(fs.readFileSync(filename));
	} catch (e) {
		console.warn('Warning: \'' + filename + '\' is not valid.');
	}
	return {};
}

exports.install = function (context) {
	var assets = loadAssets(context);
	var files = assets.files || {};
	var extensions = assets.extensions || [];

	// require hack
	// @see https://github.com/nodejs/node/blob/master/lib/module.js
	var original = Module._resolveFilename;
	Module._resolveFilename = function (request, parent) {
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

	extensions.forEach(function (ext) {
		Module._extensions['.' + ext] = function (module, filename) {
			var relative = path.relative(context, filename);
			module._compile(files[relative], filename);
		}
	});

};
