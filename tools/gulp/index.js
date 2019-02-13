const gulp = require('gulp');

const conf = require('../config');

/*
 * build
 */

const buildTasks = [
  'b.clean',
  'b.style',
  'b.view',
  gulp.parallel(...Object.keys(conf.copy).map(key => `copy:${key}`), 'image'),
];
if (conf.image.createWebp) {
  buildTasks.push('image:webp');
  buildTasks.push('image:gif2webp');
}
if (conf.rev.isEnable) {
  buildTasks.push('rev');
  buildTasks.push('rev.replace');
}
gulp.task('build', gulp.series(...buildTasks));

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
