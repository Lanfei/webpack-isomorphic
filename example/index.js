'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const webpackIsomorphic = require('..');

const port = 8080;
const viewsDir = path.join(__dirname, './views/dist');
const isProduction = process.env['NODE_ENV'] !== 'development';

let factoryCaches = {};

webpackIsomorphic.install(viewsDir, {
	cache: isProduction
});

function renderToString(reactClass, data) {
	let classPath = path.join(viewsDir, reactClass);
	let factory;
	if (isProduction) {
		factory = factoryCaches[classPath] = factoryCaches[classPath] || React.createFactory(require(classPath).default);
	} else {
		factory = React.createFactory(require(classPath).default);
	}
	return ReactDOMServer.renderToString(factory(data));
}

const server = http.createServer(function (req, res) {

	if (!isProduction) {
		// Clear caches
		Object.keys(require.cache).forEach(function (key) {
			delete require.cache[key];
		});
	}

	if (req.url === '/') {
		// Server-side rendering
		let initialData = {appName: 'React isomorphic'};
		let initialHTML = renderToString('js/index.js', initialData);
		let html = renderToString('app', {
			data: initialData,
			html: initialHTML,
			chunks: webpackIsomorphic.getChunks()
		});
		res.end('<!DOCTYPE html>' + html);

		// const reactClass = path.join(viewsDir, 'app.js');
		// const factory = React.createFactory(require(reactClass).default);
		// const initialData = {
		// 	component: require(path.join(viewsDir, 'js/index.js')).default,
		// 	chunks: webpackIsomorphic.getChunks(),
		// 	store: {appName: 'React isomorphic'}
		// };
		// res.end('<!DOCTYPE html>' + ReactDOMServer.renderToString(factory(initialData)));
	} else {
		// Static assets
		let filename = path.join(viewsDir, req.url);
		fs.readFile(filename, function (err, data) {
			if (err) {
				res.statusCode = 404;
				res.end();
			} else {
				res.end(data);
			}
		});
	}

	// Logs
	res.on('finish', function () {
		let now = new Date();
		console.log('[' + now.toLocaleString() + ']', req.method, req.url, res.statusCode);
	});

});
server.listen(port);
server.on('listening', function () {
	console.log('Listening on', port);
});
