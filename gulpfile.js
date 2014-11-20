var gulp        = require('gulp');
var sequence    = require('run-sequence');

var rimraf      = require('rimraf');
var mkdirp      = require('mkdirp');
var rename      = require('gulp-rename');
var iconfont    = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

var
  SRC_DIR       = './images',
  FONT_DIR      = './fonts',
  SASS_FONT_DIR = 'nib-styles-v2-icons/fonts',
  FONT_NAME     = 'nibdings',
  CLASS_NAME    = 'v2-icon'
;

gulp.task('clean--stylesheet', function(cb) {
  rimraf('index.css', function(){
    rimraf('index.scss', cb);
  });
});

gulp.task('clean--fonts', function(cb) {
  rimraf(FONT_DIR, cb);
});

gulp.task('mkdir--fonts', function(cb) {
  mkdirp(FONT_DIR, cb);
});

gulp.task('build--fonts', function(cb) {
  gulp.src([SRC_DIR+'/*.*', SRC_DIR+'/**/*.*'])
    .pipe(iconfont({
      fontName:         FONT_NAME,
      appendCodepoints: false,
      normalize:        true,
      log:              false //replace with `function() {}` to disable logging
    }))
    .on('codepoints', function(codepoints, options) {

      //generate an icon stylesheet from a template
      gulp.src('templates/stylesheet.ejs')
        .pipe(consolidate('ejs', {
          glyphs:     codepoints,
          fontName:   options.fontName,
          fontPath:   FONT_DIR,
          className:  CLASS_NAME
        }))
        .pipe(rename('index.css'))
        .pipe(gulp.dest('.'))
      ;

      //generate a SASS version icon stylesheet from a template
      gulp.src('templates/stylesheet.ejs')
        .pipe(consolidate('ejs', {
          glyphs:     codepoints,
          fontName:   options.fontName,
          fontPath:   SASS_FONT_DIR,
          className:  CLASS_NAME
        }))
        .pipe(rename('index.scss'))
        .pipe(gulp.dest('.'))
      ;

      //generate an icon listing from a template
      gulp.src('templates/example.ejs')
        .pipe(consolidate('ejs', {
          glyphs:     codepoints,
          fontName:   options.fontName,
          fontPath:   FONT_DIR,
          className:  CLASS_NAME
        }))
        .pipe(rename('example/example.html'))
        .pipe(gulp.dest('.'))
      ;

      cb();//FIXME: it still won't be finished when we get to here
    })
    .pipe(gulp.dest(FONT_DIR))
  ;
});

gulp.task('default', function() {
  sequence(
    ['clean--fonts', 'clean--stylesheet'],
    'mkdir--fonts',
    'build--fonts'
  )
});