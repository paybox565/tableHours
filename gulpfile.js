const { series, src, dest } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const less = require('gulp-less');

function scripts(cb) {
    return src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write())
        .pipe(dest('dist'))
}

function styles(cb) {
    return src('src/css/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write())
        .pipe(dest('dist'))
}

exports.default = series(styles, scripts);
