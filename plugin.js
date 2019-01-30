'use strict';

const fs = require('fs');
const url = require('url');
const path = require('path');
const mkdirp = require('mkdirp');

function IsomorphicPlugin(options) {
	this.extensions = options.extensions || [];
	this.assetsFilePath = options.assetsFilePath || null;
}

IsomorphicPlugin.prototype.apply = function (compiler) {
	let files = {};
	let chunks = {};
	let extensions = this.extensions;
	let assetsFilePath = this.assetsFilePath || 'webpack.assets.json';
	let assets = {extensions: extensions, files: files, chunks: chunks};
	let options = compiler.options;
	let context = options.context || process.cwd();
	let outputPath = options.output.path || '';
	let publicPath = options.output.publicPath || '';

	if (compiler.hooks) {
		compiler.hooks.done.tap('webpack-isomorphic-plugin', createAssetsFile);
	} else {
		compiler.plugin('done', createAssetsFile);
	}

	function createAssetsFile(stats) {
		let json = stats.toJson();
		let modules = json['modules'];
		modules.forEach(function (module) {
			let name = module['name'] || '';
			let ext = path.extname(url.parse(name).pathname).slice(1);
			if (name.indexOf('!') < 0 && extensions.indexOf(ext) >= 0) {
				let prefix = 'let __webpack_public_path__ = "' + publicPath + '";';
				let filename = path.normalize(name);
				let source = module['source'];

				if (path.isAbsolute(filename)) {
					filename = path.relative(context, filename);
				}

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

		if (!path.isAbsolute(assetsFilePath)) {
			assetsFilePath = path.join(outputPath, assetsFilePath);
		}
		mkdirp.sync(path.dirname(assetsFilePath));
		fs.writeFileSync(assetsFilePath, JSON.stringify(assets));
	}
};

module.exports = IsomorphicPlugin;
