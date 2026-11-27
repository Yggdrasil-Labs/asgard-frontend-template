// eslint.config.js
import antfu, { antislop } from '@antfu/eslint-config'

const sonar = await antislop({ slop: false, sonarjs: true, cognitiveComplexity: 15 })
// antfu's curated JS rules also apply to Vue script blocks via vue-eslint-parser.
const sonarRules = sonar.find(config => config.name === 'antfu/antislop/rules/javascript').rules

export default antfu({
  formatters: true,
  ignores: [
    '.github/**',
    '.vscode/**',
    'docs/**',
    '.cursor/**',
  ],
  languageOptions: {
    globals: {
      // Vite 构建时注入
      __APP_VERSION__: 'readonly',
      // unplugin-auto-import 自动导入（VueUse 等）
      useWindowSize: 'readonly',
      useMouse: 'readonly',
      useDark: 'readonly',
      useCounter: 'readonly',
      useLocalStorage: 'readonly',
      syncRef: 'readonly',
      useCycleList: 'readonly',
      useTitle: 'readonly',
      useSupported: 'readonly',
    },
  },
  rules: {
    'no-console': ['warn', {
      allow: ['warn', 'error'],
    }],
  },
  // 为测试文件添加特殊配置
  test: true,
  // 测试文件特殊规则
  testRules: {
    'no-console': 'off', // 测试文件中允许 console
    '@typescript-eslint/no-explicit-any': 'off', // 测试文件中允许 any
    'vue/multi-word-component-names': 'off', // 测试文件中允许单单词组件名
  },
}, ...sonar, { files: ['**/*.vue'], rules: sonarRules }, { files: ['tests/engineering/**/*.test.mjs'], rules: { 'test/no-import-node-test': 'off' } })
