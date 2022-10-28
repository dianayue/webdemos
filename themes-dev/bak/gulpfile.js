const gulp = require('gulp');
const del = require('del');
const $ = require('gulp-load-plugins')();
const pkg = require('./package.json');
$.series = gulp.series || $.sequence;
$.parallel = gulp.parallel || $.series;

// 配置
let app = {
  version: pkg.version,
  author: pkg.author,
  src: 'src',
  dest: 'webapp',
  clean: ['webapp/**', '!webapp', '!webapp/eticket', '!webapp/assets', '!**/img', '!**/img/**'],
  static: [
    'src/**',
    '!**/bak/',
    '!**/bak/**',
    // '!**/*.html',
    '!**/img/**',
    '!**/*.styl',
    '!**/*-debug.*'
  ],
  html: {
    src: ['src/**/*.html', '!**/bak/**'],
    dist: 'webapp/**/*.html',
    inc: [
      'src/inc/*.html',
      'src/eticket/index.html',
      'src/head.html',
      'src/head-*.html',
      'src/foot.html',
      'src/foot-*.html',
      'src/js.html',
      'src/js-*.html'
    ]
  },
  style: {
    debug: ['src/assets/css/**/*-debug.css', '!**/bak/**'],
    dest: 'webapp/assets/css'
  },
  script: {
    debug: ['src/assets/js/**/*-debug.js', '!**/bak/**'],
    dest: 'webapp/assets/js'
  },
  image: {
    // src: ['src/assets/img/**/*', '!**/bak/**'],
    src: ['src/**/img/**/*', '!**/bak/**'],
    sprites: 'src/assets/img/sprites/*',
    dest: 'webapp/assets/img'
  }
};

