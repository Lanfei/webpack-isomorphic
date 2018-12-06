'use strict';

import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader';

/**
 * @see https://github.com/gaearon/react-hot-loader/tree/v3.1.3
 */
function render() {
	let Component = require('./ClientRouter').default;
	ReactDOM.hydrate(
		<AppContainer>
			<Component data={initialData}/>
		</AppContainer>,
		document.getElementById('app'));
}

if (module.hot) {
	module.hot.accept('./ClientRouter.js', render);
}

render();
