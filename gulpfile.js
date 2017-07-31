var gulp          = require('gulp');
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    livereload    = require('gulp-livereload'),
    plumber       = require('gulp-plumber'),
    svgmin        = require('gulp-svgmin'),
    svgstore      = require('gulp-svgstore'),
    cheerio       = require('gulp-cheerio'),
    path          = require('path');

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
},
sassOptions = {
 errLogToConsole: true,
 outputStyle: 'compressed'
};

gulp.task('sass', function(){
  return gulp.src('assets/stylesheets/**/*.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(sass(sassOptions).on('error', sass.logError))
  .pipe(autoprefixer(autoprefixerOptions))
  .pipe(gulp.dest('assets/stylesheets/'))
  .pipe(livereload())
});

gulp.task('icons', function(){
  return gulp
  .src('assets/images/icons/*.svg')
  .pipe(svgmin(function (file) {
    var prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [{
        cleanupIDs: false
      }]
    }
  }))
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(cheerio(function ($) {
    $('svg').attr('style', 'display:none');
    $('this').attr('viewbox', $('svg').attr('viewbox'));
    $('symbol').attr('viewbox', $('this').attr('viewbox'));
    $('path, g, polygon').each(function(){
      var f = $(this).attr('fill');
      f === 'none' || f === '#000' ? $(this).attr('fill', 'currentColor') : null;
    });
  }))
  .pipe(gulp.dest('assets/images'));
});

gulp.task('watch', function(){
  livereload.listen();
  gulp.watch('assets/stylesheets/**/*.scss', ['sass']);
  gulp.watch('assets/images/icons/*.svg', ['icons']);
});

gulp.task('default', ['sass', 'icons', 'watch']);