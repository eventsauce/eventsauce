const babel = require('babel-core/register');
const config = require('config');
const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');

module.exports = function runMochaTests() {
  // Run our unit tests on babelified code.
  return gulp.src([config.get('build.testing.findPattern')])
    .pipe(mocha({
      compilers: {
        js: babel,
      },
    }))

    // Output the HTML reports for the test coverage
    .pipe(istanbul.writeReports({
      dir: config.get('build.testing.coverage.outputPath'),
    }))

    // Enforce standards for coverage
    .pipe(istanbul.enforceThresholds({
      thresholds: {
        global: config.get('build.testing.coverage.enforceThreshold'),
      },
    }));
};