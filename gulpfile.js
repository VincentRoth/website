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

function clean() {
  return gulp
    .src([DIST_FOLDER], { read: false, allowEmpty: true })
    .pipe($.clean());
}
exports.clean = clean;

function htmlPartial() {
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
}
exports.htmlPartial = htmlPartial;

function htmlI18n() {
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
}
exports.htmlI18n = htmlI18n;

function htmlClean() {
  return gulp
    .src([DIST_TMP_FOLDER], { read: false, allowEmpty: true })
    .pipe($.clean());
}
exports.htmlClean = htmlClean;

function less() {
  return gulp
    .src(SRC_CSS)
    .pipe($.plumber())
    .pipe(
      $.less({
        paths: [path.join(__dirname, 'less', 'includes')]
      })
    )
    .pipe(gulp.dest(DIST_ASSETS_FOLDER));
}
exports.less = less;

function assets() {
  return gulp.src(SRC_ASSETS).pipe(gulp.dest(DIST_ASSETS_FOLDER));
}
exports.assets = assets;

const build = gulp.series(
  clean,
  gulp.parallel(gulp.series(htmlPartial, htmlI18n, htmlClean), less, assets)
);
gulp.task('build', build);
gulp.task('default', build);

const reloadOnBuild = () => gulp.src(DIST_FOLDER).pipe($.connect.reload());
exports.reloadOnBuild = reloadOnBuild;

function watch() {
  gulp.watch(['src/**/*', 'resources/**/*'], gulp.series(build, reloadOnBuild));
}
exports.watch = watch;

function serveAndOpen() {
  $.connect.server({
    name: 'Dev App',
    root: ['dist', 'dist/fr'],
    port: PORT,
    livereload: true
  });
  gulp.src(__filename).pipe($.open({ uri: `http://localhost:${PORT}` }));
}
exports.serveAndOpen = serveAndOpen;

const serve = gulp.series(
  build,
  reloadOnBuild,
  gulp.parallel(watch, serveAndOpen)
);
gulp.task('serve', serve);
