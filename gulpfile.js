var gulp        = require('gulp');
var sequence    = require('run-sequence');

var fs          = require('fs');
var async       = require('async');
var rimraf      = require('rimraf');
var mkdirp      = require('mkdirp');
var iconfont    = require('gulp-iconfont');
var glyphsMap   = require('iconfont-glyphs-map');
var consolidate = require('consolidate');
var sass        = require('node-sass');

var Pageres     = require('pageres');
var open        = require('open');
var ttfpatch    = require('nodeTTFPatch');

var
  SRC_DIR        = './icons',
  FONT_DIR       = './dist/fonts',
  FONT_NAME      = 'nibdings',
  CLASS_NAME     = 'v2-icon',
  SCREENSHOT_DIR = './dist/screenshots'
;

function renderTemplate(src, dst, data, callback) {
  consolidate
    .ejs(src, data)
    .then(function(html) {
      fs.writeFile(dst, html, {encoding: 'utf8'}, callback);
    })
    .catch(function(err) {
      callback(err);
    })
  ;
}

function renderScss(src, dst, callback) {
  sass.render({file: src}, function(err, result) {
    if (err) return callback(err);
    fs.writeFile(dst, result.css, {encoding: 'utf8'}, callback);
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
  gulp.src(SRC_DIR+'/**/*.svg')
    .pipe(iconfont({
      fontName:         FONT_NAME,
      formats: ['eot', 'svg', 'ttf', 'woff'],
      appendUnicode:    true,
      fontHeight:       1000, //magic number to fix curve rendering problem see: https://github.com/fontello/svg2ttf/issues/18
      normalize:        true,
      log:              false //replace with `function() {}` to disable logging
    }))
    .on('glyphs', function(glyphs, options) {

      var glyphMap = glyphsMap(glyphs, '\\', true);

      var sizeMap = {
        smallest:     16,
        smaller:      24,
        small:        32,
        medium:       48,
        large:        64,
        largest:      128
      };

      var colorMap = {
        lightgreen:   '#009623',
        darkgreen:    '#0a6d12',
        lightgrey:    '#b9b9b9',
        darkgrey:     '#444',
        white:        '#fff'
      };

      var data = {
        glyphs:     glyphMap,
        sizes:      sizeMap,
        colors:     colorMap,
        fontName:   options.fontName,
        fontPath:   './fonts',
        className:  CLASS_NAME
      };

      var legacyData = {
        glyphs:     glyphMap,
        sizes:      sizeMap,
        colors:     colorMap,
        fontName:   options.fontName,
        fontPath:   'nib-styles-v2-icons/dist/fonts',
        className:  CLASS_NAME
      };

      async.parallel(
        [

          //generate a scss and css files from a template
          function(done) {
            renderTemplate('./templates/mixin.ejs', './dist/mixin.scss', data, function(err) {
              if (err) return done(err);
              renderTemplate('./templates/compiled.ejs', './dist/compiled.scss', data, function(err) {
                if (err) return done(err);
                renderScss('./dist/compiled.scss', './dist/compiled.css', done)
              });
            });
          },

          //generate a legacy scss from a template
          function(done) {
            renderTemplate('./templates/legacy.ejs', './dist/legacy.scss', legacyData, done);
          },

          //generate a listing from a template
          function(done) {
            renderTemplate('./templates/listing.ejs', './dist/listing.html', data, done);
          },

          //generate metadata
          function(done) {
            renderTemplate('./templates/metadata.ejs', './dist/metadata.js', data, done);
          }

        ],
        done
      );

    })
    .pipe(gulp.dest(FONT_DIR))
  ;
});

gulp.task('fix--fonts', function() {
  ttfpatch(FONT_DIR+'/nibdings.ttf', 0); //fix permission error displayed in IE
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
