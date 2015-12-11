'use strict';

const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const config = require('config');
const gulp = require('gulp');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');

module.exports = function runBuildClient() {
  // Browserify the content into a single file and resolve 'require's
  const bundler = browserify({
    entries: config.get('build.bundle.entryPoint'),
    debug: config.get('build.options.debug'),
  });

  // Translate ES6 to a suitable dialect for compatibility
  bundler.transform('babelify', {
    presets: [config.get('build.bundle.transpiler.babel-preset')],
    plugins: ['transform-strict-mode'],
  });

  return bundler.bundle()
    .pipe(source(config.get('build.bundle.outputFile')))
    .pipe(buffer())
    .pipe(gulp.dest(config.get('build.bundle.outputPath')))
    .pipe(rename(config.get('build.bundle.outputFileMinified')))
    .pipe(sourcemaps.init({
      loadMaps: true,
    }))
    .pipe(uglify({
      mangle: config.get('build.bundle.mangleNames'),
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.get('build.bundle.sourceMapsPath')));
};