const path = require('path');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const DIST_FOLDER = 'dist';
const DIST_ASSETS_FOLDER = `${DIST_FOLDER}/assets`;

const SRC_HTML = 'src/**/*.html';
const SRC_CSS = 'src/**/*.less';
const SRC_ASSETS = 'src/assets/**/*';
const SRC_JS = `${DIST_FOLDER}/**/*.js`;

const PORT = 9000;

function clean() {
  return gulp
    .src([DIST_FOLDER], { read: false, allowEmpty: true })
    .pipe(plugins.clean());
}

function assets() {
  return gulp.src(SRC_ASSETS).pipe(gulp.dest(DIST_ASSETS_FOLDER));
}

function html() {
  return gulp
    .src([SRC_HTML, '!src/**/*.partial.html'])
    .pipe(
      plugins.fileInclude({
        prefix: '@@',
        basepath: '@file',
        indent: true
      })
    )
    .pipe(
      plugins.useref({
        base: '../'
      })
    )
    .pipe(
      plugins.i18nLocalize({
        delimeters: ['${{', '}}'],
        locales: ['en', 'fr'],
        localeDir: 'resources/i18n',
        schema: 'directory',
        ignoreErrors: true
      })
    )
    .pipe(gulp.dest(DIST_FOLDER));
}

function less() {
  return gulp
    .src(SRC_CSS)
    .pipe(plugins.plumber())
    .pipe(
      plugins.less({
        paths: [path.join(__dirname, 'less', 'includes')]
      })
    )
    .pipe(gulp.dest(DIST_ASSETS_FOLDER));
}

function js() {
  return gulp
    .src(SRC_JS)
    .pipe(plugins.plumber())
    .pipe(
      plugins.minify({
        ext: {
          min: '.js'
        },
        noSource: true
      })
    )
    .pipe(gulp.dest(DIST_FOLDER));
}

const build = gulp.series(clean, assets, gulp.parallel(html, less), js);
gulp.task('build', build);
gulp.task('default', build);

const reload = () => gulp.src(DIST_FOLDER).pipe(plugins.connect.reload());

function watch() {
  gulp.watch(['src/**/*', 'resources/**/*'], gulp.series(build, reload));
}

function serveAndOpen() {
  plugins.connect.server({
    name: 'Dev App',
    root: ['dist', 'dist/fr'],
    port: PORT,
    livereload: true
  });
  gulp.src(__filename).pipe(plugins.open({ uri: `http://localhost:${PORT}` }));
}

const serve = gulp.series(build, reload, gulp.parallel(watch, serveAndOpen));
gulp.task('serve', serve);
