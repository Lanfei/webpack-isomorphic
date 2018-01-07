'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class NotFoundPage extends React.Component {

	componentWillMount() {
		const {staticContext} = this.context.router;
		if (staticContext) {
			staticContext.statusCode = 404;
		}
	}

	render() {
		return <div id="not-found-page">
			<p>404 Not Found</p>
		</div>;
	}
}

NotFoundPage.contextTypes = {
	router: PropTypes.object.isRequired
};
