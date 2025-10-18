<script setup lang="ts">
import env from '@/config/env'

const { width, height } = useWindowSize()
const { x, y } = useMouse()
const isDark = useDark()
</script>

<template>
  <div class="home-page">
    <LanguageSwitcher />

    <div class="hero-section">
      <HelloWorld msg="Vite + Vue + Sass" />
    </div>

    <div class="env-info">
      <h2 class="info-title">
        VueUse 功能演示
      </h2>
      <div class="vueuse-demo">
        <div class="demo-grid">
          <div class="demo-item">
            <strong>窗口尺寸:</strong> {{ width }} × {{ height }}
          </div>
          <div class="demo-item">
            <strong>鼠标位置:</strong> ({{ x }}, {{ y }})
          </div>
          <div class="demo-item">
            <strong>深色模式:</strong> {{ isDark ? '开启' : '关闭' }}
          </div>
        </div>
      </div>

      <h2 class="info-title">
        环境信息
      </h2>
      <div class="info-table">
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>mode</td>
              <td>{{ env.MODE }}</td>
            </tr>
            <tr>
              <td>appEnv</td>
              <td>{{ env.APP_ENV }}</td>
            </tr>
            <tr>
              <td>appName</td>
              <td>{{ env.APP_NAME }}</td>
            </tr>
            <tr>
              <td>appVersion</td>
              <td>{{ env.APP_VERSION }}</td>
            </tr>
            <tr>
              <td>apiBaseUrl</td>
              <td>{{ env.API_BASE_URL }}</td>
            </tr>
            <tr>
              <td>isDev</td>
              <td>{{ env.isDev }}</td>
            </tr>
            <tr>
              <td>isProd</td>
              <td>{{ env.isProd }}</td>
            </tr>
            <tr>
              <td>isTest</td>
              <td>{{ env.isTest }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, get-color(gray-50), get-color(white));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: spacing(4);
}

.hero-section {
  @include flex-center;
  @include flex-column;
  padding: spacing(12) spacing(4);
  text-align: center;
  width: 100%;
  max-width: 1200px;
}

.env-info {
  max-width: 800px;
  width: 100%;
  margin: spacing(12) auto;
  padding: spacing(8);
  background: get-color(white);
  border-radius: border-radius(xl);
  box-shadow: shadow(md);
}

.info-title {
  font-size: font-size(2xl);
  font-weight: font-weight(semibold);
  color: get-color(gray-800);
  margin-bottom: spacing(6);
  text-align: center;
}

.vueuse-demo {
  margin-bottom: spacing(8);
  padding: spacing(6);
  background: get-color(gray-50);
  border-radius: border-radius(lg);
  border: 1px solid get-color(gray-200);

  h3 {
    font-size: font-size(lg);
    font-weight: font-weight(semibold);
    color: get-color(gray-700);
    margin-bottom: spacing(4);
    text-align: center;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: spacing(4);
  }

  .demo-item {
    padding: spacing(3);
    background: get-color(white);
    border-radius: border-radius(md);
    border: 1px solid get-color(gray-200);
    text-align: center;

    strong {
      color: get-color(gray-700);
      display: block;
      margin-bottom: spacing(2);
    }

    button {
      padding: spacing(2) spacing(4);
      background: get-color(blue-500);
      color: get-color(white);
      border: none;
      border-radius: border-radius(md);
      cursor: pointer;
      font-size: font-size(sm);
      transition: background-color 0.2s ease;

      &:hover:not(:disabled) {
        background: get-color(blue-600);
      }

      &:disabled {
        background: get-color(gray-400);
        cursor: not-allowed;
      }
    }
  }
}

.info-table {
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    border-radius: border-radius(lg);
    overflow: hidden;
    box-shadow: shadow(sm);
  }

  th {
    background: get-color(gray-800);
    color: get-color(white);
    font-weight: font-weight(semibold);
    padding: spacing(4);
    text-align: left;
  }

  td {
    padding: spacing(3) spacing(4);
    border-bottom: 1px solid get-color(gray-200);

    &:first-child {
      font-weight: font-weight(medium);
      color: get-color(gray-700);
    }

    &:last-child {
      color: get-color(gray-600);
      font-family: $font-family-mono;
    }
  }

  tr:hover {
    background: get-color(gray-50);
  }
}
</style>
