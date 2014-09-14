//gulp
var gulp = require('gulp');

// npm tools
var path  = require('path');

// gulp general plugins
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

// docs & tests
var docco = require('gulp-docco');
var mocha = require('gulp-mocha-phantomjs');

// project directories
var dir = {
  source: './source',
  dist: './dist',
  test: './test',
  docs: './literate-docs'
};


// __build__ task:
// - concat files
gulp.task('build', function() {
  var files = [
    'build/_export',
    'utilities',
    'model',
    'view',
    'build/_after'
  ].map(function (file) { return path.join(dir.source, file + '.js'); });

  return gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(concat('patchbay.js'))
    .pipe(gulp.dest(dir.dist))
    .pipe(uglify())
    .pipe(rename('patchbay.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dir.dist));
});


// __docs__ task:
// creates documentation from code in source folder using docco
//
// - docco (side by side documentation)
//   + output: various files to './docs'
gulp.task('docs', ['build'], function() {
  return gulp.src(path.join(dir.dist, 'patchbay.js'))
    .pipe(docco())
    .pipe(gulp.dest(dir.docs));
});


// __test__ task:
gulp.task('test', ['build'], function () {
  return gulp.src(path.join(dir.test, 'tests.html'))
    .pipe(mocha({ reporter: 'spec' }));
});


// __watch__ task:
gulp.task('watch', function () {
  gulp.watch(path.join(dir.source, '**/*.js'), ['compile']);
  gulp.watch(path.join(dir.test, '**/*'), ['test']);
});


gulp.task('compile', ['build', 'docs']);
gulp.task('develop', ['compile', 'test', 'watch']);

gulp.task('default', ['develop']);
