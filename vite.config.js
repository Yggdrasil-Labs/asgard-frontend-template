import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, loadEnv } from 'vite'
import qiankun from 'vite-plugin-qiankun-x'
import pkg from './package.json' with { type: 'json' }

export default defineConfig(({ mode, command }) => {
  const envVars = loadEnv(mode, '.', '')
  const isDev = command === 'serve'
  const isProd = command === 'build'

  // 获取应用模式
  // VITE_APP_MODE 可以是 'main'、'standalone' 或子应用标识 (如 'micro-app-1')
  // 非 main/standalone 的值均视为子应用模式
  const appMode = envVars.VITE_APP_MODE || 'standalone'
  const isMicroApp = appMode !== 'main' && appMode !== 'standalone'

  // 输出配置信息以便调试
  console.log('[vite.config] 构建配置:', {
    mode,
    command,
    appMode,
    isMicroApp,
    port: envVars.VITE_PORT,
  })

  // 基础配置
  const baseConfig = {
    plugins: [
      VueRouter({
        routesFolder: 'src/pages',
      }),
      vue({
        template: {
          compilerOptions: {
            comments: !isProd,
          },
        },
      }),
      Components({
        dirs: ['src/components'],
        resolvers: [],
        include: [/\.vue$/, /\.vue\?vue/],
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
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
        vueTemplate: true,
      }),
    ].filter(Boolean),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@scss/base/variables" as *; @use "@scss/base/mixins" as *;`,
          sourceMap: isDev,
        },
      },
      devSourcemap: isDev,
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
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core', 'axios'],
      exclude: [],
    },
  }

  // 子应用模式特殊配置
  if (isMicroApp) {
    // 子应用名称: 优先使用 VITE_APP_NAME,否则使用 VITE_APP_MODE 值
    const appName = envVars.VITE_APP_NAME || appMode || 'micro-app'

    return {
      ...baseConfig,
      base: envVars.VITE_APP_PUBLIC_PATH || '/',
      plugins: [
        ...baseConfig.plugins,
        // vite-plugin-qiankun-x: 零配置 qiankun 兼容
        // 开发模式: 自动将 ES Module 转换为 qiankun 可加载的格式
        // 构建模式: 保留 ESM 特性,无需 UMD
        qiankun(appName),
      ],
      server: {
        host: true,
        port: Number(envVars.VITE_PORT) || 5173,
        open: false,
        // 子应用必须配置 CORS
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        proxy: {
          '/api': {
            target: envVars.VITE_API_BASE_URL || 'http://localhost:8080',
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, ''),
            timeout: 10000,
          },
        },
        hmr: { overlay: true },
        watch: { usePolling: false, interval: 100 },
      },
      build: {
        target: 'esnext',
        outDir: 'dist',
        assetsDir: 'static',
        sourcemap: isDev,
        minify: isProd ? 'esbuild' : false,
        // 子应用不拆分 CSS,将所有样式打包在一起
        cssCodeSplit: false,
      },
    }
  }

  // 主应用和独立应用模式 (标准 SPA 配置)
  // 主应用默认 5174 便于与子应用 5173 联调; 独立应用默认 5173
  const defaultPort = appMode === 'main' ? 5174 : 5173
  return {
    ...baseConfig,
    server: {
      host: true,
      port: Number(envVars.VITE_PORT) || defaultPort,
      open: false,
      proxy: {
        '/api': {
          target: envVars.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          timeout: 10000,
        },
      },
      hmr: { overlay: true },
      watch: { usePolling: false, interval: 100 },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: isDev,
      minify: isProd ? 'esbuild' : false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router'],
            'ui-vendor': ['@vueuse/core'],
            'http-vendor': ['axios'],
            'i18n-vendor': ['vue-i18n'],
            'store-vendor': ['pinia', 'pinia-plugin-persistedstate'],
            'common': ['src/utils', 'src/composables'],
          },
        },
        external: [],
      },
    },
  }
})
