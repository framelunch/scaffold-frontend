const path = require('path');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const packageImporter = require('node-sass-package-importer');
const browser = require('browser-sync');

const conf = require('../config');
const bundleScss = () => sass({ importer: packageImporter({ extensions: ['.scss', '.css'] }) }).on('error', sass.logError);

gulp.task('style', () =>
  gulp
    .src(conf.style.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(gulpIf(conf.style.useScss, bundleScss()))
    .pipe(postcss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(conf.dest.dev))
    .pipe(browser.reload({ stream: true })),
);

gulp.task('b.style', () =>
  gulp
    .src(conf.style.src)
    .pipe(gulpIf(conf.style.useScss, bundleScss()))
    .pipe(postcss())
    .pipe(gulp.dest(conf.dest.build)),
);
