export default {
  url: 'font_2454091_aifkj7fl9mc', // iconfont 文件名（不带后缀）
  // symbol: true, // 启用 symbol 模式，默认开启
  // css: true, // 启用 css 模式，默认开启
  inject: false, // 是否自动注入到 index.html
  distPath: './src/styles/iconfont', // 构建产物输出目录（相对 assetsDir）
  // iconJson: './src/styles/iconfont/iconfont.json', // 生成图标 JSON（可指定路径）
  filenames: {
    css: 'fonts.scss',
    js: 'fonts.js',
    // json: 'iconfont.json',
  },
}
