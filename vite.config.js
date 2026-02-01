import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, loadEnv } from 'vite'
import pkg from './package.json' with { type: 'json' }

export default defineConfig(({ mode, command }) => {
  const envVars = loadEnv(mode, '.', '')
  const isDev = command === 'serve'
  const isProd = command === 'build'

  return {
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
    server: {
      host: true,
      port: Number(envVars.VITE_PORT) || 5173,
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
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core', 'axios'],
      exclude: [],
    },
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  }
})
