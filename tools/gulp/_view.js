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
    .pipe(ejs(siteConfig))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(conf.dest.dev))
    .pipe(browser.reload({ stream: true })),
);

gulp.task('b.view', () =>
  gulp
    .src(conf.view.src)
    .pipe(ejs(siteConfig))
    .pipe(htmlmin())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(conf.dest.build)),
);
