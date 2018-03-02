'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function IsomorphicPlugin(options) {
	this.extensions = options.extensions || [];
}

IsomorphicPlugin.prototype.apply = function (compiler) {
	let files = {};
	let chunks = {};
	let extensions = this.extensions || [];
	let assets = {extensions: extensions, files: files, chunks: chunks};
	let options = compiler.options;
	let outputPath = options.output.path || '';
	let publicPath = options.output.publicPath || '';

	compiler.plugin('done', function (stats) {
		let json = stats.toJson();
		let modules = json['modules'];
		modules.forEach(function (module) {
			let name = module['name'] || '';
			let ext = path.extname(name).slice(1);
			if (name.indexOf('!') < 0 && extensions.indexOf(ext) >= 0) {
				let prefix = 'let __webpack_public_path__ = \'' + publicPath + '\';';
				let filename = path.normalize(name);
				let source = module['source'];

				if (source) {
					files[filename] = prefix + source;
				} else {
					files[filename] = 'undefined';
				}
			}
		});

		let assetsByChunkName = json['assetsByChunkName'];
		Object.keys(assetsByChunkName).forEach(function (chunkName) {
			let assets = assetsByChunkName[chunkName];
			if (!Array.isArray(assets)) {
				assets = [assets];
			}
			let chunksByName = chunks[chunkName] = [];
			assets.forEach(function (asset) {
				chunksByName.push(publicPath + asset);
			});
		});

		mkdirp.sync(outputPath);
		fs.writeFileSync(path.join(outputPath, 'webpack.assets.json'), JSON.stringify(assets));
	});
};

module.exports = IsomorphicPlugin;
