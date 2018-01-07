'use strict';

import React from 'react';

class App extends React.Component {
	render() {
		let html = this.props['html'];
		let data = this.props['data'];
		let chunks = this.props.chunks || {};
		let jsFiles = chunks['js'];
		let cssFiles = chunks['css'];

		return <html>
		<head>
			<meta charSet="UTF-8"/>
			<title>webpack-isomorphic</title>
			{cssFiles && Object.keys(cssFiles).map((name, i) =>
				<link rel="stylesheet" href={cssFiles[name]} key={i}/>
			)}
		</head>
		<body>
		<div id="root" dangerouslySetInnerHTML={{__html: html}}/>
		<script dangerouslySetInnerHTML={{__html: `window.initialData = ${JSON.stringify(data)};`}}/>
		{jsFiles && Object.keys(jsFiles).map((name, i) =>
			<script src={jsFiles[name]} key={i}/>
		)}
		</body>
		</html>;
	}
}

export default App;
