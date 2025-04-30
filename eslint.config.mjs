import uniHelper from '@uni-helper/eslint-config'

export default uniHelper({
  lessOpinionated: true, // 允许使用箭头函数,不转换成funnction
  rules: {
    'no-console': 'off',
    'node/prefer-global/process': 'off', // process is not global in node
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }], // if-else 格式
  },
  ignores: ['**/node_modules', 'pnpm-lock.yaml'],
})
