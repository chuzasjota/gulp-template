var gulp         = require('gulp'),
    less         = require('gulp-less'),
	sass 		 = require('gulp-sass'),
    minifyCSS    = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
	flatten 	 = require('gulp-flatten'),
	plumber 	 = require('gulp-plumber'),
	notify 		 = require('gulp-notify'),
    watch        = require('gulp-watch'),
    server       = require('gulp-server-livereload');

var dirs = {
	dev:'./dev',
	prod:'./public'
}

gulp.task('scss_task', function () {
    // gulp.src(dirs.dev+'/css/*.scss')
    gulp.src(dirs.dev+'/css/style.scss')
    .pipe(plumber())
    .pipe(concat('style.min.css'))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(plumber.stop())
    .pipe(gulp.dest(dirs.prod+'/css'))
    .pipe(notify("Save Styles Sass"))
});

gulp.task('less_task', function () {
    // gulp.src(dirs.dev+'/css/*.less')
    gulp.src(dirs.dev+'/less/style.less')
    .pipe(plumber())
    .pipe(concat('style.min.css'))
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(plumber.stop())
    .pipe(gulp.dest(dirs.prod+'/css'))
    .pipe(notify("Save Styles Less"))
});

gulp.task('js_task',function(){
	gulp.src(dirs.dev+'/js/*.js')
	.pipe(plumber())
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(plumber.stop())
	.pipe(gulp.dest(dirs.prod+'/js'))
	.pipe(notify("Save Scripts"))
});

gulp.task('component_css', function () {
    gulp.src('bower_components/**/*.min.css')
	// .pipe(concat('vendor.min.css'))	
	.pipe(autoprefixer())
    .pipe(minifyCSS())
	.pipe(flatten())
	.pipe(gulp.dest('public/css/'));
});

gulp.task('component_js', function () {
    gulp.src('bower_components/**/*.min.js')
	// .pipe(concat('vendor.min.js'))
	.pipe(uglify())
	.pipe(flatten())
	.pipe(gulp.dest('public/js/'));
});


gulp.task('component_font', function () {
    gulp.src('bower_components/**/fonts/*')
	.pipe(flatten())
	.pipe(gulp.dest('public/fonts/'));
});

gulp.task('server', function() {
  gulp.src('public')
    .pipe(server({
      port: 8000,
      livereload: true,
      open: true
    }));
});

gulp.task('watch', ['scss_task', 'less_task', 'js_task'], function() {
  gulp.watch(dirs.dev+'/css/*.scss', ['scss_task']);
  gulp.watch(dirs.dev+'/css/*.less', ['less_task']);
  gulp.watch(dirs.dev+'/js/*.js', ['js_task']);
});

gulp.task('build',['component_js', 'component_css', 'component_font']);
gulp.task('default', ['build', 'watch', 'server']);
