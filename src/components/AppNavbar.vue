<script setup>
const router = useRouter()
const route = useRoute()

const navItems = [
  { path: '/', label: '首页' },
  { path: '/components-demo', label: '公共组件演示' },
]

const currentLabel = computed(() => {
  const item = navItems.find(i => i.path === route.path)
  return item?.label ?? '页面'
})

function handleSelect(path) {
  if (path !== route.path) {
    router.push(path)
  }
}
</script>

<template>
  <header class="app-navbar">
    <div class="app-navbar__inner">
      <RouterLink to="/" class="app-navbar__brand">
        Asgard Frontend
      </RouterLink>
      <div class="app-navbar__actions">
        <el-dropdown trigger="click" @command="handleSelect">
          <el-button class="app-navbar__menu-btn">
            {{ currentLabel }}
            <el-icon class="el-icon--right">
              <i-ep-arrow-down />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="/" :class="{ 'is-active': route.path === '/' }">
                <el-icon class="app-navbar__dropdown-icon">
                  <i-ep-house />
                </el-icon>
                <span>首页</span>
              </el-dropdown-item>
              <el-dropdown-item command="/components-demo" :class="{ 'is-active': route.path === '/components-demo' }">
                <el-icon class="app-navbar__dropdown-icon">
                  <i-ep-document />
                </el-icon>
                <span>公共组件演示</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <LanguageSwitcher />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
}

.app-navbar__inner {
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-navbar__brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-navbar__brand:hover {
  opacity: 0.9;
}

.app-navbar__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-navbar__menu-btn {
  display: inline-flex;
  align-items: center;
}

.el-icon--right {
  margin-left: 4px;
}

.app-navbar__dropdown-icon {
  margin-right: 8px;
  vertical-align: middle;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
}

:deep(.is-active) {
  color: var(--el-color-primary);
  font-weight: 500;
}
</style>
