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

interface StatItem {
  label: string
  value: string
  hint: string
  icon: SemanticIconName
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

const statItems: StatItem[] = [
  {
    label: '响应式信号',
    value: '3 组',
    hint: '窗口、鼠标、深色模式',
    icon: 'refresh',
  },
  {
    label: '技术栈基线',
    value: `${techStack.length} 项`,
    hint: 'Vue / Vite / Router / Pinia',
    icon: 'menu-dashboard',
  },
  {
    label: '环境变量',
    value: `${envItems.length} 项`,
    hint: '运行模式与 API 配置',
    icon: 'info',
  },
]

function handleDemoClick() {
  showSuccess('Element Plus 与 AppIcon 运行正常')
}
</script>

<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-shell">
        <div class="hero-content">
          <div class="hero-badge">
            <AppIcon name="menu-dashboard" class="hero-badge__icon" />
            控制台欢迎页
          </div>

          <h2 class="hero-title">
            <span class="hero-subtitle-small">面向通用场景的</span>
            <span class="gradient-text">Vue 3 模板工程</span>
          </h2>

          <p class="hero-subtitle">
            仅保留基础能力，不预置登录与用户业务。当前首页采用控制台式信息架构，方便直接挂接真实业务。
          </p>

          <div class="hero-actions">
            <el-button type="primary" @click="handleDemoClick">
              <AppIcon name="success" class="hero-demo-icon" />
              Element Plus 已就绪
            </el-button>
            <span class="hero-actions__hint">
              适配桌面与移动端，保留运行时可视化信息
            </span>
          </div>
        </div>

        <aside class="hero-panel">
          <div
            v-for="item in statItems"
            :key="item.label"
            class="hero-panel__item"
          >
            <div class="hero-panel__icon">
              <AppIcon :name="item.icon" />
            </div>
            <div class="hero-panel__text">
              <div class="hero-panel__label">
                {{ item.label }}
              </div>
              <strong class="hero-panel__value">
                {{ item.value }}
              </strong>
              <p class="hero-panel__hint">
                {{ item.hint }}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <el-card class="feature-card" shadow="never">
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
            <div
              v-for="item in techStack"
              :key="item.name"
              class="tech-item"
            >
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

        <div class="content-grid">
          <el-card class="feature-card" shadow="never">
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

          <el-card class="feature-card" shadow="never">
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
                <template #label>
                  <span class="env-key">{{ item.label }}</span>
                </template>

                <span :class="{ 'env-value-success': item.success }">{{ item.value }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  --home-border: var(--shell-border);
  --home-text: var(--shell-text);
  --home-text-muted: var(--shell-text-muted);
  --home-accent: var(--shell-accent);
  --home-accent-soft: var(--shell-accent-soft);

  display: grid;
  gap: var(--shell-page-section-gap);
  min-height: 100%;
  padding: var(--shell-space-4);
}

.hero-section {
  padding: 0;
}

.hero-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.8fr);
  gap: var(--shell-space-5);
}

.hero-content,
.hero-panel,
.feature-card {
  border: 1px solid var(--home-border);
  border-radius: 8px;
  background: var(--shell-surface-strong);
}

.hero-content {
  padding: clamp(1.25rem, 2.5vw, 2rem);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid rgba(79, 110, 247, 0.18);
  border-radius: 4px;
  background: var(--home-accent-soft);
  padding: 0.3rem 0.6rem;
  color: var(--shell-accent-strong);
  font-size: 0.78rem;
  font-weight: 600;
}

.hero-badge__icon {
  font-size: 0.9rem;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0.8rem 0 0.7rem;
  color: var(--home-text);
  font-size: clamp(1.6rem, 3.2vw, 2.4rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.hero-subtitle-small {
  color: var(--home-text-muted);
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  font-weight: 500;
}

.gradient-text {
  background: linear-gradient(135deg, #1a1f36 0%, #4f6ef7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  max-width: 56ch;
  margin: 0;
  color: var(--home-text-muted);
  font-size: 0.9rem;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
  margin-top: 1.2rem;
}

.hero-demo-icon {
  margin-right: 0.25rem;
  vertical-align: middle;
}

.hero-actions__hint {
  color: var(--home-text-muted);
  font-size: 0.8rem;
}

.hero-panel {
  display: grid;
  gap: 0.75rem;
  padding: 0.75rem;
}

.hero-panel__item {
  display: flex;
  gap: 0.7rem;
  border: 1px solid var(--home-border);
  border-radius: 6px;
  background: var(--shell-surface-strong);
  padding: 0.75rem;
}

.hero-panel__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 6px;
  background: var(--home-accent-soft);
  color: var(--shell-accent-strong);
}

// 差异化 stat panel 图标色
.hero-panel__item:nth-child(1) .hero-panel__icon {
  background: rgba(79, 110, 247, 0.1);
  color: #4f6ef7;
}

.hero-panel__item:nth-child(2) .hero-panel__icon {
  background: rgba(22, 163, 74, 0.1);
  color: #16a34a;
}

.hero-panel__item:nth-child(3) .hero-panel__icon {
  background: rgba(217, 119, 6, 0.1);
  color: #d97706;
}

.hero-panel__text {
  min-width: 0;
}

.hero-panel__label {
  color: var(--home-text-muted);
  font-size: 0.75rem;
  font-weight: 500;
}

.hero-panel__value {
  display: block;
  margin-top: 0.15rem;
  color: var(--home-text);
  font-size: 0.95rem;
  font-weight: 600;
}

.hero-panel__hint {
  margin: 0.15rem 0 0;
  color: var(--home-text-muted);
  font-size: 0.8rem;
  line-height: 1.5;
}

.features-section {
  padding: 0;
}

.container {
  display: grid;
  gap: var(--shell-space-5);
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(300px, 0.95fr);
  gap: var(--shell-space-5);
}

.feature-card :deep(.el-card__header) {
  border-bottom: 1px solid var(--home-border);
  background: var(--shell-surface-muted);
  padding: 0.9rem 1rem;
}

.feature-card :deep(.el-card__body) {
  padding: 1rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.card-header-icon {
  flex-shrink: 0;
  color: var(--home-accent);
  font-size: 1.1rem;
}

.card-header h2 {
  margin: 0 0 0.15rem;
  color: var(--home-text);
  font-size: 0.9rem;
  font-weight: 600;
}

.card-header p {
  margin: 0;
  color: var(--home-text-muted);
  font-size: 0.78rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.7rem;
}

.tech-item,
.demo-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  border: 1px solid var(--home-border);
  border-radius: 6px;
  background: var(--shell-surface-strong);
  padding: 0.7rem;
}

.tech-icon,
.demo-item-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 6px;
  background: var(--home-accent-soft);
  color: var(--shell-accent-strong);
  font-size: 0.9rem;
}

.tech-text,
.demo-content {
  min-width: 0;
}

.tech-text h4,
.demo-content h4 {
  margin: 0;
  color: var(--home-text);
  font-size: 0.85rem;
  font-weight: 600;
}

.tech-text p,
.demo-content p {
  margin: 0.1rem 0 0;
  color: var(--home-text-muted);
  font-size: 0.78rem;
  line-height: 1.5;
}

.demo-grid {
  display: grid;
  gap: 0.7rem;
}

.env-value-success {
  color: var(--shell-success);
  font-weight: 600;
}

@media (max-width: 1024px) {
  .hero-shell,
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: var(--shell-space-2);
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }
}
</style>