// html 压缩配置
let htmlminOpts = {
  removeComments: true, // 清除注释
  ignoreCustomComments: [/.*#include\s+file=.*/],
  collapseWhitespace: true, // 压缩空格
  collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true" /> ==> <input checked>
  removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input>
  removeScriptTypeAttributes: true, // 删除 <script> 的 type="text/javascript"
  removeStyleLinkTypeAttributes: true, // 删除 <style> 和 <link> 的type="text/css"
  minifyJS: true, // 压缩页面 JS
  minifyCSS: true // 压缩页面 CSS
};

// 删除目标文件夹：force 表示强制删除
gulp.task('del', function() {
  return del(app.dest, {force: true});
});

// 清理除了图片外的所有文件及目录
gulp.task('clean', function() {
  return del(app.clean, {force: true});
});

// 复制源文件到目标文件夹 todo
gulp.task('copy', function() {
  // 排除 inc 文件
  let noinc = app.html.inc.map(path => '!' + path);

  return gulp.src(app.static.concat(noinc), {base: app.src})
    .pipe($.changed(app.dest))
    .pipe($.debug({title: '复制文件:'}))
    .pipe($.if('*.html', $.htmlmin(htmlminOpts)))
    .pipe(gulp.dest(app.dest));
});

// 合并压缩引用的静态文件
gulp.task('min:use', function() {
  return gulp.src(app.html.inc, {base: app.src})
    .pipe($.debug({title: '编译引用文件:'}))
    .pipe($.replace(/vue(\d?)-debug\.js/, 'vue$1.js')) // 替换 vue 为压缩版
    .pipe($.usemin({
      html: [() => $.htmlmin(htmlminOpts)],
      css: [$.cssmin],
      js: [$.uglify],
      inlinejs: [$.uglify],
      inlinecss: [$.cssmin, 'concat']
    }))
    // 为静态引用文件添加 rev 参数：此处 build 路径还没完成
    // .pipe($.if('*.html', $.replace(/(?:href=|src=)['|"](?!\w*:?\/\/)([^\s>"']+?)\.(js|css)([^\s>"']*?)['|"]/gi, function(path) {
    //   if (/(\?|&)rev=/.test(path)) return path; // 已有 rev 参数
    //   console.log('添加 rev 参数的路径：', path + '\n');
    //   if (path.includes('?')) {
    //     return path.replace(/['|"]$/i, '&rev=hash$&');
    //   } else {
    //     return path.replace(/['|"]$/i, '?rev=hash$&');
    //   }
    // })))
    // .pipe($.if('*.css', $.cssmin()))
    // .pipe($.if('*.js', $.uglify()))
    // .pipe($.if('*.html', $.htmlmin(htmlminOpts)))
    // .pipe($.debug({title: 'usemin:'}))
    .pipe(gulp.dest(app.dest));
});

// 更新静态资源版本号：将 rev 参数值替换为该文件的 MD5 值 todo
gulp.task('rev:use', function() {
  let inc = app.html.inc.map(path => path.replace(new RegExp('^' + app.src + '/'), ''));
  // let incFilter = $.filter(inc, {restore: true}); // !! restore 为 true 时过滤值不对

  // return gulp.src(inc, {base: app.dest})
  return gulp.src(app.html.dist, {base: app.dest})
    // 为 inc 文件引用路径添加 rev 参数
    .pipe($.if(inc, $.replace(/(?:href=|src=)['|"](?!\w*:?\/\/)([^\s>"']+?)\.(js|css)([^\s>"']*?)['|"]/gi, path => {
      // path = path.replace(/('|")\.\.\/assets/ig, '$1assets'); // 修正路径：此处修改 rev 不到文件
      if (/(\?|&)rev=/.test(path)) return path; // 已有 rev 参数
      // console.log('添加 rev 参数:', path);
      if (path.includes('?')) {
        return path.replace(/['|"]$/i, '&rev=hash$&');
      } else {
        return path.replace(/['|"]$/i, '?rev=hash$&');
      }
    })))
    // .pipe($.debug({title: '更新版本号:'}))
    .pipe($.revAppend())
    .pipe($.if('inc/*.html', $.replace(/(href=|src=)('|")\.\.\//gi, '$1$2'))) // 修正 inc 目录引用路径
    .pipe(gulp.dest(app.dest));
});

// 压缩图片文件到目标文件夹
gulp.task('min:img', function() {
  return gulp.src(app.image.src, {base: app.src})
    .pipe($.changed(app.dest))
    // .pipe($.logger({showChange: true}))
    .pipe($.debug({title: '压缩图片:'}))
    .pipe($.imagemin({progressive: true}))
    // .pipe($.tinyimg('wBN_kH_VxLdKkhGdfgk1ZdNS7onDxWgT'))
    .pipe(gulp.dest(app.dest));
});

// 用 tinyimg 压缩图片文件到目标文件夹
gulp.task('tinyimg', function() {
  return gulp.src(app.image.src, {base: app.src})
    .pipe($.changed(app.dest))
    .pipe($.debug({title: '压缩图片:'}))
    .pipe($.tinyimg('wBN_kH_VxLdKkhGdfgk1ZdNS7onDxWgT'))
    .pipe(gulp.dest(app.dest));
});

// 雪碧图：合并精灵图 todo
// gulp.task('sprites', function() {
//   let spriteData = gulp.src(app.image.sprites, {base: app.src})
//     .pipe($.changed(app.dest))
//     .pipe($.logger({showChange: true}))
//     .pipe($.spritesmith({
//       cssName: 'sprites.css',
//       imgName: 'sprites.png'
//       // 指定 css 模板，根据模板生成对应的 css 代码
//       // cssTemplate: path.resolve('./gulp/lib/template.css.handlebars')
//     }));

//   let imgStream = spriteData.img
//     .pipe(buffer())
//     .pipe(gulp.dest(app.dest));

//   let cssStream = spriteData.css
//     .pipe(gulp.dest(app.dest));

//   // 将多个流合并，然后统一返回
//   return $.merge([imgStream, cssStream]);
// });

// 监听任务：适用于开发模式，监听文件的变化，并触发指定子任务 todo
gulp.task('watch', function() {
  gulp.watch(app.static, ['copy']);
  gulp.watch(app.html.inc, ['min:use']);
  gulp.watch(app.html.dist, ['rev:use']);
  gulp.watch(app.image.src, ['min:img']);
});

// 打包文件
gulp.task('build', $.series('copy', 'min:use', ['rev:use', 'min:img'], 'watch'));
gulp.task('rebuild', $.series('clean', 'copy', 'min:use', ['rev:use', 'min:img']));
gulp.task('default', $.series('copy', 'min:use', ['rev:use', 'min:img']));
