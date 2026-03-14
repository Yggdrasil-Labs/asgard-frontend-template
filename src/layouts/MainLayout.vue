<script setup lang="ts">
import type { Locale } from '@locales/types'
import { useI18nHelper } from '@/composables/useI18n'

const {
  currentLocale,
  switchLocale,
  getLocaleDisplayName,
  supportedLocales,
} = useI18nHelper()

function handleLanguageChange(locale: Locale) {
  if (locale !== currentLocale.value)
    switchLocale(locale)
}

interface NavItem {
  path: string
  title: string
}

const navItems: NavItem[] = [
  { path: '/', title: '首页' },
  { path: '/pro-form-demo', title: 'ProForm 示例' },
]

const route = useRoute()
const router = useRouter()

function handleNavCommand(path: string) {
  if (path !== route.path)
    router.push(path)
}
</script>

<template>
  <div class="main-layout">
    <header class="layout-nav">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          <h1>Asgard Frontend Template</h1>
        </router-link>
        <div class="nav-actions">
          <el-dropdown trigger="click" @command="handleNavCommand">
            <el-button type="primary" link>
              页面
              <span class="nav-arrow">▼</span>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in navItems"
                  :key="item.path"
                  :command="item.path"
                >
                  {{ item.title }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown trigger="click" @command="handleLanguageChange">
            <el-button type="primary" link>
              {{ getLocaleDisplayName(currentLocale) }}
              <span class="nav-arrow">▼</span>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="locale in supportedLocales"
                  :key="locale"
                  :command="locale"
                >
                  {{ getLocaleDisplayName(locale) }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <main class="layout-main">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.main-layout {
  --nav-height: 4rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  min-height: var(--nav-height);
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.nav-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  text-decoration: none;
  color: inherit;

  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-arrow {
  margin-left: 0.25rem;
  font-size: 0.6em;
  opacity: 0.8;
}

.layout-main {
  flex: 1;
  padding-top: var(--nav-height);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
}
</style>
