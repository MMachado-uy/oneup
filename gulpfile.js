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
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    webserver = require('gulp-webserver'),
    gutil = require('gulp-util');
    lr = require('tiny-lr'),
    server = lr();

// Paths
var jsPaths = [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    'src/scripts/script.js'
];

var cssPaths = [
    './node_modules/bootstrap/dist/css/bootstrap.min.css',
    './src/styles/*.scss'
];

// Styles
gulp.task('styles', function(cb) {
    var stream = gulp.src(cssPaths)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat('main.css'))
        //.pipe(gulp.dest('dist/styles'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist/styles'))
        .on('end', cb);
});

// Scripts
gulp.task('scripts', ['styles'], function(cb) {
    var stream = gulp.src(jsPaths)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        //.pipe(gulp.dest('dist/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist/scripts'))
        .on('end', cb);
});

// Images
gulp.task('images', ['scripts'], function(cb) {
    var stream = gulp.src('src/images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        }))
        .pipe(gulp.dest('dist/images'))
        .on('end', cb);
});

// Html
gulp.task('html', function () {
    gulp.src('./*.html')
        .pipe(livereload(server));
});

// Clean
gulp.task('clean', function() {
    gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], { read: false })
        .pipe(clean())
        .pipe(gulp.dest('dist'));
});

// Default task
gulp.task('default', ['clean', 'styles', 'scripts', 'images'], () => {
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
    gulp.watch('src/scripts/*.js', ['scripts']);
    
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
gulp.task('build', ['styles', 'scripts', 'images'], () => {
});
