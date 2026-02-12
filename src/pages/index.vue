<script setup lang="ts">
import env from '@/config/env'

const { width, height } = useWindowSize()
const { x, y } = useMouse()
const isDark = useDark()

const techStack = [
  { icon: '🚀', name: 'Vue 3', desc: '组合式 API' },
  { icon: '⚡', name: 'Vite', desc: '极速构建' },
  { icon: '🛣️', name: 'Vue Router', desc: '路由管理' },
  { icon: '🍍', name: 'Pinia', desc: '状态管理' },
  { icon: '🌐', name: 'Vue I18n', desc: '国际化支持' },
  { icon: '🔧', name: 'VueUse', desc: '组合式工具集' },
]
</script>

<template>
  <div class="home-page">
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h1>Asgard Frontend Template</h1>
        </div>
        <div class="nav-actions">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>

    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hero-subtitle-small">面向通用场景的</span>
          <span class="gradient-text">Vue 3 模板工程</span>
        </h1>
        <p class="hero-subtitle">
          仅保留基础能力，不预置登录与用户业务。
        </p>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <div class="feature-card">
          <div class="card-header">
            <div class="card-icon">
              🧱
            </div>
            <h2>技术栈基线</h2>
            <p>可直接扩展到你的业务项目</p>
          </div>
          <div class="card-content">
            <div class="tech-grid">
              <div v-for="item in techStack" :key="item.name" class="tech-item">
                <div class="tech-icon">
                  {{ item.icon }}
                </div>
                <div class="tech-text">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="feature-card">
          <div class="card-header">
            <div class="card-icon">
              🔧
            </div>
            <h2>运行时演示</h2>
            <p>VueUse 响应式能力示例</p>
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
  overflow-x: hidden;
}

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

.hero-section {
  padding: 9rem 2rem 3rem;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  color: white;
  text-align: center;
}

.hero-title {
  display: flex;
  flex-direction: column;
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 1.5rem;
}

.hero-subtitle-small {
  font-size: 2.2rem;
  font-weight: 400;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
}

.features-section {
  padding: 2rem;
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
}

.card-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-icon {
  font-size: 2.2rem;
  margin-bottom: 0.6rem;
}

.card-header h2 {
  margin: 0 0 0.4rem;
}

.card-header p {
  margin: 0;
  opacity: 0.9;
}

.card-content {
  padding: 2rem;
}

.tech-grid,
.demo-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.tech-item,
.demo-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  border-radius: 10px;
  background: #f8fafc;
}

.tech-icon,
.demo-icon {
  font-size: 1.6rem;
}

.tech-text h4,
.demo-content h4 {
  margin: 0;
  font-size: 1rem;
  color: #111827;
}

.tech-text p,
.demo-content p {
  margin: 0.2rem 0 0;
  color: #4b5563;
}

.env-table {
  display: grid;
  gap: 0.75rem;
}

.env-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: #f8fafc;
}

.env-key {
  color: #6b7280;
}

.env-value {
  color: #111827;
  font-weight: 600;
  word-break: break-all;
}

.env-value.success {
  color: #16a34a;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle-small {
    font-size: 1.5rem;
  }

  .features-section {
    padding: 1rem;
  }

  .card-content,
  .card-header {
    padding: 1.25rem;
  }
}
</style>
