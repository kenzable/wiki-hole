"use strict";

// adapted from https://scotch.io/tutorials/getting-started-with-browserify

var babelify   = require('babelify'),
    browserify = require('browserify'),
    buffer     = require('vinyl-buffer'),
    gulp       = require('gulp'),
    source     = require('vinyl-source-stream'),
    rename     = require('gulp-rename'),
    runSeq = require('run-sequence');

var config = {
    js: {
        src: './js/content.js',       // Entry point
        outputDir: './',  // Directory to save bundle to
        outputFile: 'content.js' // Name to use for bundle
    },
};

function bundle (bundler) {

    bundler
      .bundle()                                       // Start bundle
      .pipe(source(config.js.src))                   // Entry point
      .pipe(buffer())                               // Convert to gulp pipeline
      .pipe(rename(config.js.outputFile))          // Rename output
      .pipe(gulp.dest(config.js.outputDir));      // Save 'bundle' to main directory
}

gulp.task('bundle', function () {
    var bundler = browserify(config.js.src)  // Pass browserify the entry point
                    .transform(babelify, { presets : [ 'es2015' ] });  // Then, babelify, with ES2015 preset
    bundle(bundler);  // Chain other options -- sourcemaps, rename, etc.
});

gulp.task('default', function () {

    gulp.start('bundle');

    // Run when anything inside of browser/js changes.
    gulp.watch('js/content.js', function () {
        runSeq('bundle');
    });
});
