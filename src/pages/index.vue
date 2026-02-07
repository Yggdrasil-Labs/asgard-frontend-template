<script setup>
import env from '@/config/env'

// VueUse 功能
const { width, height } = useWindowSize()
const { x, y } = useMouse()
const isDark = useDark()
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
          <RouterLink to="/components-demo" class="nav-link">
            公共组件演示
          </RouterLink>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>

    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="hero-subtitle-small">欢迎来到</span>
            <span class="gradient-text">Asgard Frontend</span>
          </h1>
          <p class="hero-subtitle">
            基于 Vue 3 + Vite + JavaScript 的现代化前端模板
          </p>
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
              🔧
            </div>
            <h3>VueUse</h3>
            <p>工具集</p>
          </div>
          <div class="floating-card">
            <div class="card-icon">
              🛣️
            </div>
            <h3>Router</h3>
            <p>路由管理</p>
          </div>
          <div class="floating-card">
            <div class="card-icon">
              🍍
            </div>
            <h3>Pinia</h3>
            <p>状态管理</p>
          </div>
          <div class="floating-card">
            <div class="card-icon">
              🌐
            </div>
            <h3>Vue-i18n</h3>
            <p>国际化</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能演示区域 -->
    <section class="features-section">
      <div class="container">
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

.nav-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.nav-link:hover {
  text-decoration: underline;
}

.hero-section {
  padding: 10rem 2rem 6rem;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.5;
  margin-bottom: 2rem;
  text-align: center;
}

.hero-subtitle-small {
  font-size: 2.5rem;
  font-weight: 400;
  opacity: 0.9;
  margin-bottom: 0.5rem;
  color: white;
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

.hero-visual {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;
  height: 300px;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.floating-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
  color: white;
  animation: float 6s ease-in-out infinite;
  width: 120px;
  height: 100px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
}

.floating-card:nth-child(1) {
  animation-delay: 0s;
}
.floating-card:nth-child(2) {
  animation-delay: 1s;
}
.floating-card:nth-child(3) {
  animation-delay: 2s;
}
.floating-card:nth-child(4) {
  animation-delay: 3s;
}
.floating-card:nth-child(5) {
  animation-delay: 4s;
}
.floating-card:nth-child(6) {
  animation-delay: 5s;
}

.card-icon {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.floating-card h3 {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.2;
}

.floating-card p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.7rem;
  line-height: 1.1;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

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
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-header .card-icon {
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
}

.env-value.success {
  color: #059669;
  font-weight: 500;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 8rem 2rem 4rem;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }

  .hero-subtitle-small {
    font-size: 1.2rem;
  }

  .hero-visual {
    height: 250px;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .floating-card {
    padding: 0.5rem;
    width: 80px;
    height: 70px;
  }

  .nav-container {
    padding: 0 1rem;
  }

  .nav-brand h1 {
    font-size: 1.25rem;
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
