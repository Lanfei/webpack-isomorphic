'use strict';

import React from 'react'
import {StaticRouter} from 'react-router';

import App from './app';

export default class Router extends React.Component {
	render() {
		let data = this.props.data;
		let context = this.props.context;
		let location = this.props.location;
		return <StaticRouter context={context} location={location}>
			<App {...data}/>
		</StaticRouter>;
	}
}
