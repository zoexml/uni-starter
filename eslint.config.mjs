import uniHelper from '@uni-helper/eslint-config'

export default uniHelper({
  lessOpinionated: true, // 允许使用箭头函数,不转换成funnction
  // 代码风格配置
  stylistic: {
    arrowParens: 'always', // 箭头函数参数始终加括号，如 `(x) => x`
    bracketSpacing: true, // 对象字面量括号加空格，如 `{ foo: bar }`
    commaDangle: 'never', // 禁止尾随逗号
    jsx: true, // 支持 JSX 语法
    blockSpacing: true, // 代码块内加空格，如 `function foo() {}`
    multilineComments: true, // 多行注释风格
    preferArrowFunctions: true, // 优先使用箭头函数
    // spaceBeforeFunctionParen: "always", // 函数名和参数括号间加空格
    // spaceInParens: "never", // 括号内不加空格
    // spacesInAngles: true, // 尖括号内加空格
    // computedPropertySpacing: true, // 计算属性方括号内加空格
    // restSpreadSpacing: true, // Rest/Spread 操作符周围加空格
  },
  unocss: true,
  // formatters: true, // 使用外部格式化工具（如 Prettier）
  rules: {
    'no-console': 'off',
    'node/prefer-global/process': 'off', // process is not global in node
    'vue/attribute-hyphenation': 'off', // 属性允许使用驼峰命名
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }], // if-else 格式
    'curly': ['error', 'multi-line'], // 允许单行 if/else 无 {}
  },
  ignores: ['**/node_modules', 'pnpm-lock.yaml', 'src/styles/iconfont/*'],
})
