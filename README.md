# webpack-isomorphic

A lightweight solution for the server-side rendering of Webpack-built applications.

## Why do we need it?

With webpack, we can require any files by using loaders:

```jsx
require('../css/style.css');

<img src={require('./img/avatar.js')} />
```

But you'll get an error in server-side rendering, because it is not supported by Node.js.

`webpack-isomorphic` is a lightweight solution to solve this issue, and make your client-side codes work on server too.

## Usage

### webpack.config.js

```js
var IsomorphicPlugin = require('webpack-isomorphic/plugin');

var isomorphicPlugin = new IsomorphicPlugin({
	extensions: ['jpg', 'png', 'gif']
});

module.exports = {
	context: 'the context of source files(required)',
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

webpackIsomorphic.install('the context of built files');

//...
```

Enjoy!

## Example

See [the example project](https://github.com/Lanfei/webpack-isomorphic/example) for more details.
