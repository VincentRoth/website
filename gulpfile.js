const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const path = require('path');

const DIST_FOLDER = 'dist';
const DIST_ASSETS_FOLDER = `${DIST_FOLDER}/assets`;
const DIST_TMP_FOLDER = `${DIST_FOLDER}/tmp`;

const SRC_HTML = 'src/**/*.html';
const SRC_CSS = 'src/**/*.less';
const SRC_ASSETS = 'src/assets/**/*';

const PORT = 9000;

gulp.task('clean', function() {
  return gulp.src([DIST_FOLDER], { read: false }).pipe($.clean());
});

gulp.task('html-partial', ['clean'], function() {
  return gulp
    .src([SRC_HTML, '!src/**/*.partial.html'])
    .pipe(
      $.fileInclude({
        prefix: '@@',
        basepath: '@file',
        indent: true
      })
    )
    .pipe(gulp.dest(DIST_TMP_FOLDER));
});

gulp.task('html-i18n', ['html-partial'], function() {
  return gulp
    .src(`${DIST_TMP_FOLDER}/**`)
    .pipe(
      $.i18nLocalize({
        delimeters: ['${{', '}}'],
        locales: ['en', 'fr'],
        localeDir: 'resources/i18n',
        schema: 'directory',
        ignoreErrors: true
      })
    )
    .pipe(gulp.dest(DIST_FOLDER));
});

gulp.task('clean-html', ['html-i18n'], function() {
  return gulp.src([DIST_TMP_FOLDER], { read: false }).pipe($.clean());
});

gulp.task('less', ['clean'], function() {
  return gulp
    .src(SRC_CSS)
    .pipe($.plumber())
    .pipe(
      $.less({
        paths: [path.join(__dirname, 'less', 'includes')]
      })
    )
    .pipe(gulp.dest(DIST_ASSETS_FOLDER));
});

gulp.task('assets', ['clean'], function() {
  return gulp.src(SRC_ASSETS).pipe(gulp.dest(DIST_ASSETS_FOLDER));
});

gulp.task('build', ['clean-html', 'less', 'assets'], function() {
  return gulp.src(DIST_FOLDER).pipe($.connect.reload());
});

gulp.task('default', ['build']);

gulp.task('watch', function() {
  gulp.watch(['src/**/*', 'resources/**/*'], ['build']);
});

gulp.task('serve', ['watch', 'build'], function() {
  $.connect.server({
    name: 'Dev App',
    root: ['dist', 'dist/fr'],
    port: PORT,
    livereload: true
  });
  gulp.src('').pipe($.open({ uri: `http://localhost:${PORT}` }));
});
