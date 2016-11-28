'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const cheerio = require('gulp-cheerio');
const fileinclude = require('gulp-file-include');

gulp.task('svgmin', function () {
  return gulp.src('./src/svg-icons/*.svg')
    .pipe(svgmin(function (file) {
      return {
        plugins: [{
          cleanupIDs: {
            minify: true
          }
        }]
      }
    }))
    .pipe(gulp.dest('./src/svg-icons/'));
});

gulp.task('svgstore', function () {
  return gulp.src('./src/svg-icons/*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(cheerio(function ($) {
      $('svg').attr('style',  'display:none');
    }))
    .pipe(rename('sprite-svg.svg'))
    .pipe(gulp.dest('./src/TEMP'));
});

gulp.task('html', function() {
  return gulp.src('./src/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true,
    }))
    .pipe(gulp.dest('./docs'));
});

gulp.task('build', gulp.series(
  'svgmin',
  'svgstore',
  'html'
));

gulp.task('default',
  gulp.series('build')
);
