// TODO: break this up so there is a server version and a development version, ie: livereload, nodemon are not used on production

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var del = require('del');
var babel = require('babelify');
var concat = require('gulp-concat');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var template = require('gulp-template');

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
});

gulp.task('cleanJS', function(cb) {
  del(['www/bundle.js'], cb);
});

gulp.task('cleanCSS', function(cb) {
  del(['www/bundle.css', 'www/bundle.min.css'], cb);
});

gulp.task('sass', ['cleanCSS'], function() {
  return gulp.src(styleList)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(concat('all.css'))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./www/assets/css/'))
    .pipe( livereload() );
});

gulp.task('minsass', ['cleanCSS'], function() {
  return gulp.src(styleList)
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(sourcemaps.write())
    .pipe(concat('all.css'))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./www/assets/css/'))
    .pipe( livereload() );
});

gulp.task('moveAssets', ['cleanAssets'], function() {
  gulp.src(assetList, { base: './src/assets' })
    .pipe(gulp.dest('./www/assets'))
    .pipe( livereload() );
});

// for whatever reason if you try to include constants in this file it breaks gulp so there is some duplication here
gulp.task('html', () =>
    gulp.src('src/index.html')
        .pipe(template({
          STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_qLwGpc6OnsFiIc8D8XF3cy2G',
          FILESTACK_KEY: process.env.FILESTACK_KEY || 'AEBLEJFNRymKKHMYhksCDz',
        }))
        .pipe(gulp.dest('./www'))
);

gulp.task('js', ['cleanJS'], function() {
    var stream = browserify('./src/index.js', {debug: false})
      .transform(babel)
      .bundle()
      .on('error', function(error) { console.log(error); })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./www/'))
      .pipe( livereload() );

    return stream;
});

gulp.task('minjs', ['cleanJS'], function() {
    browserify('./src/index.js', {debug: false})
      .transform(babel)
      .bundle()
      .on('error', function(error) { console.log(error); })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest('./www/'));
});

gulp.task('fa', function() {
    gulp.src('./node_modules/font-awesome/**/*.{ttf,woff,woff2,eof,svg,min.css}')
      .pipe(gulp.dest('./www/assets/'))
      .pipe( livereload() );
});

gulp.task('glyphicons', function() {
  gulp.src('./node_modules/bootstrap/**/*.{ttf,woff,woff2,eot,svg}')
    .pipe(gulp.dest('./www/assets/'))
    .pipe( livereload() );
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(assetList, ['moveAssets', 'sass', 'fa', 'glyphicons']);
  gulp.watch(['./src/**/*.js'], ['js']);
  gulp.watch('./src/**/*.scss', ['sass']);
  gulp.watch('./src/index.html', ['html']);
});

gulp.task('dev', ['moveAssets', 'html', 'js', 'sass', 'fa', 'glyphicons','watch'], function () {
  nodemon({
    script: 'server/app.js',
    exec: './node_modules/.bin/babel-node',
    ignore: ['www','sessions'],
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  })
    .once('quit', function () {
      console.log('Exiting.');
      process.exit();
    });
});

gulp.task('default', ['moveAssets','html', 'minjs', 'minsass', 'fa', 'glyphicons']);
