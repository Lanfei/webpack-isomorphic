'use strict';

import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom';

import App from './app';

export default class Router extends React.Component {
	render() {
		let data = this.props.data;
		return <BrowserRouter>
			<App {...data}/>
		</BrowserRouter>;
	}
}

ReactDOM.hydrate(<Router data={initialData}/>, document.getElementById('app'));
