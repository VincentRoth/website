const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const path = require('path');

const DIST_FOLDER = 'dist';
const ASSETS_FOLDER = DIST_FOLDER + '/assets';
const TMP_FOLDER = DIST_FOLDER + '/tmp';

gulp.task('clean', function() {
  return gulp.src([DIST_FOLDER], { read: false }).pipe($.clean());
});

gulp.task('html-partial', ['clean'], function() {
  return gulp
    .src(['src/**/*.html', '!src/**/*.partial.html'])
    .pipe(
      $.fileInclude({
        prefix: '@@',
        basepath: '@file',
        indent: true
      })
    )
    .pipe(gulp.dest(TMP_FOLDER));
});

gulp.task('html-i18n', ['html-partial'], function() {
  return gulp
    .src(TMP_FOLDER + '/**')
    .pipe(
      $.i18nLocalize({
        delimeters: ['${{', '}}'],
        locales: ['en', 'fr'],
        localeDir: './resources/i18n',
        schema: 'directory'
      })
    )
    .pipe(gulp.dest(DIST_FOLDER));
});

gulp.task('clean-html', ['html-i18n'], function() {
  return gulp.src([TMP_FOLDER], { read: false }).pipe($.clean());
});

gulp.task('less', ['clean'], function() {
  return gulp
    .src('src/**/*.less')
    .pipe(
      $.less({
        paths: [path.join(__dirname, 'less', 'includes')]
      })
    )
    .pipe(gulp.dest(ASSETS_FOLDER));
});

gulp.task('assets', ['clean'], function() {
  return gulp.src('src/assets/**/*').pipe(gulp.dest(ASSETS_FOLDER));
});

gulp.task('build', ['clean-html', 'less', 'assets']);

gulp.task('default', ['build']);
