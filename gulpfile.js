var gulp        = require('gulp');
var sequence    = require('run-sequence');

var fs          = require('fs');
var async       = require('async');
var rimraf      = require('rimraf');
var mkdirp      = require('mkdirp');
var iconfont    = require('gulp-iconfont');
var consolidate = require('consolidate');
var sass        = require('node-sass');

var Pageres     = require('pageres');
var open        = require('open');
var ttfpatch    = require('nodeTTFPatch');

var
  SRC_DIR        = './icons',
  FONT_DIR       = './dist/fonts',
  SASS_FONT_DIR  = 'nib-styles-v2-icons/dist/fonts',
  FONT_NAME      = 'nibdings',
  CLASS_NAME     = 'v2-icon',
  SCREENSHOT_DIR = 'dist/screenshots'
;

function renderTemplate(src, dst, data, callback) {
  consolidate
    .ejs(src, data)
    .then(function(html) {
      fs.writeFile(dst, html, callback);
    })
    .catch(function(err) {
      callback(err);
    })
  ;
}

function renderScss(src, dst, callback) {
  sass.render({file: src}, function(err, result) {
    if (err) return callback(err);
    fs.writeFile(dst, result.css, callback);
  });
}

gulp.task('clean--stylesheet', function(cb) {
  rimraf('dist/index.css', function(){
    rimraf('dist/index.scss', cb);
  });
});

gulp.task('clean--screenshots', function(cb) {
  rimraf('test/screenshots',cb);
});

gulp.task('clean--fonts', function(cb) {
  rimraf(FONT_DIR, cb);
});

gulp.task('mkdir--fonts', function(cb) {
  mkdirp(FONT_DIR, cb);
});

gulp.task('build--fonts', function(done) {
  gulp.src([SRC_DIR+'/*.*', SRC_DIR+'/**/*.*'])
    .pipe(iconfont({
      fontName:         FONT_NAME,
      appendCodepoints: true,
      fontHeight:       1000, //magic number to fix curve rendering problem see: https://github.com/fontello/svg2ttf/issues/18
      normalize:        true,
      log:              false //replace with `function() {}` to disable logging
    }))
    .on('codepoints', function(codepoints, options) {

      var data = {
        glyphs:     codepoints,
        fontName:   options.fontName,
        fontPath:   './fonts',
        className:  CLASS_NAME
      };

      async.parallel(
        [

          //generate a scss and css files from a template
          function(done) {
            renderTemplate('./templates/stylesheet.ejs', './dist/index.scss', data, function(err) {
              if (err) return done(err);
              renderScss('./dist/index.scss', './dist/index.css', done)
            });
          },

          //generate a listing from a template
          function(done) {
            renderTemplate('./templates/listing.ejs', './dist/listing.html', data, done);
          }

        ],
        done
      );

    })
    .pipe(gulp.dest(FONT_DIR))
  ;
});

gulp.task('fix--fonts', function() {
  ttfpatch(__dirname+'/fonts/nibdings.ttf', 0); //fix permission error displayed in IE
});

gulp.task('screenshot', function(cb){

  var pageres = new Pageres({delay: 2})
    .src('test/index.html', ['480x320'], {crop: false})
    .dest(SCREENSHOT_DIR)
    .run(function(err) {

      if (err) {
        cb(err);
      } else {
        open(SCREENSHOT_DIR+'/test!index.html-480x320.png', cb);
      }

    })
  ;

});

gulp.task('default', function() {
  sequence(
    ['clean--fonts', 'clean--stylesheet', 'clean--screenshots'],
    'mkdir--fonts',
    'build--fonts',
    'fix--fonts',
    ['screenshot']
  )
});