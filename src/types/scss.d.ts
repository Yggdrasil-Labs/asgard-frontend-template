// SCSS 模块类型声明
declare module '*.scss' {
  const content: string
  export default content
}

declare module '*.sass' {
  const content: string
  export default content
}

declare module '*.css' {
  const content: string
  export default content
}

// 为 @scss 别名路径提供类型支持
declare module '@scss/*' {
  const content: string
  export default content
}
