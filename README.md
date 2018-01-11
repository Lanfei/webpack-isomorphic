# webpack-isomorphic  &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Lanfei/webpack-isomorphic/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/webpack-isomorphic.svg)](https://www.npmjs.com/package/webpack-isomorphic)

A lightweight solution for the server-side rendering of webpack-built applications.

## Why do we need it?

With webpack, we can require any files by using loaders:

```jsx
// CSS Modules
// @see https://www.npmjs.com/package/css-loader#modules
import style from './css/style.css';

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
const IsomorphicPlugin = require('webpack-isomorphic/plugin');

const isomorphicPlugin = new IsomorphicPlugin({
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
const webpackIsomorphic = require('webpack-isomorphic');

// The base directory of your built files
webpackIsomorphic.install(__dirname + '/dist', {
	cache: process.env['NODE_ENV'] !== 'development'
});

//...
```

Enjoy!

## Example

See [the example project](https://github.com/Lanfei/webpack-isomorphic/tree/master/example) for more details.
