<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Webpack Isomorphic Example</title>
</head>
<body>
<div id="root"><%- initialHTML %></div>
<script>window.initialData = <%- JSON.stringify(initialData) %>;</script>
<script src="index.js"></script>
</body>
</html>