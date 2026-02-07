<script setup>
import { useI18nHelper } from '@/composables/useI18n'

const {
  currentLocale,
  switchLocale,
  getLocaleDisplayName,
  supportedLocales,
} = useI18nHelper()

function handleCommand(locale) {
  if (locale !== currentLocale.value) {
    switchLocale(locale)
  }
}
</script>

<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <el-button class="language-switcher-btn" size="default">
      <el-icon>
        <i-ep-flag />
      </el-icon>
      <span class="language-switcher-label">{{ getLocaleDisplayName(currentLocale) }}</span>
      <el-icon class="el-icon--right">
        <i-ep-arrow-down />
      </el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="locale in supportedLocales"
          :key="locale"
          :command="locale"
          :class="{ 'is-active': currentLocale === locale }"
        >
          {{ getLocaleDisplayName(locale) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.language-switcher-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.language-switcher-label {
  max-width: 4em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.el-icon--right {
  margin-left: 4px;
}

:deep(.el-dropdown-menu__item.is-active) {
  color: var(--el-color-primary);
  font-weight: 500;
}
</style>
