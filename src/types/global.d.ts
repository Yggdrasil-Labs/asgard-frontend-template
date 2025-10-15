declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.svg' {
  const svgUrl: string
  export default svgUrl
}
