const gulp = require('gulp')
const del = require('del')
const browserSync = require('browser-sync').create()
// const pngquant = require('imagemin-pngquant')
const $ = require('gulp-load-plugins')()

// 全局配置
let app = {
  root: './',
  base: 'src',
  dest: 'dist',
  clean: ['dist/**', '!dist/', '!**/img/', '!**/img/**'],
  src: [
    'src/**',
    '!**/bak/',
    '!**/bak/**',
    '!**/img/**',
  ],
  html: ['src/**/*.html', '!**/bak/**'],
  css: {
    src: ['src/css/main.styl'],
    dest: 'dist/css',
  },
  js: {
    src: ['src/js/**/*.js'],
    dest: 'dist/js',
  },
  img: {
    src: ['src/**/img/**', '!**/bak/**'],
    dest: 'dist/img',
  },
}

// 删除目标文件夹：force 表示强制删除
gulp.task('del', (cb) => {
  console.log('清理目标目录\n')
  del(app.dest, { force: true })
  cb()
})

// 清理除图片外的所有文件及目录
gulp.task('clean', (cb) => {
  console.log('清理目标目录\n')
  del(app.clean, { force: true })
  cb()
})

// 复制源文件到目标文件夹
gulp.task('copy', () => {
  return gulp.src(app.src)
    .pipe($.changed(app.dest))
    .pipe($.debug({ title: '复制文件:' }))
    // .pipe($.if('*.html', $.htmlmin(htmlminOpts)))
    .pipe(gulp.dest(app.dest))
  })

  // 编译 css
  gulp.task('build:css', () => {
    return gulp
    .src(app.css.src)
    .pipe($.debug({ title: '编译 css:' }))
    .pipe($.stylus())
    .pipe($.postcss())
    // .pipe($.cssmin())
    // .pipe($.cleanCss())
    .pipe(gulp.dest(app.css.dest))
  })

  // 编译 js
  gulp.task('build:js', () => {
    return gulp
    .src(app.js.src)
    .pipe($.debug({ title: '编译 js:' }))
    .pipe($.babel())
    .pipe($.terser())
    .pipe(gulp.dest(app.js.dest))
})

// 压缩图片
gulp.task('min:img', () => {
  return gulp.src(app.img.src)
    .pipe($.changed(app.dest))
    // .pipe($.logger({ showChange: true }))
    .pipe($.debug({ title: '压缩图片:' }))
    // .pipe($.imagemin({ progressive: true }))
    // .pipe($.imagemin({
    //   progressive: true,
    //   use: [pngquant({ quality: '65-80' })],
    // }))
    .pipe($.tinyimg('wBN_kH_VxLdKkhGdfgk1ZdNS7onDxWgT'))
    .pipe(gulp.dest(app.dest))
})

// 编译引用的资源文件
gulp.task('build:use', () => {
  return gulp.src(app.html)
    .pipe($.debug({ title: '编译引用文件:' }))
    // .pipe($.useref())
    // .pipe($.if('*.styl', $.stylus(), $.postcss()))
    // .pipe($.if('*.js', $.babel()))
    .pipe(gulp.dest(app.dest))
})

// 静态服务器
gulp.task('server', (done) => {
  browserSync.init({
    server: './dist',
    // proxy: '域名或IP',
    // port: 8000,
    open: 'ui',
    // open: 'local',
    // watch: true,
    // notify: false,
  })
  done() // 如果任务无返回，则必须使用回调函数来指示任务已完成
})

// 触发浏览器同步
const previewReload = (done) => {
  console.log('Reloading Browser Preview.\n')
  browserSync.reload()
  done()
}

// 监听任务并同步浏览器资源：文件变化后触发对应的任务
gulp.task('watch', () => {
  // gulp.watch(app.src, ['copy'])
  // gulp.watch(app.img，browserSync.reload)
  // gulp.watch(app.img).on('change', browserSync.reload)
  gulp.watch('src/**', gulp.series(['build:use', 'build:css', 'build:js'], previewReload))
  // gulp.watch(app.html, gulp.series(['build:use', 'build:css'], previewReload))
  // gulp.watch(app.css.src, gulp.series('build:css', previewReload))
  gulp.watch(app.img.src, gulp.series('min:img', previewReload))
  console.log('Watching for Changes..\n')
})

// 打包文件
gulp.task('build', gulp.series(['build:use', 'build:css', 'build:js', 'min:img']))
gulp.task('rebuild', gulp.series('del', ['build:use', 'build:css', 'build:js', 'min:img']))
gulp.task('dev', gulp.series('build', 'server', 'watch'))
gulp.task('default', gulp.series('dev'))
