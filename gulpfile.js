var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('no-minify', function(){
	gulp.src(['./src/autocomplete.js', './src/autocomplete.css'])
		.pipe(gulp.dest('./dist'));
});

gulp.task('minify-js', function(){
	gulp.src(['./src/autocomplete.js'])
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('minify-css', function(){
	gulp.src(['./src/autocomplete.css'])
		.pipe(minifyCss())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['no-minify', 'minify-js', 'minify-css']);