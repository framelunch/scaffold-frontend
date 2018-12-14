const gulp = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');

const conf = require('../config');

Object.keys(conf.copy).forEach(key => {
  const src = conf.copy[key];
  gulp.task(`copy:${key}`, () => gulp.src(src).pipe(gulp.dest(conf.dest.build)));
});
