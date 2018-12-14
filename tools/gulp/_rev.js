const gulp = require('gulp');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const wait = require('gulp-wait');

const conf = require('../config');

if (conf.rev.isEnable) {
  const manifest = gulp.src(`${conf.rev.dest}/${conf.rev.manifestFileName}`);

  gulp.task(
    'rev',
    () =>
      gulp
        .src(conf.rev.src)
        .pipe(rev())
        .pipe(gulp.dest(conf.rev.dest))
        .pipe(rev.manifest(conf.rev.manifestFileName))
        .pipe(gulp.dest(conf.rev.dest))
        .pipe(wait(1000)), // FIXME: ファイル書き出しより先にタスクが終了してしまうことがあるので、適当にsleep処理を仕込む
  );

  gulp.task('rev.replace', () =>
    gulp
      .src(conf.revReplace.src)
      .pipe(revReplace({ manifest }))
      .pipe(gulp.dest(conf.revReplace.dest)),
  );
}
