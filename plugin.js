var fs = require('fs');
var path = require('path');

function IsomorphicPlugin(options) {
	this.extensions = options.extensions || [];
}

IsomorphicPlugin.prototype.apply = function (compiler) {
	var files = {};
	var extensions = this.extensions || [];
	var assets = {extensions: extensions, files: files};
	var options = compiler.options;
	var context = options.context;
	var publicPath = options.output.publicPath;

	compiler.plugin('emit', function (compilation, callback) {

		compilation.modules.forEach(function (module) {
			var ext = path.extname(module.resource).slice(1);
			if (extensions.indexOf(ext) >= 0) {
				var prefix = 'var __webpack_public_path__ = \'' + publicPath + '\';';
				var filename = path.relative(context, module.resource);
				if (module._source) {
					files[filename] = prefix + module._source._value;
				} else {
					files[filename] = 'undefined';
				}
			}
		});

		var json = JSON.stringify(assets);
		compilation.assets['webpack.assets.json'] = {
			source: function () {
				return json;
			},
			size: function () {
				return json.length;
			}
		}
		callback();
	});
};

module.exports = IsomorphicPlugin;
