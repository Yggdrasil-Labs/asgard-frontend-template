<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * qiankun 子应用容器组件
 *
 * 本组件作为子应用的挂载区域,提供:
 * - 子应用挂载容器
 * - 加载状态提示
 * - 错误处理 UI (含子应用名称、入口、堆栈)
 */

/**
 * 组件 Props
 */
const props = defineProps({
  /**
   * 容器 ID
   * @type {string}
   * @default 'subapp-viewport'
   */
  id: {
    type: String,
    default: 'subapp-viewport',
  },

  /**
   * 是否显示加载提示
   * @type {boolean}
   * @default true
   */
  showLoading: {
    type: Boolean,
    default: true,
  },
})

// 加载状态与错误信息 (含 appName、entry 便于定位)
const loading = ref(false)
const error = ref(null)
const errorDetail = ref({ appName: '', entry: '' })

/**
 * 处理子应用加载错误
 * @param {Error} err - 错误对象
 * @param {string} [appName] - 子应用名称
 * @param {string} [entry] - 子应用入口地址
 */
function handleError(err, appName = '', entry = '') {
  error.value = err
  errorDetail.value = { appName, entry }
  loading.value = false
}

function onQiankunError(event) {
  const { appName, entry, error: err } = event.detail || {}
  handleError(err, appName, entry)
}

onMounted(() => {
  window.addEventListener('qiankun-error', onQiankunError)
})

onBeforeUnmount(() => {
  window.removeEventListener('qiankun-error', onQiankunError)
})

function clearError() {
  error.value = null
  errorDetail.value = { appName: '', entry: '' }
  window.location.reload()
}

// 暴露给父组件
defineExpose({
  loading,
  error,
  errorDetail,
  handleError,
})
</script>

<template>
  <div class="qiankun-container">
    <!-- 子应用挂载容器 -->
    <div :id="props.id" class="subapp-viewport" />

    <!-- 加载提示 -->
    <div v-if="loading && showLoading" class="loading-overlay">
      <div class="loading-spinner" />
      <p class="loading-text">
        子应用加载中...
      </p>
    </div>

    <!-- 错误提示: 含子应用名称、入口、堆栈 -->
    <div v-if="error" class="error-overlay">
      <div class="error-icon">
        ⚠️
      </div>
      <p class="error-title">
        子应用加载失败
      </p>
      <p v-if="errorDetail.appName" class="error-meta">
        子应用: {{ errorDetail.appName }}
        <span v-if="errorDetail.entry"> · 入口: {{ errorDetail.entry }}</span>
      </p>
      <p class="error-message">
        {{ error?.message || '未知错误' }}
      </p>
      <pre v-if="error?.stack" class="error-stack">{{ error.stack }}</pre>
      <button class="error-retry" @click="clearError">
        重新加载
      </button>
    </div>
  </div>
</template>

<style scoped>
.qiankun-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.subapp-viewport {
  width: 100%;
  height: 100%;
}

/* 加载提示样式 */
.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #666;
  font-size: 14px;
}

/* 错误提示样式 */
.error-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 32px;
  max-width: 400px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-title {
  color: #f56c6c;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.error-meta {
  color: #606266;
  font-size: 13px;
  margin-bottom: 8px;
}

.error-message {
  color: #909399;
  font-size: 14px;
  margin-bottom: 12px;
  word-break: break-word;
}

.error-stack {
  text-align: left;
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  max-height: 120px;
  overflow: auto;
  margin-bottom: 24px;
}

.error-retry {
  padding: 8px 24px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.error-retry:hover {
  background-color: #66b1ff;
}

.error-retry:active {
  background-color: #3a8ee6;
}
</style>
