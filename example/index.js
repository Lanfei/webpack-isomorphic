var fs = require('fs');
var path = require('path');
var http = require('http');
var gotpl = require('gotpl');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var webpackIsomorphic = require('../');

var port = 8080;
var viewsDir = path.join(__dirname, './views/dist');
var isProduction = process.env['NODE_ENV'] !== 'development';

gotpl.config('cache', isProduction);

webpackIsomorphic.install(viewsDir, {
	cache: isProduction
});

var server = http.createServer(function (req, res) {

	if (req.url === '/') {
		// Server-side rendering
		var initialData = {foo: 'bar'};
		var template = path.join(viewsDir, 'index.tpl');
		var reactClass = path.join(viewsDir, 'js/index.js');
		var factory = React.createFactory(require(reactClass));
		if (!isProduction) {
			delete require.cache[reactClass];
		}
		gotpl.renderFile(template, {
			initialData: initialData,
			initialHTML: ReactDOMServer.renderToString(factory(initialData))
		}, function (err, html) {
			if (err) {
				res.end(err.stack);
			} else {
				res.end(html)
			}
		});
	} else {
		// Static assets
		var filename = path.join(viewsDir, req.url);
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
		var now = new Date();
		console.log('[' + now.toLocaleString() + ']', req.method, req.url, res.statusCode);
	});

});
server.listen(port);
server.on('listening', function () {
	console.log('Listening on', port);
});
