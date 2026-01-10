import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    VueRouter({
      dts: 'src/types/typed-router.d.ts',
    }),
    vue(),
    Components({
      dts: 'src/types/components.d.ts',
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-i18n',
        'vue-router',
        'pinia',
        '@vueuse/core',
        VueRouterAutoImports,
      ],
      dts: 'src/types/auto-imports.d.ts',
      vueTemplate: true,
    }),
  ],
  test: {
    // Vitest 主要用于类型检查和工具能力，不运行测试
    // 实际测试使用 Playwright E2E 测试
    include: [],
    exclude: ['**/*'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@scss/base/variables" as *; @use "@scss/base/mixins" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@locales': path.resolve(__dirname, './src/locales'),
      '@scss': path.resolve(__dirname, './src/assets/scss'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
})
