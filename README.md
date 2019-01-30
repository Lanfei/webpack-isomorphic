# webpack-isomorphic

[![Build Status][build-image]][build-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Version][version-image]][version-url]
[![License][license-image]][license-url]
[![Dependencies][dep-image]][dep-url]
[![DevDependencies][dev-dep-image]][dev-dep-url]

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
# for webpack 4
npm install --save webpack-isomorphic@4
# for webpack 3
npm install --save webpack-isomorphic@3
```

### webpack.config.js

```js
const IsomorphicPlugin = require('webpack-isomorphic/plugin');

const isomorphicPlugin = new IsomorphicPlugin({
	extensions: ['jpg', 'png', 'gif', 'css'],
	// assetsFilePath: 'webpack.assets.json'
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
	cache: process.env['NODE_ENV'] !== 'development',
	// assetsFilePath: __dirname + '/dist/webpack.assets.json'
});

//...
```

Enjoy!

## Example

See [the example project](https://github.com/Lanfei/webpack-isomorphic/tree/master/example) for more details.

[build-url]: https://circleci.com/gh/Lanfei/webpack-isomorphic
[build-image]: https://img.shields.io/circleci/project/github/Lanfei/webpack-isomorphic.svg
[coverage-url]: https://codecov.io/github/Lanfei/webpack-isomorphic
[coverage-image]: https://img.shields.io/codecov/c/github/Lanfei/webpack-isomorphic.svg
[version-url]: https://npmjs.org/package/webpack-isomorphic
[version-image]: https://img.shields.io/npm/v/webpack-isomorphic.svg
[license-url]: https://github.com/Lanfei/webpack-isomorphic/blob/master/LICENSE
[license-image]: https://img.shields.io/npm/l/webpack-isomorphic.svg
[dep-url]: https://david-dm.org/Lanfei/webpack-isomorphic
[dep-image]: https://david-dm.org/Lanfei/webpack-isomorphic/status.svg
[dev-dep-url]: https://david-dm.org/Lanfei/webpack-isomorphic?type=dev
[dev-dep-image]: https://david-dm.org/Lanfei/webpack-isomorphic/dev-status.svg
