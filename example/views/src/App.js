'use strict';

import React from 'react';
import {Route, Switch, Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import IndexPage from './components/Index';
import AboutPage from './components/About';
import NotFoundPage from './components/NotFound';

import './assets/css/style.css';

export default class App extends React.Component {
	render() {
		let appName = this.props.appName;
		return <div>
			<h1>webpack-isomorphic</h1>
			<p id="desc">
				A lightweight solution for the server-side rendering of Webpack-built applications.<br/>
				（
				<a target="_blank" href="https://www.npmjs.com/package/webpack-isomorphic">npm</a> |&nbsp;
				<a target="_blank" href="https://github.com/Lanfei/webpack-isomorphic">GitHub</a> |&nbsp;
				<a target="_blank" href="https://gitee.com/lanfei/webpack-isomorphic">码云</a> |&nbsp;
				<a target="_blank" href="http://www.clanfei.com">Blog</a>
				）
			</p>
			<h2>{appName}</h2>
			<div id="list">
				<ul>
					<li><Link to="/">Index</Link></li>
					<li><Link to="/about">About Me</Link></li>
					<li><Link to="/redirect">301 Redirect</Link></li>
					<li><Link to="/not-found">404 Not Found</Link></li>
				</ul>
			</div>
			<div id="content">
				<Switch>
					<Route exact path="/" component={IndexPage}/>
					<Route path="/about" component={AboutPage}/>
					<Route path="/redirect" render={() => <Redirect to="/"/>}/>}/>
					<Route component={NotFoundPage}/>
				</Switch>
			</div>
		</div>;
	}
}
