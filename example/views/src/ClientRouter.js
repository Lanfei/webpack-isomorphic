'use strict';

import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import App from './App';

/**
 * @see https://reacttraining.com/react-router/web/guides/server-rendering
 */
export default class ClientRouter extends React.Component {
	render() {
		let data = this.props.data;
		return <BrowserRouter>
			<App {...data}/>
		</BrowserRouter>;
	}
}
