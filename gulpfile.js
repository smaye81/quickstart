var gulp = require('gulp');
var shell = require('gulp-shell');
var del = require('del');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');

// static dependencies for Angular2
var deps = [
  'node_modules/systemjs/node_modules/es6-module-loader/node_modules/traceur/bin/traceur.js',
  'node_modules/systemjs/node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.js',
  'node_modules/systemjs/dist/system.js',
  'node_modules/zone.js/zone.js',
  'node_modules/zone.js/long-stack-trace-zone.js',
  './traceurOptions.js'
];

// Angular2 AtScript to ES5
gulp.task('build:ng2', shell.task(['sh ng2build.sh']));

// strip off the sourceMaps.
gulp.task('build:strip_maps', shell.task(["sh strip_maps.sh"]));

// Concat all static dependencies for Angular2
gulp.task('build:shim', function() {
  return gulp.src(deps)
    .pipe(concat('es6-shim.js'))
    .pipe(gulp.dest('./dist/'));
});

// Starts a server which serves the dist dir
gulp.task('connect', function () {

    // Uses gulp-connect plugin to start up a server
    connect.server({
        root: ['dist'],
        port: 9000,
        livereload: true
    });
});

// Delete to start fresh
gulp.task('clean', function(cb) {
  del([
    './angular2',
    './rtts_assert',
    './dist'
  ], cb);
});

gulp.task('copy-index', function() {
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-src', function() {
  gulp.src('./src/*.es6')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {

    gulp.watch('./src/index.html', ['copy-index']);

    gulp.watch('./src/*.es6', ['copy-src']);
});

// Synchronous build
//  1. clean
//  2. ng2build
//  3. concat es6 shim file
// gulp.task('default', function(cb) {
//   runSequence('clean',
//       'build:ng2',
//       'build:shim',
//       'build:strip_maps',
//       cb);
// });

gulp.task('default', ['copy-index', 'copy-src', 'connect', 'watch']);