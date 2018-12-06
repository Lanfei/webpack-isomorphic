'use strict';

import React from 'react';

export default class HTMLHelper extends React.Component {
	render() {
		let html = this.props['html'];
		let data = this.props['data'];
		let chunks = this.props.chunks || {};
		let jsFiles = [];
		let cssFiles = [];
		Object.keys(chunks).forEach((name) => {
			let files = chunks[name];
			files.forEach((filename) => {
				if (filename.slice(-3) === '.js') {
					jsFiles.push(filename);
				} else if (filename.slice(-4) === '.css') {
					cssFiles.push(filename);
				}
			})
		});

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
