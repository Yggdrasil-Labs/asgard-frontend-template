/**
 * qiankun 微前端相关常量
 *
 * 本文件定义 qiankun 相关的常量,包括:
 * - 应用运行模式
 * - 子应用容器 ID
 * - 其他常量
 */

/**
 * 应用运行模式枚举
 * @enum {string}
 */
export const APP_MODE = {
  /** 主应用模式 - 作为微前端容器 */
  MAIN: 'main',

  /** 子应用模式 - 作为微前端子应用 */
  MICRO: 'micro',

  /** 独立应用模式 - 标准单体应用 (默认) */
  STANDALONE: 'standalone',
}

/**
 * 子应用容器默认 ID
 * @type {string}
 */
export const SUBAPP_CONTAINER_ID = 'subapp-viewport'

/**
 * qiankun 全局变量名
 * 用于判断是否在 qiankun 环境中运行
 * @type {string}
 */
export const QIANKUN_FLAG = '__POWERED_BY_QIANKUN__'
