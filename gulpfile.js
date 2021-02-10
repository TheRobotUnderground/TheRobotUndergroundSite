// Initialize modules
const {src,  dest, watch, series, parallel} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// File path variables
const files = {
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js',

}

// Sass task
function scssTask(){
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(postcss([cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist')
    );
}

// JS task
function jsTask(){
    return src(files.jsPath)
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(dest('dist')
    );
}

// Cachebusting task
const cbString = new Date().getTime();
function cacheBustTask(){
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.')
    );
}

// Watch task
function watchTask(){
    watch([files.scssPath, files.jsPath], 
        parallel(scssTask, jsTask));
}

// Default task
exports.default = series(
    parallel(scssTask, jsTask),
    cacheBustTask,
    watchTask
);

// const gulp = require('gulp');
// const browserSync = require("browser-sync");
// // Setting up an example task
// gulp.task('hello', function(done) {

//     console.log('Oye!');
//     done(); // Calling the callback function
// });

// // The SASS task
// gulp.task('sass', function() {
//     return gulp.src('app/scss/styles.scss') // Take CSS from here
//         .pipe(sass()) // Convert it using gulp-sass
//         .pipe(gulp.dest('app/css')) // Send it to the destination
//         .pipe(browserSync.reload({  // Reload the browser
//             stream: true
//         }))
// });

// // The WATCH task
// gulp.task('watch', function() {
//     gulp.watch('app/scss/styles.scss', gulp.series('sass'));
//     gulp.watch('app/index.html', browserSync.reload); 
//     gulp.watch('app/js/*.js', browserSync.reload); 
// });


// // The BROWSERSYNC task
// gulp.task('browserSync', function() {
//     browserSync.init({
//         server: {
//             baseDir: 'app'
//         },
//     })
// });

// // For live editing
// gulp.task('go', gulp.parallel('browserSync', 'sass'), 'watch');