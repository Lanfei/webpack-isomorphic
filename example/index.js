'use strict';

const path = require('path');
const express = require('express');
const ssr = require('./ssr');

const port = 8080;
const app = express();
const viewsDir = path.join(__dirname, './views/dist');

// Output request log
app.use((req, res, next) => {
	res.on('finish', function () {
		let now = new Date();
		console.log('[' + now.toLocaleString() + ']', req.method, req.url, res.statusCode);
	});
	next();
});

// Serve static files
app.use('/assets', express.static(path.join(viewsDir, 'assets')));

// Server side rendering
app.use(ssr(viewsDir));

app.listen(port, () => {
	console.log('Listening on', port);
});
