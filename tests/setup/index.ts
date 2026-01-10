// 测试环境设置索引文件
export * from './e2e'

export type TestEnvironment = 'e2e'

export const testEnvironments = {
  e2e: {
    name: '端到端测试',
    description: '测试完整的用户流程和应用程序行为',
    configFile: './playwright.config.ts',
    setupFile: './tests/setup/e2e.ts',
    timeout: 60000,
    parallel: false,
  },
} as const

export function getTestEnvironmentConfig(env: TestEnvironment) {
  return testEnvironments[env]
}
