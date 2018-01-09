'use strict';

const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const webpackIsomorphic = require('..');

const isDevelopment = process.env['NODE_ENV'] === 'development';

module.exports = function (viewsDir) {
	// Render a react class to string
	function renderToString(reactClass, data) {
		let classPath = path.join(viewsDir, reactClass);
		let element = React.createElement(require(classPath).default, data);
		return ReactDOMServer.renderToString(element);
	}

	// SSR middleware
	return function (req, res) {
		// Setup webpack-isomorphic at first request
		webpackIsomorphic.install(viewsDir, {
			cache: !isDevelopment
		});

		let context = {};
		let data = {
			appName: 'React isomorphic'
		};
		let html = renderToString('ssr-router.js', {
			context: context,
			location: req.url,
			data: data
		});
		if (context.statusCode) {
			res.status(context.statusCode);
		}
		if (context.url) {
			res.redirect(context.statusCode || 301, context.url);
		} else {
			res.end('<!DOCTYPE html>' + renderToString('html-helper.js', {
				data: data,
				html: html,
				chunks: webpackIsomorphic.getChunks()
			}));
		}
	};
};
