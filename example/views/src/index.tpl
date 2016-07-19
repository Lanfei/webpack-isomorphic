<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>webpack-isomorphic Example</title>
	<link rel="stylesheet" href="index.css">
</head>
<body>
<div id="root"><%- initialHTML %></div>
<script>window.initialData = <%- JSON.stringify(initialData) %>;</script>
<script src="index.js"></script>
</body>
</html>