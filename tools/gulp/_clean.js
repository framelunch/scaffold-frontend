const gulp = require('gulp');
const rimraf = require('rimraf');

const conf = require('../config');

gulp.task('clean', cb => {
  rimraf.sync(conf.dest.dev, {});
  cb();
});
gulp.task('b.clean', cb => {
  rimraf.sync(conf.dest.build, {});
  cb();
});
