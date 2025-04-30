import uniHelper from '@uni-helper/eslint-config'

export default uniHelper({
  rules: {
    'no-console': 'off',
    'node/prefer-global/process': 'off', // process is not global in node
  },
  ignores: ['**/node_modules', 'pnpm-lock.yaml'],
})
