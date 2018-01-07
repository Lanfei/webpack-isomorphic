'use strict';

const path = require('path');
const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const webpackIsomorphic = require('..');

const app = express();

const port = 8080;
const viewsDir = path.join(__dirname, './views/dist');
const isProduction = process.env['NODE_ENV'] !== 'development';

// Setup webpack-isomorphic
webpackIsomorphic.install(viewsDir, {
	cache: isProduction
});

// Render a react class to string
function renderToString(reactClass, data) {
	let classPath = path.join(viewsDir, reactClass);
	let element = React.createElement(require(classPath).default, data);
	return ReactDOMServer.renderToString(element);
}

// Output request log
app.use(function (req, res, next) {
	res.on('finish', function () {
		let now = new Date();
		console.log('[' + now.toLocaleString() + ']', req.method, req.url, res.statusCode);
	});
	next();
});

// Serve static files
app.use('/statics', express.static(path.join(viewsDir, 'statics')));

// Render react classes by request path
app.use(function (req, res) {

	if (!isProduction) {
		// Clear caches
		Object.keys(require.cache).forEach(function (key) {
			delete require.cache[key];
		});
	}

	let context = {};
	let data = {
		appName: 'React isomorphic'
	};
	let html = renderToString('server-router.js', {
		context: context,
		location: req.url,
		data: data
	});
	if (context.url) {
		res.redirect(context.statusCode || 301, context.url);
	} else {
		res.end('<!DOCTYPE html>' + renderToString('root.js', {
			data: data,
			html: html,
			chunks: webpackIsomorphic.getChunks()
		}));
	}
});

app.listen(port, function () {
	console.log('Listening on', port);
});
