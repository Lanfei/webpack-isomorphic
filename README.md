# webpack-isomorphic [![NPM version][npm-image]][npm-url]

A lightweight solution for the server-side rendering of Webpack-built applications.

## Why do we need it?

With webpack, we can require any files by using loaders:

```jsx
// CSS Modules
// @see https://www.npmjs.com/package/css-loader#css-modules
require('../css/style.css');

// Require a image file
<img src={require('./img/avatar.jpg')} />
```

But you'll get an error in server-side rendering, because it is not supported by Node.js.

`webpack-isomorphic` is a lightweight, easy-to-use solution to solve this issue, and make your client-side codes work on server too.

## Usage

### Installation

```bash
$ npm install --save webpack-isomorphic
```

### webpack.config.js

```js
var IsomorphicPlugin = require('webpack-isomorphic/plugin');

var isomorphicPlugin = new IsomorphicPlugin({
	extensions: ['jpg', 'png', 'gif', 'css']
});

module.exports = {
	// The base directory of your source files
	context: __dirname + '/src',
	// ...
	plugins: [
		//...
		isomorphicPlugin
	]
};
```

### Server-side codes

```js
var webpackIsomorphic = require('webpack-isomorphic');

// The base directory of your built files
webpackIsomorphic.install(__dirname + '/dist', {
	cache: process.env['NODE_ENV'] !== 'development'
});

//...
```

Enjoy!

## Example

See [the example project](https://github.com/Lanfei/webpack-isomorphic/tree/master/example) for more details.

[npm-url]: https://npmjs.org/package/gulp-file-inline
[npm-image]: https://badge.fury.io/js/gulp-file-inline.svg