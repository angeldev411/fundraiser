var browserify = require('browserify');
var reactify = require('reactify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');
var del = require('del');
var babel = require('babelify');
var debug = require('gulp-debug');
var concat = require('gulp-concat');
var buffer = require('vinyl-buffer');

var assetList = [
  './src/assets/fonts/**/*.*',
  './src/assets/images/**/*.*',
  './src/assets/js/**/*.*',
];

var styleList = [
  './node_modules/bootstrap/dist/css/bootstrap.min.css',
  './src/**/*.scss',
];

gulp.task('cleanAssets', function(cb) {
  del(['www/assets/*'], cb);
})

gulp.task('cleanJS', function(cb) {
  del(['www/bundle.js'], cb);
});

gulp.task('cleanCSS', function(cb) {
  del(['www/bundle.css', 'www/bundle.min.css'], cb);
});

gulp.task('sass', ['cleanCSS'], function() {
  gulp.src(styleList)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(concat('all.css'))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./www/assets/css/'))
});

gulp.task('moveAssets', ['cleanAssets'], function() {
  gulp.src(assetList, {
    base: './src/assets'
  })
  .pipe(gulp.dest('./www/assets'));
});

gulp.task('js', ['cleanJS'], function() {
    browserify('./src/index.js', {debug: true})
    .transform(babel)
    .bundle()
    .on('error', function(error) { console.log(error); })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/'));
});

gulp.task('fa', function() {
    gulp.src('./node_modules/font-awesome/**/*.{ttf,woff,woff2,eof,svg,min.css}')
    .pipe(gulp.dest('./www/assets/'));
});

gulp.task('jquery', function() {
    gulp.src('./node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('./www/assets/js'));
});

gulp.task('webserver', function() {
  gulp.src('./www/')
    .pipe(webserver({
      host: 'localhost',
      port: 3000,
      livereload: true,
      directoryListing: false,
      open: false,
      fallback: 'index.html'
    }));
});

gulp.task('watch', function() {
  gulp.watch(assetList, ['moveAssets', 'sass', 'jquery', 'fa']);
  gulp.watch(['./src/**/*.js'], ['js']);
  gulp.watch('./src/**/*.scss', ['sass']);
});

gulp.task('default', ['moveAssets', 'js', 'sass', 'fa', 'jquery']);
gulp.task('develop', ['default', 'webserver', 'watch']);
