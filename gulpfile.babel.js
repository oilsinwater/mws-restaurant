/**
 * Gulp config
 */

// Load plugins
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import runSequence from 'run-sequence';
import lazypipe from 'lazypipe';
import pngquant from 'imagemin-pngquant';
import imagemin from 'gulp-imagemin';

const bs = require('browser-sync').create();

let fs = require('fs');
let $ = gulpLoadPlugins();
let reload = bs.reload;

// lint
gulp.task('lint', () => {
  return gulp
    .src(['src/**/*.js', '!node_modules/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
});

// clear files from temp
gulp.task('clear', () => {
  del(['build/**/*']);
});

// clear files from dist
gulp.task('clear:dist', () => {
  return del(['dist/**/*']);
});

// Signature start
gulp.task('start', () => {
  console.log('ssssip...ssssssip....sssssssssip ');
});
// Signature finish
gulp.task('neck', () => {
  console.log('...GUUULP!!');
});

// Copy unaltered images
gulp.task('unaltered', () => {
  return gulp
    .src('src/img/unaltered/**')
    .pipe(gulp.dest('dist/img/unaltered'))
    .pipe(gulp.dest('build/img/unaltered'));
});

// Builds responsive images
gulp.task('images', ['unaltered'], () => {
  return gulp
    .src('src/img/*.jpg')
    .pipe(
      imagemin({
        progressive: true,
        use: [pngquant()],
        speed: 5
      }).pipe(
        $.responsive(
          {
            '*': [
              {
                width: 800,
                quality: 70,
                rename: {
                  suffix: '-800',
                  extname: '.png'
                }
              },
              {
                width: 600,
                quality: 50,
                rename: {
                  suffix: '-600',
                  extname: '.png'
                }
              },
              {
                width: 300,
                quality: 40,
                rename: { suffix: '-300', extname: '.png' }
              }
            ]
          },
          {
            progressive: true,
            withMetadata: false
          }
        )
      )
    )
    .pipe(gulp.dest('build/img'))
    .pipe(gulp.dest('dist/img'));
});

// Prep process of js, css, html files
gulp.task('html', () => {
  let mapKey = fs.readFileSync('src/MAP_KEY', 'utf8');

  return gulp
    .src('src/*.html')
    .pipe($.useref())
    .pipe($.if('*.css', $.autoprefixer()))
    .pipe($.if('*.js', $.babel()))
    .pipe($.stringReplace('<INSERT_TOKEN>', mapKey))
    .pipe(
      $.if(
        '*.html',
        $.htmlmin({
          removeComments: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeOptionalTags: true
        })
      )
    )
    .pipe(gulp.dest('build/'));
});

// Scan html for js and css then optimize
gulp.task('html:dist', () => {
  let mapKey = fs.readFileSync('src/MAP_KEY', 'utf8');

  return gulp
    .src('src/*.html')
    .pipe($.size({ title: 'html (before)' }))
    .pipe($.useref({}, lazypipe().pipe($.sourcemaps.init)))
    .pipe($.if('*.css', $.size({ title: 'css (before)' })))
    .pipe(
      $.if(
        '*.css',
        $.csso({
          restructure: false,
          sourceMap: true,
          debug: true
        })
      )
    )
    .pipe($.if('*.css', $.size({ title: 'css (after)' })))
    .pipe($.if('*.css', $.autoprefixer()))
    .pipe($.if('*.js', $.babel()))
    .pipe($.stringReplace('<INSERT_TOKEN>', mapKey))
    .pipe($.if('*.js', $.size({ title: 'js (before)' })))
    .pipe($.if('*.js', $.uglifyEs.default()))
    .pipe($.if('*.js', $.size({ title: 'js (after)' })))
    .pipe($.sourcemaps.write('.'))
    .pipe(
      $.if(
        '*.html',
        $.htmlmin({
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          minifyJS: { compress: { drop_console: true } },
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeOptionalTags: true
        })
      )
    )
    .pipe($.if('*.html', $.size({ title: 'html (after) ', showFiles: false })))
    .pipe(gulp.dest('dist/'));
});

// process sw
gulp.task('sw', () => {
  let bundler = browserify('./build/sw.js', {
    debug: true
  });
  return bundler
    .bundle() // concatenation
    .pipe(source('sw.js'))
    .pipe(buffer())
    .pipe(gulp.dest('build')); // get stream with pathname
});

// optimize sw
gulp.task('sw:dist', () => {
  let bundler = browserify('./dist/sw.js', {
    debug: true
  });
  return bundler
    .bundle() // concatenation
    .pipe(source('sw.js')) // get stream with pathname
    .pipe(buffer()) // stream for other plugins
    .pipe(
      $.size({
        title: 'Sw (before) '
      })
    )
    .pipe(
      $.sourcemaps.init({
        loadMaps: true
      })
    )
    .pipe($.uglifyEs.default()) // minify js
    .pipe(
      $.size({
        title: 'Sw (after) '
      })
    )
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

// // Generate a service worker
// gulp.task('service-worker', () => {
//   let swDest = 'dist/sw.js';
//   return workboxBuild
//     .generateSW({
//       cacheId: 'mwsrestaurants-reviews',
//       globDirectory: 'dist',
//       swDest: swDest,
//       globPatterns: ['**/*.{css,json,jpg,ico,png,html,js,crt,key}'],
//       // store content requests at runtime
//       runtimeCaching: [
//         {
//           urlPattern: /\.(?:png|jpg|webp)$/,
//           // Apply a cache-first strategy
//           handler: 'cacheFirst',
//           options: {
//             // custom cache name
//             cacheName: 'img',
//             // Limit to cache images
//             expiration: {
//               maxEntries: 200 // arbitrary...
//             }
//           }
//         }
//       ]
//     })
//     .then(({ count, size }) => {
//       console.log(
//         `Generated ${swDest} which will precache ${count} files, totaling ${size} bytes.`
//       );
//     })
//     .catch(err => {
//       console.log(`Failed with error: ${err}`);
//     });
// });

gulp.task('service-worker', () => {
  return gulp
    .src('src/sw.js')
    .pipe(gulp.dest('build/'))
    .pipe(gulp.dest('dist/'));
});

// Copy web manifest
gulp.task('manifest', () => {
  return gulp
    .src('src/manifest.json')
    .pipe(gulp.dest('dist/').pipe(gulp.dest('build/')));
});
// // Copy ssl files
// gulp.task('ssl', () => {
//   return gulp.src('src/ssl/dev/**').pipe(gulp.dest('build/ssl'));
// });

// gulp.task('ssl:dist', () => {
//   return gulp.src('src/ssl/pro/**').pipe(gulp.dest('dist/ssl'));
// });

// Watch changes and reload
gulp.task('serve', () => {
  runSequence(
    [
      'start',
      'clear',
      'images',
      'lint',
      'html',
      'service-worker',
      'sw',
      'manifest',
      'neck'
    ],
    () => {
      bs.init({
        browser: 'google chrome',
        loglevel: 'debug',
        server: 'build',
        port: 3030
      });
      // watch
      gulp.watch(['src/*.html', 'MAP_KEY'], ['html', reload]);
      gulp.watch(['src/*.html'], ['html', reload]);
      gulp.watch(['src/img/**'], ['images', reload]);
      gulp.watch(['src/css/*.css'], ['html', reload]);
      gulp.watch(['src/js/*.js'], ['lint', 'html', reload]);
      gulp.watch(['src/sw.js'], ['lint', 'sw', reload]);
      gulp.watch(['src/manifest.json'], ['manifest', reload]);
    }
  );
});

// Bundle and serve the optimized site
gulp.task('serve:dist', ['default'], () => {
  bs.init({
    browser: 'google chrome',
    loglevel: 'debug',
    server: 'dist',
    port: 8000
  });

  gulp.watch(['src/*.html'], ['html:dist', reload]);
  gulp.watch(['src/img/**'], ['images', reload]);
  gulp.watch(['src/css/*.css'], ['html:dist', reload]);
  gulp.watch(['src/js/*.js'], ['lint', 'html:dist', reload]);
  gulp.watch(['src/sw.js'], ['lint', 'sw:dist', reload]);
  gulp.watch(['src/manifest.json'], ['manifest:dist', reload]);
});
// Build production files in order,
gulp.task('default', ['clear:dist'], done => {
  runSequence(
    [
      'start',
      'clear',
      'images',
      'lint',
      'html:dist',
      'service-worker',
      'sw:dist',
      'manifest',
      'neck'
    ],
    done
  );
});
