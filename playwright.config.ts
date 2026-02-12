import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright 配置文件
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 测试目录
  testDir: './tests/e2e/specs',

  // 全局测试超时时间（30秒）
  timeout: 30 * 1000,

  // 每个测试的超时时间（10秒）
  expect: {
    timeout: 10 * 1000,
  },

  // 失败时重试次数
  retries: process.env.CI ? 2 : 0,

  // 并行运行的工作进程数
  workers: process.env.CI ? 1 : undefined,

  // 报告器配置
  reporter: [
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never',
    }],
    ['json', {
      outputFile: 'test-results/results.json',
    }],
    ['junit', {
      outputFile: 'test-results/results.xml',
    }],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  // 全局测试配置
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    extraHTTPHeaders: {
      'X-E2E-Test': 'true',
    },
  },

  // 项目配置
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
      },
    },
  ],

  // Web 服务器配置
  webServer: {
    command: process.env.CI ? 'pnpm preview' : 'pnpm dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: process.env.CI ? 'pipe' : 'ignore',
    stderr: process.env.CI ? 'pipe' : 'ignore',
    env: {
      NODE_ENV: 'test',
    },
  },
})
