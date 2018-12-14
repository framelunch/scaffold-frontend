const gulp = require('gulp');
const plumber = require('gulp-plumber');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const browser = require('browser-sync');

const conf = require('../config');
const siteConfig = require('../../src/site-config.json');

gulp.task('view', () =>
  gulp
    .src(conf.view.src)
    .pipe(plumber())
    .pipe(ejs(siteConfig, {}, { ext: '.html' }))
    .pipe(rename(conf.view.rename))
    .pipe(gulp.dest(conf.dest.dev))
    .pipe(browser.reload({ stream: true })),
);

gulp.task('b.view', () =>
  gulp
    .src(conf.view.src)
    .pipe(ejs(siteConfig, {}, { ext: '.html' }))
    .pipe(htmlmin())
    .pipe(rename(conf.view.rename))
    .pipe(gulp.dest(conf.dest.build)),
);
