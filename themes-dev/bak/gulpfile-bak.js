const gulp = require('gulp')
const postcss = require('gulp-postcss')
const rename = require('gulp-rename')

// 编译 Tailwind CSS
function processTailwind() {
  return gulp
    .src('css/main.css')
    .pipe(postcss())
    // .pipe(rename((p) => {
    //   p.dirname = 'dist'
    // }))
    // .pipe(rename({
    //   dirname: "css",
    //   basename: "main",
    //   prefix: "prev-",
    //   suffix: "-main",
    //   extname: ".css"
    // }))
    .pipe(gulp.dest('dist'))
}
gulp.task('default', processTailwind)

// 通过 PurgeCSS 删除未使用的 CSS 代码
// const purgecss = require('gulp-purgecss')
// gulp.task('purgecss', () => {
//   return gulp
//     .src('src/**/*.css')
//     .pipe(purgecss({
//       content: ['src/**/*.html']
//     }))
//     .pipe(gulp.dest('dist/css'))
// })

// # 串行执行
gulp.series('series', ['hello', 'world'])

// # 并行执行
gulp.parallel('parallel', ['hello', 'world'])

// 静态服务器
gulp.task('serve', () => {
  gulp.watch(['./src/pages/**/*.scss', './src/components/**/*.scss'], processTailwind)
  gulp.watch('src/**/*.js', ['js'])
  gulp.watch('src/**/*.scss', ['style'])
})

// 开始
// gulp.task('default', gulp.series('scss', 'serve'))

//live reload webserver gulp-webserver
//make sure will have included index file
// within dist/build(whatever you call) directory
gulp.task('webserver', function() {
  gulp.src('dist/')
      .pipe(webserver({
          livereload: true,
          port: 8383,
          open: true
      }));
});
//default action of `gulp` command
gulp.task('default', ['watch', 'webserver'])

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

// 处理 JS
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(uglify())
    .pipe(dest('output/'));
}

// 图片压缩
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant'); //png图片压缩插件

gulp.task('default', function () {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()] //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest('dist'));
});

// 浏览器自动刷新
// 静态服务器
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// 代理
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "你的域名或IP"
    });
});

// gulpfile.js简易栗子
var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// 静态服务器
gulp.task('default', function () {
  browserSync.init({
    server: {
      baseDir: "./app"
    }
  });

  // 监听文件改变手动reload资源到浏览器
  gulp.watch("./app/*.html").on("change", browserSync.reload);
  gulp.watch("./app/css/*.css").on("change", browserSync.reload);
  gulp.watch("./app/js/*.js").on("change", browserSync.reload);
});

// 编译 Tailwind CSS
gulp.task('build:tailwind', () => {
  // const tailwindcss = require('tailwindcss')
  return gulp
    .src('src/css/main.css')
    // .pipe($.sourcemaps.init())
    .pipe($.postcss())
    // .pipe($.postcss([
    //   tailwindcss('./tailwind.config.js'),
    //   // require('tailwindcss'),
    //   // require('autoprefixer'),
    // ]))
    // .pipe($.cleanCSS({ level: 2 }))
    .pipe(gulp.dest('dist'))
})