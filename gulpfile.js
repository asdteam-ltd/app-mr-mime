'use strict';

const gulp = require('gulp');
const minifyCss = require('gulp-minify-css');   // css minification
// const	sass = require('gulp-sass');   // sass transpille
const useref = require('gulp-useref');   // concat sources linked in index.html
const gulpif = require('gulp-if');   // if condition for pipes
const minifyHTML = require('gulp-minify-html');   // minify html
const image = require('gulp-image');   // image optimizer
const watch = require('gulp-watch');   // file watcher
const concat = require('gulp-concat');   // file concatenation
const bs = require('browser-sync').create();   // live reload server
const babel = require('gulp-babel');   // es6 -> es5
const argv = require('yargs').argv;   // command line params
const uglify = require('gulp-uglify');   // js minification
const postcss = require('gulp-postcss');   //  css post processor
const sourcemaps = require('gulp-sourcemaps');   // sourcemaps
const autoprefixer = require('gulp-autoprefixer');   // css autoprefixer
const rev = require('gulp-rev');   // revision master
const revReplace = require('gulp-rev-replace');   // replace file names from rev-manifest.json
const pug = require('gulp-pug');   // html template engine
const del = require('del');  // remove files/directories
const filter = require('gulp-filter');

const sources = {
	js: [
		'./src/**/*.js',
		'!./src/bower_components/**',
		'!./src/js/modules/**',
		'!./src/**/*.spec.js',
		'!./src/js/config/*',
		'!./src/**/*.test.js'
	],
	rootFiles: [
		"./src/manifest.json",
		"./src/service-worker.js",
	],
	fonts: [
		"./src/fonts/*"
	],
	langs: [
		'./src/js/langs/**.json'
	],

	css: [
		'./src/styles/**/*.pcss',
		'!./src/bower_components/**/*'

	]
};

const pathes = {
	output: './dist'
};

const uglifyOpts = {
	mangle: false,
	compress: {
		sequences: true,  // join consecutive statemets with the “comma operator”
		properties: false,  // optimize property access: a['foo'] → a.foo
		dead_code: true,  // discard unreachable code
		drop_debugger: true,  // discard “debugger” statements
		unsafe: false, // some unsafe optimizations (see below)
		conditionals: true,  // optimize if-s and conditional expressions
		comparisons: false,  // optimize comparisons
		evaluate: false,  // evaluate constant expressions
		booleans: false,  // optimize boolean expressions
		loops: true,  // optimize loops
		unused: true,  // drop unused variables/functions
		hoist_funs: true,  // hoist function declarations
		hoist_vars: false, // hoist variable declarations
		if_return: true,  // optimize if-s followed by return/continue
		join_vars: true,  // join var declarations
		cascade: true,  // try to cascade `right` into `left` in sequences
		side_effects: true,  // drop side-effect-free statements
		warnings: true,  // warn about potentially dangerous optimizations/code
		global_defs: {}     // global definitions
	}
};


gulp.task('revision', () =>
	gulp.src(['dist/**/*.css', 'dist/**/*.js'], { base: process.cwd() + '/dist' })
		.pipe(gulpif(argv.prod, rev()))
		.pipe(gulp.dest(pathes.output))
		.pipe(gulpif(argv.prod, rev.manifest()))
		.pipe(gulp.dest(pathes.output))
);


gulp.task('rootFiles', () =>
	gulp.src(sources.rootFiles)
		.pipe(gulp.dest(pathes.output))
);


gulp.task('fonts', () =>
	gulp.src(sources.fonts)
		.pipe(gulp.dest(pathes.output + '/fonts'))
);

gulp.task('index', () => {
	const manifest = argv.prod
		? gulp.src(pathes.output + '/rev-manifest.json')
		: null;

	return gulp.src('./src/index.html', {base: process.cwd() + '/src'})
		.pipe(useref())

		.pipe(gulpif('*.js', gulpif(argv.prod, uglify())))
		.pipe(gulpif('*.css', gulpif(argv.prod, minifyCss())))


		.pipe(gulp.dest(pathes.output))
		.pipe(gulpif(argv.prod, (revReplace({ manifest: manifest }))))
		.pipe(gulp.dest(pathes.output));
});

gulp.task('scripts', () =>
	gulp.src(sources.js)
		.pipe(gulpif(!argv.prod, sourcemaps.init()))
		.pipe(babel())
		.pipe(concat('main.js'))
		.pipe(gulpif(!argv.prod, sourcemaps.write()))
		.pipe(gulpif(argv.prod, uglify(uglifyOpts)))
		.pipe(gulp.dest(pathes.output + '/js'))
);


gulp.task('styles', () => {
	const postcssFilter = filter(['*.pcss'], { restore: true });
	return gulp.src(sources.css)
		.pipe(gulpif(!argv.prod, sourcemaps.init()))
		.pipe(postcss([require('postcss-nested')]))
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
		.pipe(concat('style.css'))
		.pipe(gulpif(!argv.prod, sourcemaps.write()))
		.pipe(gulp.dest(pathes.output + '/css'))
		.pipe(gulpif(!argv.noreload, bs.stream()));
});


gulp.task('components', () =>
	gulp.src(['./src/components/**/*.html', './src/components/**/*.pug'], {base: process.cwd() + '/src/components'})
		.pipe(gulpif('*.pug', pug()))
		.pipe(minifyHTML({
			conditionals: true,
			spare: true
		}))
		.pipe(gulp.dest('./dist/components'))
);


gulp.task('image', () =>
	gulp.src('./src/images/**/*')
		.pipe(gulp.dest('./dist/images/'))
);


var livereload = () => {
	if (argv.noreload) {
		return false;
	}

	bs.reload();
};


gulp.task('watch', () => {
	bs.init({
		server: {
			baseDir: './dist/'

		},
		open: !argv.noreload
	});

	watch(sources.css, gulp.series('styles'));
	watch(sources.rootFiles, gulp.series('rootFiles'));
	watch(sources.fonts, gulp.series('fonts'));

	watch(sources.js, gulp.series('scripts'));

	watch(['./i/*'], gulp.series('image'));
	watch(['./src/components/**/*.html', './src/components/**/*.pug', './src/*.html'], gulp.series('components')).on('change', livereload);


});


gulp.task('clean', () => del(pathes.output));

gulp.task('build',
	gulp.series(
		'clean',
		'components',
		'image',
		'styles',
		'scripts',
		'revision',
		'rootFiles',
		'fonts',
		'index'
	)
);

gulp.task('serve', gulp.series('build', 'watch'));
