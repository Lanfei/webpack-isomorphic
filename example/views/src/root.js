'use strict';

import React from 'react';

export default class HTML extends React.Component {
	render() {
		let html = this.props['html'];
		let data = this.props['data'];
		let chunks = this.props.chunks || {};
		let jsFiles = chunks['js'] || {};
		let cssFiles = chunks['css'] || {};

		return <html>
		<head>
			<meta charSet="UTF-8"/>
			<title>webpack-isomorphic</title>
			{Object.keys(cssFiles).map((name, i) =>
				<link rel="stylesheet" href={cssFiles[name]} key={i}/>
			)}
		</head>
		<body>
		<div id="app" dangerouslySetInnerHTML={{__html: html}}/>
		<script dangerouslySetInnerHTML={{__html: `window.initialData = ${JSON.stringify(data)};`}}/>
		{Object.keys(jsFiles).map((name, i) =>
			<script src={jsFiles[name]} key={i}/>
		)}
		</body>
		</html>;
	}
}
