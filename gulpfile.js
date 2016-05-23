var gulp = require('gulp'),
  babel = require('gulp-babel'),
  mocha = require('gulp-mocha'),
  istanbul = require('gulp-istanbul'),
  plumber = require('gulp-plumber'),
  del = require('del'),
  isparta = require('isparta'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  sourcemaps = require('gulp-sourcemaps')

require('babel-core/register')

gulp.task('default', ['clean', 'assets', 'test:unit'], function () {
  var bundle = browserify({
    debug: true,
    ignoreMissing: true,
  })

  bundle.add('./src/utilities/constants.js')
  bundle.add('./src/main.js')


  return bundle.transform(babelify, {
    presets: ['es2015']
  })
    .on('error', console.log)
    .bundle()
    .on('error', console.log)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'))
})

gulp.task('assets', ['package'], function () {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'))
})

gulp.task('package', function () {
  return gulp.src('src/package.json')
    .pipe(gulp.dest('dist'))
})

gulp.task('clean', function () {
  return del([
    'dist/**/*'
  ])
})

/* Unit test task */
gulp.task('pre-test', function () {
  return gulp.src(['src/**/*.js', '!src/**/*.spec.js', '!src/main.js'])
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire())
})

gulp.task('test:unit', ['pre-test'], function () {
  return gulp.src(['src/**/*.spec.js'])
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec'
    }))
    .pipe(istanbul.writeReports({}))
})
