'use strict';

const config = require('config');
const gulp = require('gulp');
const isparta = require('isparta');
const istanbul = require('gulp-istanbul');

module.exports = function instrumentWithIstanbul() {
  // Creates variants of source files with instrumentation through istanbul
  // and isparta: this enables code coverage analysis of unit tests.
  return gulp.src([
    config.get('build.testing.coverage.instrumentPath'),
  ])
  .pipe(istanbul({
    instrumenter: isparta.Instrumenter,
    includeUntested: config.get('build.testing.coverage.includeUntested'),
  }))
  .pipe(istanbul.hookRequire()) // Required to make 'require' return instrumented files.
  .pipe(gulp.dest(config.get('build.testing.coverage.tempPath')));
};
