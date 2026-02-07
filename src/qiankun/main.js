/**
 * qiankun 主应用启动逻辑
 *
 * 本文件实现主应用的子应用注册和启动流程
 */

import { registerMicroApps, start } from 'qiankun'
import apps from '@/config/apps'
import qiankunConfig from '@/config/qiankun'

/**
 * 创建事件总线
 * 用于主应用和子应用之间的通信
 */
function createEventBus() {
  const listeners = {}

  return {
    /**
     * 订阅事件
     * @param {string} event - 事件名称
     * @param {Function} handler - 事件处理函数
     */
    on(event, handler) {
      if (!listeners[event]) {
        listeners[event] = []
      }
      listeners[event].push(handler)
    },

    /**
     * 发送事件
     * @param {string} event - 事件名称
     * @param {*} data - 事件数据
     */
    emit(event, data) {
      if (listeners[event]) {
        listeners[event].forEach(handler => handler(data))
      }
    },

    /**
     * 取消订阅
     * @param {string} event - 事件名称
     * @param {Function} handler - 事件处理函数
     */
    off(event, handler) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(h => h !== handler)
      }
    },
  }
}

/**
 * 启动主应用
 * 注册子应用并启动 qiankun
 *
 * @param {object} [options] - 可选配置
 * @param {function(string, string, Error): void} [options.onError] - 子应用加载/运行错误回调 (appName, entry, error)
 */
export function startMainApp(options = {}) {
  const { onError } = options

  // 当前正在加载的子应用 (用于 errorHandler 中上报)
  let currentLoadingApp = null

  // 创建全局事件总线
  const eventBus = createEventBus()

  // 增强的全局错误处理: 详细日志 + 通知容器
  const originalErrorHandler = qiankunConfig.errorHandler
  const enhancedErrorHandler = (error) => {
    const appName = currentLoadingApp?.name ?? 'unknown'
    const entry = currentLoadingApp?.entry ?? ''

    if (originalErrorHandler) {
      originalErrorHandler(error)
    }
    console.error('[qiankun] 子应用异常:', {
      appName,
      entry,
      message: error?.message,
      stack: error?.stack,
    })
    try {
      window.dispatchEvent(
        new CustomEvent('qiankun-error', {
          detail: { appName, entry, error },
        }),
      )
    }
    catch { /* 忽略 dispatch 异常 */ }
    if (typeof onError === 'function') {
      onError(appName, entry, error)
    }
    currentLoadingApp = null
  }

  const runtimeConfig = {
    ...qiankunConfig,
    errorHandler: enhancedErrorHandler,
  }

  // 处理子应用配置,注入通信机制
  const appsWithProps = apps.map(app => ({
    ...app,
    props: {
      ...app.props,
      eventBus,
    },
  }))

  // 注册子应用
  registerMicroApps(appsWithProps, {
    beforeLoad: (app) => {
      currentLoadingApp = app
      return Promise.resolve()
    },
    afterMount: () => {
      currentLoadingApp = null
      return Promise.resolve()
    },
  })

  // 启动 qiankun
  start(runtimeConfig)
}
