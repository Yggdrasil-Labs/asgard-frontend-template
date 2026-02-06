/**
 * qiankun 微前端工具函数
 *
 * 本文件提供 qiankun 相关的工具函数,包括:
 * - 模式检测函数
 * - qiankun 环境判断
 * - 其他辅助函数
 */

import { APP_MODE } from '@/constants/qiankun'

/**
 * 获取当前应用运行模式
 *
 * 从环境变量 VITE_APP_MODE 读取,如果未设置则默认为 standalone
 *
 * @returns {string} 应用运行模式 ('main' | 'micro' | 'standalone')
 */
export function getAppMode() {
  return import.meta.env.VITE_APP_MODE || APP_MODE.STANDALONE
}

/**
 * 判断当前是否为主应用模式
 *
 * @returns {boolean} true: 主应用模式, false: 非主应用模式
 */
export function isMainApp() {
  return getAppMode() === APP_MODE.MAIN
}

/**
 * 判断当前是否为子应用模式
 *
 * @returns {boolean} true: 子应用模式, false: 非子应用模式
 */
export function isMicroApp() {
  return getAppMode() === APP_MODE.MICRO
}

/**
 * 判断当前是否为独立应用模式
 *
 * @returns {boolean} true: 独立应用模式, false: 非独立应用模式
 */
export function isStandalone() {
  return getAppMode() === APP_MODE.STANDALONE
}

/**
 * 判断当前是否在 qiankun 环境中运行
 *
 * 通过检查全局变量 window.__POWERED_BY_QIANKUN__ 来判断
 *
 * @returns {boolean} true: 在 qiankun 环境中, false: 不在 qiankun 环境中
 */
export function isQiankunEnv() {
  return window.__POWERED_BY_QIANKUN__
}

/**
 * 获取子应用名称
 *
 * 从环境变量 VITE_APP_NAME 读取
 *
 * @returns {string} 子应用名称
 */
export function getAppName() {
  return import.meta.env.VITE_APP_NAME || ''
}

/**
 * 获取子应用公共路径
 *
 * 从环境变量 VITE_APP_PUBLIC_PATH 读取
 *
 * @returns {string} 子应用公共路径
 */
export function getPublicPath() {
  return import.meta.env.VITE_APP_PUBLIC_PATH || '/'
}
