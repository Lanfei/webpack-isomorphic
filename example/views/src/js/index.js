'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import style from '../css/style.css';

class Index extends React.Component {
	render() {
		let appName = this.props['appName'];
		return <div id="index-page">
			<h1>Hello {appName}!</h1>
			<img className={style.avatar} src={require('../img/avatar.jpg')} alt="Avatar"/>
		</div>;
	}
}

if (typeof window !== 'undefined') {
	ReactDOM.hydrate(<Index {...initialData}/>, document.getElementById('root'));
}

export default Index;
