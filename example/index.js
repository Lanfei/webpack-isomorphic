'use strict';

const path = require('path');
const express = require('express');
const compression = require('compression');
const ssr = require('./ssr');

const port = 8080;
const app = express();
const viewsDir = path.join(__dirname, './views/dist');

// E Compression
app.use(compression());

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

// Server side rendering
app.use(ssr(viewsDir));

app.listen(port, function () {
	console.log('Listening on', port);
});
