'use strict';

const config = require('config');
const eslint = require('gulp-eslint');
const gulp = require('gulp');

module.exports = function runLinting() {
  return gulp.src(config.get('build.linting.paths'))
  .pipe(eslint({
    extends: 'airbnb',
    rules: {
      strict: [2, 'global'],
       'max-len': [2, 200, 2, {
          'ignoreUrls': true,
          'ignoreComments': false
        }],
    },
    ecmaFeatures: {
      modules: false,
    },
    env: {
      es6: true,
    },
  }))
  .pipe(eslint.format(config.get('build.linting.formatter')))
  .pipe(eslint.failAfterError());
};