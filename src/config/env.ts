/// <reference types="vite/client" />

/**
 * 环境变量封装模块
 * 统一从 import.meta.env 获取配置，并提供类型提示和验证
 */

// 构建/运行层面的模式
export type AppMode = 'development' | 'test' | 'production'
// 业务层面的环境标识
export type AppEnv = 'dev' | 'test' | 'prod'

// 扩展 Vite 的环境变量接口
declare global {
  interface ImportMetaEnv {
    readonly VITE_APP_NAME?: string
    readonly VITE_API_BASE_URL?: string
    readonly VITE_PORT?: string
  }
}

// 环境变量默认值配置
// 注意：API_BASE_URL 只到 origin（不含 /api），接口路径自带 /api 前缀。
// 生产环境不提供 API_BASE_URL 默认值：缺失时构建产物会在加载期抛错（fail-closed），
// 避免静默指向错误环境。
const ENV_DEFAULTS = {
  development: {
    API_BASE_URL: 'http://localhost:8080',
    APP_NAME: 'Asgard Frontend (Development)',
  },
  test: {
    API_BASE_URL: 'http://localhost:8080',
    APP_NAME: 'Asgard Frontend (Test)',
  },
  production: {
    API_BASE_URL: undefined,
    APP_NAME: 'Asgard Frontend',
  },
} as const

// 环境变量获取函数
// 值缺失时回退到默认值；连默认值都没有（如生产 API_BASE_URL）则抛错，fail-closed。
function resolveEnvVar(
  name: 'VITE_API_BASE_URL' | 'VITE_APP_NAME',
  value: string | undefined,
  fallback: string | undefined,
): string {
  const resolved = value?.trim() || fallback
  if (!resolved) {
    throw new Error(`[env] 缺少必需的环境变量 ${name}（当前 MODE=${import.meta.env.MODE}）`)
  }
  return resolved
}

// 获取当前模式（MODE 决定加载哪套配置）
const MODE = import.meta.env.MODE as AppMode

// 根据 MODE 获取对应的默认值配置
function getEnvDefaults(mode: AppMode) {
  const defaults = ENV_DEFAULTS[mode]
  if (!defaults) {
    throw new Error(`Unsupported MODE: ${mode}`)
  }
  return defaults
}

const envDefaults = getEnvDefaults(MODE)

// APP_ENV 是 MODE 的语义映射
const APP_ENV: AppEnv = {
  development: 'dev',
  test: 'test',
  production: 'prod',
}[MODE] as AppEnv

// 获取环境变量值（如果未设置则使用对应 MODE 的默认值）
const APP_NAME = resolveEnvVar(
  'VITE_APP_NAME',
  import.meta.env.VITE_APP_NAME,
  envDefaults.APP_NAME,
)

// 版本号来自构建时注入的常量 __APP_VERSION__
const APP_VERSION: string = __APP_VERSION__

const API_BASE_URL = resolveEnvVar(
  'VITE_API_BASE_URL',
  import.meta.env.VITE_API_BASE_URL,
  envDefaults.API_BASE_URL,
)

// 环境判断（PROD / DEV 决定代码行为，直接使用 Vite 提供的值）
export const isDev = import.meta.env.DEV
export const isProd = import.meta.env.PROD
export const isTest = import.meta.env.MODE === 'test'

// 环境配置对象
export const env = {
  MODE,
  APP_ENV,
  APP_NAME,
  APP_VERSION,
  API_BASE_URL,
  isDev,
  isProd,
  isTest,
} as const

// 向后兼容的导出
export const {
  MODE: mode,
  APP_ENV: appEnv,
  APP_NAME: appName,
  APP_VERSION: appVersion,
  API_BASE_URL: apiBaseUrl,
} = env

// 默认导出
export default env
