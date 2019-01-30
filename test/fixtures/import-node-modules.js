const importCSS = require('./import-css');
const importImage = require('./import-image');
const materialIcons = require('material-design-icons/iconfont/material-icons.css');

exports.css = importCSS.css;
exports.image = importImage.image;
exports.materialIcons = materialIcons;
