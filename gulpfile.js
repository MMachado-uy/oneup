// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    webserver = require('gulp-webserver'),
    lr = require('tiny-lr'),
    server = lr();

// Libraries
var jqueryPath = './node_modules/jquery/dist/jquery.min.js';
var bootstrapJSPath = './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

var bootstrapCSSPath = './node_modules/bootstrap/dist/css/bootstrap.min.css';

// Styles
gulp.task('styles', function() {
    return gulp.src([
            bootstrapCSSPath,
            './src/styles/*.scss'
        ])
        .pipe(gulp.dest('dist/styles'))
        .pipe(concat('main.css'))
        .pipe(sass().on('error', sass.logError)).pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/styles'))
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src([
            jqueryPath,
            bootstrapJSPath,
            'src/scripts/*.js'
        ])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/scripts'))
});

// Images
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('html', function () {
    gulp.src('./*.html')
        .pipe(livereload());
});

// Clean
gulp.task('clean', function() {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], { read: false })
        .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], () => {
    gulp.run('styles', 'scripts', 'images');
});

// Webserver
gulp.task('webserver', function () {
    gulp.src('./')
    .pipe(webserver({
        livereload: true,
        open: true,
        port: 3000,
        fallback: './index.html'
    }));
});

// Watch
gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);
    
    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    
    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

    // Watch the html
    gulp.watch('./*.html', ['html']);
});

// Serve the project
gulp.task('serve', ['build'], () => {
    gulp.start(['webserver', 'watch'])
});

// Compile the project
gulp.task('build', ['clean'], () => {
    gulp.start(['styles', 'scripts', 'images'])
});
