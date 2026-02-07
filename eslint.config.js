// eslint.config.js
import antfu from '@antfu/eslint-config'

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
      // unplugin-vue-router 在页面中注入
      definePage: 'readonly',
      // unplugin-auto-import 自动导入（Vue）
      ref: 'readonly',
      computed: 'readonly',
      watch: 'readonly',
      watchEffect: 'readonly',
      onMounted: 'readonly',
      onUnmounted: 'readonly',
      nextTick: 'readonly',
      // unplugin-auto-import 自动导入（Vue Router）
      useRouter: 'readonly',
      useRoute: 'readonly',
      // unplugin-auto-import 自动导入（Pinia）
      defineStore: 'readonly',
      storeToRefs: 'readonly',
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
      allow: ['log', 'warn', 'error'],
    }],
  },
})
