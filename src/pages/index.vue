<script setup lang="ts">
import type { SemanticIconName } from '@components/icon/icon.types'
import env from '@/config/env'
import { showSuccess } from '@/utils/message'

const { width, height } = useWindowSize()
const { x, y } = useMouse()
const isDark = useDark()

const techStack: { icon: SemanticIconName, name: string, desc: string }[] = [
  { icon: 'tech-vue', name: 'Vue 3', desc: '组合式 API' },
  { icon: 'tech-vite', name: 'Vite', desc: '极速构建' },
  { icon: 'tech-router', name: 'Vue Router', desc: '路由管理' },
  { icon: 'tech-pinia', name: 'Pinia', desc: '状态管理' },
  { icon: 'tech-i18n', name: 'Vue I18n', desc: '国际化支持' },
  { icon: 'tech-tools', name: 'VueUse', desc: '组合式工具集' },
]

interface EnvItem {
  label: string
  value: string
  success?: boolean
}

const envItems: EnvItem[] = [
  { label: '运行模式', value: env.MODE },
  { label: '应用环境', value: env.APP_ENV },
  { label: '应用名称', value: env.APP_NAME },
  { label: '应用版本', value: env.APP_VERSION },
  { label: 'API 地址', value: env.API_BASE_URL },
  { label: '开发模式', value: env.isDev ? '是' : '否', success: env.isDev },
  { label: '生产模式', value: env.isProd ? '是' : '否', success: env.isProd },
  { label: '测试模式', value: env.isTest ? '是' : '否', success: env.isTest },
]

function handleDemoClick() {
  showSuccess('Element Plus 与 AppIcon 运行正常')
}
</script>

<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hero-subtitle-small">面向通用场景的</span>
          <span class="gradient-text">Vue 3 模板工程</span>
        </h1>
        <p class="hero-subtitle">
          仅保留基础能力，不预置登录与用户业务。
        </p>
        <p class="hero-demo">
          <el-button type="primary" @click="handleDemoClick">
            <AppIcon name="success" class="hero-demo-icon" />
            Element Plus 已就绪
          </el-button>
        </p>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <el-card class="feature-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <AppIcon name="success" class="card-header-icon" />
              <div>
                <h2>技术栈基线</h2>
                <p>可直接扩展到你的业务项目</p>
              </div>
            </div>
          </template>
          <div class="tech-grid">
            <div v-for="item in techStack" :key="item.name" class="tech-item">
              <div class="tech-icon">
                <AppIcon :name="item.icon" />
              </div>
              <div class="tech-text">
                <h4>{{ item.name }}</h4>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="feature-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <AppIcon name="refresh" class="card-header-icon" />
              <div>
                <h2>运行时演示</h2>
                <p>VueUse 响应式能力示例</p>
              </div>
            </div>
          </template>
          <div class="demo-grid">
            <div class="demo-item">
              <AppIcon name="info" class="demo-item-icon" />
              <div class="demo-content">
                <h4>窗口尺寸</h4>
                <p>{{ width }} × {{ height }}</p>
              </div>
            </div>
            <div class="demo-item">
              <AppIcon name="info" class="demo-item-icon" />
              <div class="demo-content">
                <h4>鼠标位置</h4>
                <p>({{ x }}, {{ y }})</p>
              </div>
            </div>
            <div class="demo-item">
              <AppIcon name="info" class="demo-item-icon" />
              <div class="demo-content">
                <h4>深色模式</h4>
                <p>{{ isDark ? '开启' : '关闭' }}</p>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="feature-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <AppIcon name="info" class="card-header-icon" />
              <div>
                <h2>环境信息</h2>
                <p>当前运行环境配置</p>
              </div>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item
              v-for="item in envItems"
              :key="item.label"
              :label="item.label"
            >
              <span :class="{ 'env-value-success': item.success }">{{ item.value }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-x: hidden;
}

.hero-section {
  padding: 3rem 2rem 3rem;
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

.hero-demo {
  margin-top: 1rem;

  .hero-demo-icon {
    margin-right: 0.25rem;
    vertical-align: middle;
  }
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
  border-radius: 16px;
  overflow: hidden;

  :deep(.el-card__header) {
    padding: 2rem 2rem 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: none;
  }

  :deep(.el-card__body) {
    padding: 2rem;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: left;
}

.card-header-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.card-header h2 {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
}

.card-header p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
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

.tech-icon {
  font-size: 1.6rem;
}

.demo-item-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
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

.env-value-success {
  color: var(--el-color-success);
  font-weight: 600;
}

@media (max-width: 768px) {
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
