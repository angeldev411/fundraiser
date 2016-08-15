// TODO: break this up so there is a server version and a development version, ie: livereload, nodemon are not used on production

var gulp          = require('gulp');
var source        = require('vinyl-source-stream');
var sass          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');
var rename        = require('gulp-rename');
var del           = require('del');
var concat        = require('gulp-concat');
var buffer        = require('vinyl-buffer');
var livereload    = require('gulp-livereload');
var nodemon       = require('gulp-nodemon');
var template      = require('gulp-template');
var gutil         = require('gulp-util');
var webpackConfig = require('./webpack.config.js');
var webpack       = require('webpack');

var assetList = [
  './src/assets/fonts/**/*.*',
  './src/assets/images/**/*.*',
  './src/assets/js/**/*.*',
];

var styleList = [
  './node_modules/bootstrap/dist/css/bootstrap.min.css',
  './node_modules/react-bootstrap-table/css/react-bootstrap-table.min.css',
  './src/**/*.scss',
];

gulp.task('cleanConstants', function(cb) {
  return del(['src/common/constants.js'], cb);
});

gulp.task('cleanAssets', function(cb) {
  return del(['www/assets/*'], cb);
});

gulp.task('cleanJS', function(cb) {
  return del([
      'www/bundle.js',
      'www/bundle.js.map',
      'www/vendor.js',
      'www/vendor.js.map'
  ], cb);
});

gulp.task('cleanCSS', function(cb) {
  return del(['www/bundle.css', 'www/bundle.min.css'], cb);
});

gulp.task('sass', ['cleanCSS'], function() {
  return gulp.src(styleList)
    .pipe(process.env.NODE_ENV === 'production' ? sass({outputStyle: 'compressed'}) : gutil.noop())
    .pipe(process.env.NODE_ENV !== 'production' ? sourcemaps.init() : gutil.noop())
    .pipe(process.env.NODE_ENV !== 'production' ? sass() : gutil.noop())
    .pipe(process.env.NODE_ENV !== 'production' ? sourcemaps.write() : gutil.noop())
    .pipe(concat('all.css'))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./www/assets/css/'))
    .pipe(livereload())
});

gulp.task('moveAssets', ['cleanAssets'], function() {
  gulp.src(assetList, { base: './src/assets' })
    .pipe(gulp.dest('./www/assets'))
    .pipe(livereload())
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

gulp.task('constantsFront', ['cleanConstants'], () =>
    gulp.src('src/common/constants-template.js')
        .pipe(template({
          DOMAIN: process.env.ROOT_URL || 'http://localhost:3000',
          FILESTACK_KEY: process.env.FILESTACK_KEY || 'AEBLEJFNRymKKHMYhksCDz',
          RAISERVE_LOGO: '/assets/images/raiserve_logo.png',
          RESIZE_QUALITY: 'output=compress:true,quality:80/',
        }))
        .pipe(concat('constants.js'))
        .pipe(gulp.dest('./src/common/'))
);


gulp.task('js', ['cleanJS'], function(cb) {
    var compiler = webpack(webpackConfig);
    compiler.run(cb)
});

gulp.task('fa', function() {
    gulp.src('./node_modules/font-awesome/**/*.{ttf,woff,woff2,eof,svg,min.css}')
      .pipe(gulp.dest('./www/assets/'))
      .pipe(livereload())
});

gulp.task('glyphicons', function() {
  gulp.src('./node_modules/bootstrap/**/*.{ttf,woff,woff2,eot,svg}')
    .pipe(gulp.dest('./www/assets/'))
    .pipe(livereload())
});

// Define the base build tasks
var defaultTasks = ['moveAssets', 'html', 'constantsFront', 'sass', 'fa', 'glyphicons']
// Inject the 'js' task to build the production javascript bundles. (the dev bundles
// are compiled and served from webpack middleware in the server itself)
if(process.env.NODE_ENV === 'production') {
    defaultTasks.splice(4, 0, 'js')
}
gulp.task('default', defaultTasks, function () {
  if(process.env.NODE_ENV !== 'production'){
    livereload.listen();
    gulp.watch(assetList, ['moveAssets', 'sass', 'fa', 'glyphicons']);
    gulp.watch('./src/**/*.scss', ['sass']);
    gulp.watch('./src/index.html', ['html']);
    nodemon({
      script: 'server/app.js',
      exec: './node_modules/.bin/babel-node',
      ignore: ['src','www','sessions'],
      ext: 'js html',
      env: { 'NODE_ENV': 'development' }
    })
    .once('quit', function () {
      console.log('Exiting.');
      process.exit();
    });
  }

});
