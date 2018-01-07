'use strict';

import React from 'react';
import {Route, Switch, Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import IndexPage from './pages/index';
import AboutPage from './pages/about';
import NotFoundPage from './pages/not-found';

export default class App extends React.Component {
	render() {
		let appName = this.props.appName;
		return <div>
			<h1>Hello {appName}!</h1>
			<ul>
				<li><Link to="/">Index</Link></li>
				<li><Link to="/about">About</Link></li>
				<li><Link to="/redirect">Redirect</Link></li>
				<li><a target="_blank" href="https://github.com/Lanfei/webpack-isomorphic">GitHub</a></li>
			</ul>
			<Switch>
				<Route exact path="/" component={IndexPage}/>
				<Route path="/about" component={AboutPage}/>
				<Route path="/redirect" render={() => <Redirect to="/"/>}/>}/>
				<Route component={NotFoundPage}/>
			</Switch>
		</div>;
	}
}
