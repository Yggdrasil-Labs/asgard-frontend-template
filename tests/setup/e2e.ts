/**
 * E2E 测试环境设置
 * 专门用于端到端测试的全局配置和环境设置
 */

import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'

// E2E 测试全局设置
beforeAll(async () => {
  // 启动测试服务器
  // 这里可以添加启动开发服务器或测试服务器的逻辑
  console.log('🚀 Starting E2E test environment...')
})

afterAll(async () => {
  // 清理测试服务器
  // 这里可以添加关闭服务器的逻辑
  console.log('🧹 Cleaning up E2E test environment...')
})

beforeEach(async () => {
  // 每个测试前的设置
  // 清理浏览器状态、重置数据库等
})

afterEach(async () => {
  // 每个测试后的清理
  // 清理浏览器状态、截图等
})

// E2E 测试专用配置
export const e2eConfig = {
  // 测试服务器配置
  server: {
    port: 3000,
    host: 'localhost',
    baseUrl: 'http://localhost:3000',
  },

  // 浏览器配置
  browser: {
    headless: true,
    slowMo: 0,
    devtools: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
  },

  // 测试超时配置
  timeouts: {
    navigation: 30000,
    action: 10000,
    assertion: 5000,
  },

  // 截图配置
  screenshots: {
    enabled: true,
    path: './tests/screenshots',
    fullPage: true,
  },

  // 视频录制配置
  video: {
    enabled: false,
    path: './tests/videos',
  },
}

// 导出 E2E 测试工具函数
export const e2eUtils = {
  // 等待页面加载完成
  waitForPageLoad: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
  },

  // 等待元素可见
  waitForElement: async (selector: string, timeout = 10000) => {
    // 这里可以使用 Playwright 或 Cypress 的等待逻辑
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      const check = () => {
        const element = document.querySelector(selector)
        if (element) {
          resolve(element)
        }
        else if (Date.now() - startTime > timeout) {
          reject(new Error(`Element ${selector} not found within ${timeout}ms`))
        }
        else {
          setTimeout(check, 100)
        }
      }
      check()
    })
  },

  // 模拟用户输入
  typeText: async (selector: string, text: string) => {
    const element = document.querySelector(selector) as HTMLInputElement
    if (element) {
      element.value = text
      element.dispatchEvent(new Event('input', { bubbles: true }))
      element.dispatchEvent(new Event('change', { bubbles: true }))
    }
  },

  // 模拟点击
  clickElement: async (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      element.click()
    }
  },

  // 截图
  takeScreenshot: async (name: string) => {
    // 这里可以使用 Playwright 或 Cypress 的截图功能
    console.log(`📸 Taking screenshot: ${name}`)
  },
}
