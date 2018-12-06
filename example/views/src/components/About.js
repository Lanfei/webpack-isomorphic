'use strict';

import React from 'react';

import '../assets/css/about.css';

export default class AboutPage extends React.Component {
	render() {
		return <div>
			<p><img className="avatar" src={require('../assets/img/avatar.jpg')} alt="Avatar"/></p>
			<p>Hi, I am Jealous.</p>
		</div>;
	}
}
