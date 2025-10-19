/**
 * 集成测试环境设置
 * 专门用于集成测试的全局配置和环境设置
 */

import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest'

// 集成测试全局设置
beforeAll(async () => {
  // 设置集成测试环境
  console.log('🔧 Setting up integration test environment...')

  // Mock 外部服务
  vi.mock('@/api/http', () => ({
    request: vi.fn(),
  }))
})

afterAll(async () => {
  // 清理集成测试环境
  console.log('🧹 Cleaning up integration test environment...')
})

beforeEach(async () => {
  // 每个测试前的设置
  // 重置 Mock 状态
  vi.clearAllMocks()
})

afterEach(async () => {
  // 每个测试后的清理
  // 恢复 Mock 状态
  vi.restoreAllMocks()
})

// 集成测试专用配置
export const integrationConfig = {
  // API Mock 配置
  api: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 10000,
    retries: 3,
  },

  // 测试超时配置
  timeouts: {
    api: 10000,
    ui: 15000,
  },
}

// 导出集成测试工具函数
export const integrationUtils = {
  // 创建测试用户
  createTestUser: (overrides = {}) => ({
    id: Math.floor(Math.random() * 1000),
    username: `testuser${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    ...overrides,
  }),

  // 等待 API 响应
  waitForApiResponse: async (mockFn: any, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      const check = () => {
        if (mockFn.mock.calls.length > 0) {
          resolve(mockFn.mock.calls[0])
        }
        else if (Date.now() - startTime > timeout) {
          reject(new Error('API call timeout'))
        }
        else {
          setTimeout(check, 100)
        }
      }
      check()
    })
  },

  // 模拟 API 响应
  mockApiResponse: (data: any, delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay)
    })
  },

  // 模拟 API 错误
  mockApiError: (error: any, delay = 0) => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(error), delay)
    })
  },
}
