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
      // unplugin-auto-import 自动导入 - Vue 3 核心 API
      ref: 'readonly',
      reactive: 'readonly',
      computed: 'readonly',
      watch: 'readonly',
      watchEffect: 'readonly',
      onMounted: 'readonly',
      onUnmounted: 'readonly',
      onBeforeMount: 'readonly',
      onBeforeUnmount: 'readonly',
      onUpdated: 'readonly',
      onBeforeUpdate: 'readonly',
      nextTick: 'readonly',
      defineProps: 'readonly',
      defineEmits: 'readonly',
      defineExpose: 'readonly',
      withDefaults: 'readonly',
      // Vue Router
      useRouter: 'readonly',
      useRoute: 'readonly',
      // VueUse
      onClickOutside: 'readonly',
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
    'jsdoc/require-returns-description': 'off',
  },
})
