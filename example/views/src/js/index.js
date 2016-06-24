var React = require('react');
var ReactDOM = require('react-dom');

var style = require('../css/style.css');

var IndexPage = React.createClass({
	render() {
		return <div>
			<img className={style['avatar']} src={require('../img/avatar.jpg')} alt="avatar"/>
		</div>;
	}
});

if (typeof window !== 'undefined') {
	ReactDOM.render(
		React.createElement(IndexPage, initialData),
		document.getElementById('root')
	);
}

module.exports = IndexPage;
