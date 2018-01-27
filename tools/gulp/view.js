const gulp = require('gulp');
const plumber = require('gulp-plumber');
const tap = require('gulp-tap');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const browser = require('browser-sync');
const fs = require('fs');
const path = require('path');
const hbs = require('handlebars');
const helpers = require('handlebars-helpers')();

const conf = require('../config');
const siteConfig = require('../../src/site-config.json');

const times = (n, block) => [...Array(n).keys()].reduce((tmp, index) => {
  tmp += block.fn(index);
  return tmp;
}, '') ;

gulp.task('view', () => gulp.src(conf.view.src)
  .pipe(plumber())
  .pipe(tap(file => gulp.src(file.path)
    .pipe(handlebars(siteConfig, {
      helpers: {
        ...helpers,
        times,
        include(templatePath) {
          const template = hbs.compile(fs.readFileSync(`${path.dirname(file.path)}/${templatePath}`, 'UTF-8'));
          return new hbs.SafeString(template(this));
        },
      },
    }))
    .pipe(rename(conf.view.rename))
    .pipe(gulp.dest(conf.dest.dev))
    .pipe(browser.reload({ stream: true }))
  ))
);

gulp.task('b.view', () => gulp.src(conf.view.src)
  .pipe(tap(file => gulp.src(file.path)
    .pipe(handlebars(siteConfig, {
      helpers: {
        ...helpers,
        times,
        include(templatePath) {
          const template = hbs.compile(fs.readFileSync(`${path.dirname(file.path)}/${templatePath}`, 'UTF-8'));
          return new hbs.SafeString(template(this));
        },
      },
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename(conf.view.rename))
    .pipe(gulp.dest(conf.dest.build))
  ))
);
