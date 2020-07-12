//Gulp packages
var {gulp, src, dest, watch, series, parallel} = require('gulp')
var del = require('del')
var rename = require('gulp-rename')
var plumber = require('gulp-plumber')
//html
var pug = require('gulp-pug')
//Images
var imagemin = require('gulp-imagemin')
//Scripts
var concat = require('gulp-concat')
var uglify = require('gulp-terser')
var optimizejs = require('gulp-optimize-js')
// Styles
var sass = require('gulp-sass')
var postcss = require('gulp-postcss')
var minify = require('cssnano')
var prefix = require('autoprefixer')
// SVGs
var svgmin = require('gulp-svgmin');
// BrowserSync
var browserSync = require('browser-sync');

// Paths to project folders 
var paths = {
  input:'src/',
  output:'dist/',
  layoutH: 'src/**/*.html',
  layoutP: 'src/**/*.pug',
  scripts: {
    input: 'src/js/*',
    output:'dist/js/',
  },
  styles: {
    input: 'src/sass/**/*.{scss,sass}',
    output:'dist/css/',
  },
  svgs: {
    input: 'src/images/**/*.svg',
    output:'dist/images/',
  },
  images: {
    input: 'src/images/**/*.{jpg,png}',
    output:'dist/images/',
  }
}

// Work with Pug
var pugUse = false

//Gulp Tasks

// Remove pre-existing content from output folders
var cleanDist = function (done) {
  // Clean the dist folder
  del.sync([
    paths.output
  ]);
  // Signal completion
  return done()
}

// Optimize Images files
var buildImages = function (done) {
  return src(paths.images.input)
  .pipe(plumber())
  .pipe(
    imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 30, progressive: true }),
      imagemin.optipng({ optimizationLevel: 1 })
    ])
  )
  .pipe(dest(paths.images.output));
}

// Optimize SVG files
var buildSVGs = function (done) {
  // Optimize SVG files
  return src(paths.svgs.input)
  .pipe(svgmin())
  .pipe(dest(paths.svgs.output));
}

//Validation Pug var
if(pugUse) {
  //Build pug files
  var buildhtml = function (done) {
    return src(paths.layoutP)
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest(paths.output))
  }
}else{
  //Build html files
  var buildhtml = function (done) {
    return src(paths.layoutH)
    .pipe(plumber())
    .pipe(dest(paths.output))
  }
}

// Build Sass files
var buildStyles = function (done) {
  return src(paths.styles.input)
  .pipe(plumber())
  .pipe(sass({
    outputStyle: 'expanded',
    sourceComments: true
  }))
  .pipe(postcss([
    prefix({
      cascade: true,
      remove: true
    })
  ]))
  .pipe(rename({suffix: '.min'}))
  .pipe(postcss([
    minify({
      discardComments: {
        removeAll: true
      }
    })
  ]))
  .pipe(dest(paths.styles.output))
}

// Build Js files
var buildJs = function (done) {
  return src(paths.scripts.input)
  .pipe(plumber())
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest(paths.scripts.output))
}

// Start Server
var startServer = function (done) {
  // Initialize BrowserSync
  browserSync.init({
    server: {
      baseDir: paths.output
    }
  });
  // Signal completion
  done()
}

// Reload the browser when files change
var reloadBrowser = function (done) {
  browserSync.reload();
  done()
}

// Watch for changes
var watchSource = function (done) {
  watch(paths.input, series(exports.default, reloadBrowser))
  done()
}

// Export Tasks

//Default Dev Tasks
exports.default = series(
  parallel(
    buildhtml,
    buildStyles,
    buildJs
  )
)

// Watch and reload
exports.watch = series(
  exports.default,
  startServer,
  watchSource
)
