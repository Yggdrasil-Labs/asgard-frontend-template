<script setup>
import { useRouter } from 'vue-router'
import apps from '@/config/apps'
import env from '@/config/env'
import { getAppMode, getAppName, isMainApp, isMicroApp, isQiankunEnv } from '@/utils/qiankun'

// VueUse 功能
const { width, height } = useWindowSize()
const { x, y } = useMouse()
const isDark = useDark()

// 应用模式信息
const isMain = isMainApp()
const isMicro = isMicroApp()
const appMode = getAppMode()
const appName = getAppName()
const inQiankun = isQiankunEnv()
const router = useRouter()

/**
 * 当前角色标签
 */
const roleLabel = computed(() => {
  if (isMain)
    return '主应用'
  if (isMicro)
    return `子应用 · ${appName || appMode}`
  return '独立应用'
})

/**
 * 当前角色描述
 */
const roleDescription = computed(() => {
  if (isMain)
    return '微前端容器,管理和加载子应用'
  if (isMicro && inQiankun)
    return '当前运行在 qiankun 容器中'
  if (isMicro)
    return '当前独立运行 (未嵌入主应用)'
  return '标准单体应用模式'
})

/**
 * 子应用列表 (仅主应用模式下使用)
 */
const microApps = computed(() => {
  return apps.map(app => ({
    name: app.name,
    title: app.title || app.name,
    path: app.activeRule,
  }))
})

/**
 * 导航到子应用
 */
function navigateToApp(path) {
  router.push(path)
}
</script>

<template>
  <div class="home-page" :class="{ 'is-micro': isMicro }">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <!-- 角色徽章 -->
          <div class="role-badge">
            <span class="role-dot" />
            <span>{{ roleLabel }}</span>
          </div>

          <h1 class="hero-title">
            <span class="hero-subtitle-small">欢迎来到</span>
            <span class="gradient-text">Asgard Frontend</span>
          </h1>
          <p class="hero-subtitle">
            {{ roleDescription }}
          </p>

          <!-- 模式信息 -->
          <div class="mode-info">
            <span class="mode-tag">
              VITE_APP_MODE = {{ appMode }}
            </span>
            <span v-if="inQiankun" class="mode-tag qiankun">
              qiankun
            </span>
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

    <!-- 子应用入口卡片 (仅主应用模式) -->
    <section v-if="isMain && microApps.length" class="apps-section">
      <div class="container">
        <div class="section-header">
          <h2>子应用列表</h2>
          <p>点击下方卡片进入对应的子应用</p>
        </div>
        <div class="apps-grid">
          <div
            v-for="app in microApps"
            :key="app.name"
            class="app-entry-card"
            @click="navigateToApp(app.path)"
          >
            <div class="app-entry-icon">
              📦
            </div>
            <h3>{{ app.title }}</h3>
            <p class="app-entry-path">
              {{ app.path }}
            </p>
            <span class="app-entry-arrow">→</span>
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
                <span class="env-key">应用角色</span>
                <span class="env-value">
                  <strong>{{ roleLabel }}</strong>
                </span>
              </div>
              <div class="env-row">
                <span class="env-key">VITE_APP_MODE</span>
                <span class="env-value">{{ appMode }}</span>
              </div>
              <div class="env-row">
                <span class="env-key">qiankun 环境</span>
                <span class="env-value" :class="{ success: inQiankun }">
                  {{ inQiankun ? '是' : '否' }}
                </span>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
/* ========== 主题色: 主应用紫色渐变, 子应用青绿渐变 ========== */
.home-page {
  --theme-from: #667eea;
  --theme-to: #764ba2;
  --accent-from: #fbbf24;
  --accent-to: #f59e0b;

  min-height: 100vh;
  background: linear-gradient(135deg, var(--theme-from) 0%, var(--theme-to) 100%);
  position: relative;
  overflow-x: hidden;
}

.home-page.is-micro {
  --theme-from: #0ea5e9;
  --theme-to: #06b6d4;
  --accent-from: #a78bfa;
  --accent-to: #7c3aed;
}

/* ========== 角色徽章 ========== */
.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  letter-spacing: 0.02em;
}

.role-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 6px #4ade80;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* ========== 模式信息标签 ========== */
.mode-info {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.mode-tag {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  font-size: 0.75rem;
  font-family: 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.03em;
}

.mode-tag.qiankun {
  background: rgba(74, 222, 128, 0.25);
  color: #bbf7d0;
}

/* ========== Hero 区域 ========== */
.hero-section {
  padding: 6rem 2rem;
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
  margin-bottom: 1rem;
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
  background: linear-gradient(135deg, var(--accent-from) 0%, var(--accent-to) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.15rem;
  opacity: 0.85;
  margin-bottom: 0;
  line-height: 1.6;
  text-align: center;
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

/* ========== 子应用入口卡片 ========== */
.apps-section {
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
  color: white;
}

.section-header h2 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  font-weight: 700;
}

.section-header p {
  margin: 0;
  opacity: 0.8;
  font-size: 1rem;
}

.apps-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.app-entry-card {
  position: relative;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.app-entry-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.app-entry-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.app-entry-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.app-entry-path {
  margin: 0;
  opacity: 0.6;
  font-size: 0.85rem;
  font-family: 'Courier New', monospace;
}

.app-entry-arrow {
  position: absolute;
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  font-size: 1.5rem;
  opacity: 0;
  transition: all 0.3s;
}

.app-entry-card:hover .app-entry-arrow {
  opacity: 0.8;
  right: 1.25rem;
}

/* ========== 功能演示区域 ========== */
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
  background: linear-gradient(135deg, var(--theme-from) 0%, var(--theme-to) 100%);
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
  background: linear-gradient(135deg, var(--theme-from) 0%, var(--theme-to) 100%);
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

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 2rem;
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

  .demo-grid {
    grid-template-columns: 1fr;
  }

  .env-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .apps-grid {
    grid-template-columns: 1fr;
  }

  .role-badge {
    font-size: 0.75rem;
  }

  .mode-info {
    justify-content: center;
  }
}
</style>
