<script setup>
import { useI18nHelper } from '@/composables/useI18n'

const {
  currentLocale,
  switchLocale,
  getLocaleDisplayName,
  supportedLocales,
} = useI18nHelper()

function handleLanguageChange(event) {
  const target = event.target
  const newLocale = target.value

  if (newLocale !== currentLocale.value) {
    switchLocale(newLocale)
    console.log(`Language changed to: ${newLocale}`)
  }
}
</script>

<template>
  <div class="language-switcher">
    <select
      :value="currentLocale"
      class="language-select"
      @change="handleLanguageChange"
    >
      <option
        v-for="locale in supportedLocales"
        :key="locale"
        :value="locale"
      >
        {{ getLocaleDisplayName(locale) }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.language-switcher {
  display: inline-block;
}

.language-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.language-select:hover {
  border-color: #9ca3af;
}

.language-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
