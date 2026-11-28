import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vitest/config'
import { VueRouterAutoImports } from 'vue-router/unplugin'

export default defineConfig({
  plugins: [
    vue(),
    Icons(),
    Components({
      dts: false,
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
      dts: false,
      vueTemplate: true,
    }),
  ],
  test: {
    // 限制本地和 CI 同时转换 Element Plus 模块的数量。
    maxWorkers: 4,
    // 经 Vite 处理 async-validator 的 CJS default，保证 ElFormItem 执行真实校验。
    server: {
      deps: {
        inline: ['element-plus', 'async-validator'],
      },
    },
    // 默认仍以 Playwright E2E 为主；仅开启 unit spec 以支持局部验证
    include: ['tests/unit/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.{git,cache,output,temp}/**'],
    setupFiles: ['tests/setup/vitest-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx,vue}'],
      exclude: ['src/**/*.d.ts'],
      thresholds: {
        lines: 31,
        branches: 28,
        functions: 24,
      },
    },
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
      '@': path.resolve(import.meta.dirname, './src'),
      '@components': path.resolve(import.meta.dirname, './src/components'),
      '@locales': path.resolve(import.meta.dirname, './src/locales'),
      '@scss': path.resolve(import.meta.dirname, './src/assets/scss'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
})
