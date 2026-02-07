/**
 * 子应用注册配置
 *
 * 本文件定义主应用要注册的子应用列表。
 * 每个子应用配置包括:
 * - name: 子应用唯一标识
 * - entry: 子应用入口地址
 * - container: 子应用挂载容器选择器
 * - activeRule: 子应用激活路由规则
 * - props: 传递给子应用的数据
 *
 * 注意: 仅在主应用模式 (VITE_APP_MODE=main) 下使用此配置
 *
 * @see https://qiankun.umijs.org/zh/api#registermicroapps-apps-lifecycles
 */

/**
 * 子应用配置数组
 *
 * @typedef {object} MicroAppConfig
 * @property {string} name - 子应用唯一标识,必须唯一
 * @property {string} [title] - 子应用显示名称 (用于导航栏下拉菜单,默认使用 name)
 * @property {string} entry - 子应用入口地址,开发环境和生产环境可以不同
 * @property {string} container - 子应用挂载容器的 CSS 选择器
 * @property {string|Function} activeRule - 子应用激活的路由规则
 * @property {object} [props] - 传递给子应用的数据 (可选)
 * @property {string} [props.basename] - 子应用路由前缀
 * @property {object} [props.globalState] - 全局状态
 * @property {object} [props.eventBus] - 事件总线
 */

/**
 * 子应用列表
 * @type {MicroAppConfig[]}
 */
export default [
  // 示例 1: 子应用 micro-app-1
  {
    name: 'micro-app-1',
    title: '子应用 1',
    entry: import.meta.env.DEV
      ? '//localhost:5173/'
      : '//cdn.example.com/micro-app-1/',
    container: '#subapp-viewport',
    activeRule: '/micro-app-1',
    props: {
      basename: '/micro-app-1',
    },
  },

  // 示例 2: 子应用 micro-app-2
  // {
  //   name: 'micro-app-2',
  //   title: '子应用 2',
  //   entry: import.meta.env.DEV
  //     ? '//localhost:5174/'
  //     : '//cdn.example.com/micro-app-2/',
  //   container: '#subapp-viewport',
  //   activeRule: '/micro-app-2',
  //   props: {
  //     basename: '/micro-app-2',
  //   }
  // }
]
