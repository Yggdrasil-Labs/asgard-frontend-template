<script setup lang="ts">
import env from '@/config/env'
import { useUserStore } from '@/stores'

// VueUse 功能
const { width, height } = useWindowSize()
const { x, y } = useMouse()
const isDark = useDark()

// Pinia Stores
const userStore = useUserStore()

// 模拟登录功能
async function handleLogin() {
  const result = await userStore.login({
    username: 'demo',
    password: 'password',
    remember: true,
  })

  if (result.success) {
    console.log('登录成功:', result.data)
  }
  else {
    console.error('登录失败:', result.message)
  }
}

// 模拟登出功能
async function handleLogout() {
  const result = await userStore.logout()
  if (result.success) {
    console.log('登出成功')
  }
  else {
    console.error('登出失败:', result.message)
  }
}
</script>

<template>
  <div class="home-page">
    <LanguageSwitcher />

    <div class="hero-section">
      <HelloWorld msg="Vite + Vue + Pinia + Sass" />
    </div>

    <!-- Pinia Store 演示 -->
    <div class="pinia-demo">
      <h2 class="info-title">
        Pinia 状态管理演示
      </h2>

      <!-- 用户 Store -->
      <div class="store-section">
        <h3>用户管理 Store</h3>
        <div class="demo-grid">
          <div class="demo-item">
            <strong>登录状态:</strong> {{ userStore.isLoggedIn ? '已登录' : '未登录' }}
          </div>
          <div class="demo-item">
            <strong>用户名:</strong> {{ userStore.displayName }}
          </div>
          <div class="demo-item">
            <strong>会话时长:</strong> {{ userStore.sessionDuration }} 分钟
          </div>
          <div class="demo-item">
            <strong>是否长时间未活动:</strong> {{ userStore.isInactive ? '是' : '否' }}
          </div>
        </div>
        <div class="action-buttons">
          <button :disabled="userStore.loading || userStore.isLoggedIn" @click="handleLogin">
            模拟登录
          </button>
          <button :disabled="userStore.loading || !userStore.isLoggedIn" class="danger" @click="handleLogout">
            登出
          </button>
          <button @click="userStore.updateActivity()">
            更新活动时间
          </button>
        </div>
      </div>
    </div>

    <!-- VueUse 功能演示 -->
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

.pinia-demo {
  max-width: 1000px;
  width: 100%;
  margin: spacing(8) auto;
  padding: spacing(8);
  background: get-color(white);
  border-radius: border-radius(xl);
  box-shadow: shadow(md);
}

.env-info {
  max-width: 800px;
  width: 100%;
  margin: spacing(8) auto;
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

.store-section {
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
    margin-bottom: spacing(4);
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
  }

  .action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: spacing(2);
    justify-content: center;

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

      &.danger {
        background: get-color(red-500);

        &:hover:not(:disabled) {
          background: get-color(red-600);
        }
      }
    }
  }
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
