var React = require('react');

var IndexPage = React.createClass({
	render() {
		return <div>
			<img src={require('../img/avatar.jpg')} alt="avatar"/>
		</div>;
	}
});

module.exports = IndexPage;
