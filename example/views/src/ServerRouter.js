'use strict';

import React from 'react';
import {StaticRouter} from 'react-router';

import App from './App';

/**
 * @see https://reacttraining.com/react-router/web/guides/server-rendering
 */
export default class ServerRouter extends React.Component {
	render() {
		let data = this.props.data;
		let context = this.props.context;
		let location = this.props.location;
		return <StaticRouter context={context} location={location}>
			<App {...data}/>
		</StaticRouter>;
	}
}
