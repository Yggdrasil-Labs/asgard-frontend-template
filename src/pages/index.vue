<script setup lang="ts">
import { useRouter } from 'vue-router'
import env from '@/config/env'
import { useUserStore } from '@/stores'

const router = useRouter()

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

// 跳转到登录页面
function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h1>Asgard Frontend</h1>
        </div>
        <div class="nav-actions">
          <LanguageSwitcher />
          <div v-if="userStore.isLoggedIn" class="user-info">
            <span class="user-name">{{ userStore.displayName }}</span>
            <button class="logout-btn" @click="handleLogout">
              登出
            </button>
          </div>
          <button v-else class="login-btn" @click="goToLogin">
            登录
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            欢迎来到
            <span class="gradient-text">Asgard Frontend</span>
          </h1>
          <p class="hero-subtitle">
            基于 Vue 3 + TypeScript + Vite 的现代化前端模板
          </p>
          <div class="hero-buttons">
            <button v-if="!userStore.isLoggedIn" class="cta-button primary" @click="goToLogin">
              开始使用
            </button>
            <button class="cta-button secondary" @click="userStore.updateActivity()">
              更新活动
            </button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-card">
            <div class="card-icon">
              🚀
            </div>
            <h3>Vue 3</h3>
            <p>组合式 API</p>
          </div>
          <div class="floating-card">
            <div class="card-icon">
              ⚡
            </div>
            <h3>Vite</h3>
            <p>极速构建</p>
          </div>
          <div class="floating-card">
            <div class="card-icon">
              🍍
            </div>
            <h3>Pinia</h3>
            <p>状态管理</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能演示区域 -->
    <section class="features-section">
      <div class="container">
        <!-- Pinia Store 演示 -->
        <div class="feature-card">
          <div class="card-header">
            <div class="card-icon">
              🍍
            </div>
            <h2>Pinia 状态管理</h2>
            <p>现代化的状态管理解决方案</p>
          </div>

          <div class="card-content">
            <div class="status-grid">
              <div class="status-item">
                <div class="status-label">
                  登录状态
                </div>
                <div class="status-value" :class="{ success: userStore.isLoggedIn, error: !userStore.isLoggedIn }">
                  {{ userStore.isLoggedIn ? '已登录' : '未登录' }}
                </div>
              </div>
              <div class="status-item">
                <div class="status-label">
                  用户名
                </div>
                <div class="status-value">
                  {{ userStore.displayName }}
                </div>
              </div>
              <div class="status-item">
                <div class="status-label">
                  会话时长
                </div>
                <div class="status-value">
                  {{ userStore.sessionDuration }} 分钟
                </div>
              </div>
              <div class="status-item">
                <div class="status-label">
                  活动状态
                </div>
                <div class="status-value" :class="{ warning: userStore.isInactive }">
                  {{ userStore.isInactive ? '长时间未活动' : '活跃' }}
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <button
                :disabled="userStore.loading || userStore.isLoggedIn"
                class="action-btn primary"
                @click="handleLogin"
              >
                <span v-if="userStore.loading" class="loading-spinner" />
                {{ userStore.loading ? '登录中...' : '模拟登录' }}
              </button>
              <button
                :disabled="userStore.loading || !userStore.isLoggedIn"
                class="action-btn danger"
                @click="handleLogout"
              >
                登出
              </button>
            </div>
          </div>
        </div>

        <!-- VueUse 功能演示 -->
        <div class="feature-card">
          <div class="card-header">
            <div class="card-icon">
              🔧
            </div>
            <h2>VueUse 工具集</h2>
            <p>Vue 组合式 API 工具库</p>
          </div>

          <div class="card-content">
            <div class="demo-grid">
              <div class="demo-item">
                <div class="demo-icon">
                  📱
                </div>
                <div class="demo-content">
                  <h4>窗口尺寸</h4>
                  <p>{{ width }} × {{ height }}</p>
                </div>
              </div>
              <div class="demo-item">
                <div class="demo-icon">
                  🖱️
                </div>
                <div class="demo-content">
                  <h4>鼠标位置</h4>
                  <p>({{ x }}, {{ y }})</p>
                </div>
              </div>
              <div class="demo-item">
                <div class="demo-icon">
                  🌙
                </div>
                <div class="demo-content">
                  <h4>深色模式</h4>
                  <p>{{ isDark ? '开启' : '关闭' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 环境信息 -->
        <div class="feature-card">
          <div class="card-header">
            <div class="card-icon">
              ⚙️
            </div>
            <h2>环境信息</h2>
            <p>当前运行环境配置</p>
          </div>

          <div class="card-content">
            <div class="env-table">
              <div class="env-row">
                <span class="env-key">运行模式</span>
                <span class="env-value">{{ env.MODE }}</span>
              </div>
              <div class="env-row">
                <span class="env-key">应用环境</span>
                <span class="env-value">{{ env.APP_ENV }}</span>
              </div>
              <div class="env-row">
                <span class="env-key">应用名称</span>
                <span class="env-value">{{ env.APP_NAME }}</span>
              </div>
              <div class="env-row">
                <span class="env-key">应用版本</span>
                <span class="env-value">{{ env.APP_VERSION }}</span>
              </div>
              <div class="env-row">
                <span class="env-key">API 地址</span>
                <span class="env-value">{{ env.API_BASE_URL }}</span>
              </div>
              <div class="env-row">
                <span class="env-key">开发模式</span>
                <span class="env-value" :class="{ success: env.isDev }">
                  {{ env.isDev ? '是' : '否' }}
                </span>
              </div>
              <div class="env-row">
                <span class="env-key">生产模式</span>
                <span class="env-value" :class="{ success: env.isProd }">
                  {{ env.isProd ? '是' : '否' }}
                </span>
              </div>
              <div class="env-row">
                <span class="env-key">测试模式</span>
                <span class="env-value" :class="{ success: env.isTest }">
                  {{ env.isTest ? '是' : '否' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
}

// 导航栏
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-name {
  font-weight: 500;
  color: #374151;
}

.login-btn,
.logout-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}

.logout-btn {
  background: #ef4444;
  color: white;

  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
  }
}

// Hero 区域
.hero-section {
  padding: 8rem 2rem 4rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-text {
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-button.primary {
  background: white;
  color: #667eea;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
}

.cta-button.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
}

// Hero 视觉元素
.hero-visual {
  position: relative;
  height: 400px;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  color: white;
  animation: float 6s ease-in-out infinite;

  &:nth-child(1) {
    top: 0;
    left: 0;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    animation-delay: 2s;
  }

  &:nth-child(3) {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 4s;
  }
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.floating-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.floating-card p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

// 功能演示区域
.features-section {
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 2rem;
}

.feature-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }
}

.card-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.card-header h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.card-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.card-content {
  padding: 2rem;
}

// 状态网格
.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.status-item {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.status-label {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.status-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;

  &.success {
    color: #059669;
  }

  &.error {
    color: #dc2626;
  }

  &.warning {
    color: #d97706;
  }
}

// 操作按钮
.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  }

  &.danger {
    background: #ef4444;
    color: white;

    &:hover:not(:disabled) {
      background: #dc2626;
      transform: translateY(-1px);
    }
  }
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// VueUse 演示
.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.demo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.demo-icon {
  font-size: 1.5rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.demo-content h4 {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

.demo-content p {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
  font-family: 'Courier New', monospace;
}

// 环境信息表格
.env-table {
  display: grid;
  gap: 0.5rem;
}

.env-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  align-items: center;
}

.env-key {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.env-value {
  color: #6b7280;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;

  &.success {
    color: #059669;
    font-weight: 500;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-visual {
    height: 300px;
  }

  .floating-card {
    padding: 1rem;

    &:nth-child(1) {
      top: 20px;
      left: 20px;
    }

    &:nth-child(2) {
      top: 50%;
      right: 20px;
    }

    &:nth-child(3) {
      bottom: 20px;
      left: 50%;
    }
  }

  .nav-container {
    padding: 0 1rem;
  }

  .nav-brand h1 {
    font-size: 1.25rem;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }

  .env-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
