/**
 * 环境变量封装模块
 * 统一从 import.meta.env 获取配置
 */

const ENV_DEFAULTS = {
  development: {
    API_BASE_URL: 'http://localhost:8080/api',
    APP_NAME: 'Asgard Frontend (Development)',
  },
  test: {
    API_BASE_URL: 'https://test-api.yggdrasil-labs.com/api',
    APP_NAME: 'Asgard Frontend (Test)',
  },
  production: {
    API_BASE_URL: 'https://api.yggdrasil-labs.com/api',
    APP_NAME: 'Asgard Frontend (Production)',
  },
}

function validateEnvVar(value, fallback) {
  return value === undefined || value === '' ? fallback : value
}

const RAW_MODE = import.meta.env.MODE
const MODE = ENV_DEFAULTS[RAW_MODE] ? RAW_MODE : 'production'

function getEnvDefaults(mode) {
  const resolved = ENV_DEFAULTS[mode] ? mode : 'production'
  const defaults = ENV_DEFAULTS[resolved]
  if (!defaults) {
    throw new Error(`Unsupported MODE: ${mode}`)
  }
  return defaults
}

const envDefaults = getEnvDefaults(MODE)

const APP_ENV = {
  development: 'dev',
  test: 'test',
  production: 'prod',
}[MODE] ?? 'prod'

const APP_NAME = validateEnvVar(
  import.meta.env.VITE_APP_NAME,
  envDefaults.APP_NAME,
  'VITE_APP_NAME',
)

const APP_VERSION = __APP_VERSION__

const API_BASE_URL = validateEnvVar(
  import.meta.env.VITE_API_BASE_URL,
  envDefaults.API_BASE_URL,
  'VITE_API_BASE_URL',
)

export const isDev = import.meta.env.DEV
export const isProd = import.meta.env.PROD
export const isTest = import.meta.env.MODE === 'test'

export const env = {
  MODE,
  APP_ENV,
  APP_NAME,
  APP_VERSION,
  API_BASE_URL,
  isDev,
  isProd,
  isTest,
}

export const {
  MODE: mode,
  APP_ENV: appEnv,
  APP_NAME: appName,
  APP_VERSION: appVersion,
  API_BASE_URL: apiBaseUrl,
} = env

export default env
