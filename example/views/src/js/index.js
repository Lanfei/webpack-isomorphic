var React = require('react');

var style = require('../css/style.css');

var IndexPage = React.createClass({
	render() {
		return <div>
			<img className={style['avatar']} src={require('../img/avatar.jpg')} alt="avatar"/>
		</div>;
	}
});

module.exports = IndexPage;
