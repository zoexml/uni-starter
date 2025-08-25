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

// TODO: 待优化自动更新iconfront
// module.exports = {
//   iconfontUrl: '//at.alicdn.com/t/c/font_4227835_d6w9wq4r0y.js', // 矢量图标库Symbol地址
//   dirName: 'iconfont', // 需要生成的css对应文件夹
//   fileName: 'color-fonts', // css文件名称
//   icon: 'iconfont', // Font Family
//   fontSize: '16px', // 默认大小
// }
