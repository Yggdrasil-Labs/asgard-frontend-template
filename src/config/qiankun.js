/**
 * qiankun 微前端全局配置
 *
 * 本文件定义 qiankun 的全局配置选项,包括:
 * - 沙箱配置 (sandbox)
 * - 预加载策略 (prefetch)
 * - 单例模式 (singular)
 * - 错误处理 (errorHandler)
 *
 * @see https://qiankun.umijs.org/zh/api#start-opts
 */

/**
 * qiankun 全局配置对象
 * @type {import('qiankun').FrameworkConfiguration}
 */
export default {
  // 沙箱配置
  sandbox: {
    // 是否使用严格的样式隔离 (Shadow DOM)
    // 注意: Shadow DOM 可能导致部分 UI 组件库样式失效
    strictStyleIsolation: false,

    // 是否使用实验性的样式隔离 (CSS Scoping)
    // 推荐: 通过给子应用样式添加前缀实现隔离,兼容性更好
    experimentalStyleIsolation: true,
  },

  // 预加载策略
  // true: 第一个微应用挂载后开始预加载其他微应用的静态资源
  // 'all': 主应用 start 后即开始预加载所有微应用静态资源
  // string[]: 主应用 start 后即开始预加载指定的微应用静态资源
  // false: 不预加载
  prefetch: true,

  // 是否为单例模式
  // true: 同一时间只会渲染一个微应用
  singular: true,

  // 全局错误处理函数
  errorHandler: (error) => {
    console.error('[qiankun] 全局错误:', error)
  },
}
