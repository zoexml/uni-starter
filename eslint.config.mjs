import uniHelper from '@uni-helper/eslint-config'

export default uniHelper({
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },
  unocss: true,
  lessOpinionated: true, // 允许使用箭头函数,不转换成funnction
  rules: {
    'no-console': 'off',
  },
  ignores: [
    '**/node_modules',
    'pnpm-lock.yaml',
    'src/uni_modules/**/*',
    '.hbuilderx/**/*',
    // ...globs
  ],
})
