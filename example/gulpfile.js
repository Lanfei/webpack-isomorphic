var del = require('del');
var gulp = require('gulp');
var babel = require('gulp-babel');
var named = require('vinyl-named');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');

var webpackConfig = require('./webpack.config.js');

var src = 'views/src';
var dest = 'views/dist';
var entries = 'views/src/js/*.js';
var components = 'views/src/components/**/*.js';

gulp.task('clean', function () {
	return del(dest);
});

gulp.task('default', ['clean'], function () {
	process.env['NODE_ENV'] = 'dev';
	gulp.start('build');
});

gulp.task('production', ['clean'], function () {
	process.env['NODE_ENV'] = 'production';
	gulp.start('build');
});

gulp.task('webpack', function () {
	return gulp
		.src(entries, {base: src})
		.pipe(plumber())
		.pipe(named())
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest(dest));
});

gulp.task('babel', function () {
	return gulp
		.src([entries, components], {base: src})
		.pipe(plumber())
		.pipe(babel({
			presets: ['react']
		}))
		.pipe(gulp.dest(dest));
});

gulp.task('build', ['babel'], function () {
	gulp.start('webpack');
});

gulp.task('watch', ['babel'], function () {
	webpackConfig['watch'] = true;
	gulp.start('webpack');
	gulp.watch([entries, components], ['babel']);
});
