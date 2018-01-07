'use strict';

import React from 'react';

import style from '../statics/css/style.css';

export default class IndexPage extends React.Component {
	render() {
		return <div id="index-page">
			<p><img className={style.avatar} src={require('../statics/img/avatar.jpg')} alt="Avatar"/></p>
		</div>;
	}
}
