'use strict';

const fs = require('fs');
const path = require('path');

function IsomorphicPlugin(options) {
	this.extensions = options.extensions || [];
}

IsomorphicPlugin.prototype.apply = function (compiler) {
	var files = {};
	var chunks = {};
	var extensions = this.extensions || [];
	var assets = {extensions: extensions, files: files, chunks: chunks};
	var options = compiler.options;
	var context = options.context;
	var outputPath = options.output.path || '';
	var publicPath = options.output.publicPath || '';

	compiler.plugin('done', function (stats) {
		var json = stats.toJson();
		var modules = json['modules'];
		modules.forEach(function (module) {
			var name = module['name'] || '';
			var ext = path.extname(name).slice(1);
			if (name.indexOf('!') < 0 && extensions.indexOf(ext) >= 0) {
				var prefix = 'var __webpack_public_path__ = \'' + publicPath + '\';';
				var filename = path.relative(context, name);
				var source = module['source'];

				if (source) {
					files[filename] = prefix + source;
				} else {
					files[filename] = 'undefined';
				}
			}
		});
		var assetsByChunkName = json['assetsByChunkName'];
		Object.keys(assetsByChunkName).forEach(function (chunkName) {
			var assets = assetsByChunkName[chunkName];
			if (!Array.isArray(assets)) {
				assets = [assets];
			}
			assets.forEach(function (asset) {
				var ext = path.extname(asset).slice(1);
				var chunksByExt = chunks[ext] = chunks[ext] || {};
				chunksByExt[chunkName] = publicPath + asset;
			});
		});

		fs.writeFileSync(path.join(outputPath, 'webpack.assets.json'), JSON.stringify(assets));
	});
};

module.exports = IsomorphicPlugin;
