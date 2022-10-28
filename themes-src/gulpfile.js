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

# 串行执行
gulp.series('series', ['hello', 'world'])

# 并行执行
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
gulp.task('default', ['watch', 'webserver']);