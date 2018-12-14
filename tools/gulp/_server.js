const gulp = require('gulp');
const browser = require('browser-sync');

const conf = require('../config');

gulp.task('server', () => browser.init(null, conf.browser));
