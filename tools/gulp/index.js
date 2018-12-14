const gulp = require('gulp');

const conf = require('../config');

/*
 * build
 */
if (conf.rev.isEnable) {
  gulp.task(
    'build',
    gulp.series(
      'b.clean',
      'b.style',
      'b.view',
      gulp.parallel(...Object.keys(conf.copy).map(key => `copy:${key}`), 'image'),
      'rev',
      'rev.replace',
    ),
  );
} else {
  gulp.task(
    'build',
    gulp.series(
      'b.clean',
      'b.style',
      'b.view',
      gulp.parallel(...Object.keys(conf.copy).map(key => `copy:${key}`), 'image'),
    ),
  );
}

/*
 * default
 */
gulp.task(
  'default',
  gulp.series(
    'clean',
    'style',
    'view',
    gulp.parallel('server', () => {
      gulp.watch(conf.view.watch, gulp.task('view'));
      gulp.watch(conf.style.watch, gulp.task('style'));
    }),
  ),
);
