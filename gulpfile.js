const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const DIST_FOLDER = 'dist';
const TMP_FOLDER = 'dist/tmp';

gulp.task('clean', function () {
	return gulp.src([DIST_FOLDER], { read: false }).pipe($.clean());
});

gulp.task('html-partial', ['clean'], function () {
	return gulp.src(['src/**/*.html','!src/**/*.partial.html'])
		.pipe($.fileInclude({
			prefix: '@@',
			basepath: '@file',
			indent: true
		}))
		.pipe(gulp.dest(TMP_FOLDER));
});

gulp.task('html-i18n', ['html-partial'], function () {
	return gulp.src(TMP_FOLDER + '/**')
        .pipe($.i18nLocalize({
			delimeters: ['${{', '}}'],
            locales: ['en', 'fr'],
			localeDir: './resources/i18n',
			schema: 'directory'
        }))
        .pipe(gulp.dest(DIST_FOLDER));
});


gulp.task('clean-build', ['html-i18n'], function () {
	return gulp.src([TMP_FOLDER], { read: false }).pipe($.clean());
});

gulp.task('build', ['clean-build']);

gulp.task('default', ['build']);
