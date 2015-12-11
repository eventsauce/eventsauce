'use strict';

const config = require('config');
const esdoc = require('gulp-esdoc');
const gulp = require('gulp');

module.exports = function documentationBuilder() {
  return gulp.src('./lib')
    .pipe(esdoc({
      destination: config.get('build.documentation.outputPath'),
      unexportIdentifier: config.get('build.documentation.unexportedIdentifiers'),
      undocumentIdentifier: config.get('build.documentation.undocumentedIdentifiers'),
      test: {
        type: config.get('build.documentation.testType'),
        source: config.get('build.documentation.testRoot'),
      },
    }));
};
