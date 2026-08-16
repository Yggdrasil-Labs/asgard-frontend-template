import type { AxiosResponse } from 'axios'

/**
 * API 错误类型
 * 统一业务错误与 HTTP/网络错误的对象形状：
 * - code：业务错误码或 HTTP 错误码（如 UNAUTHORIZED / NETWORK_ERROR）
 * - status：HTTP 状态码（业务错误为响应状态码）
 * - response：原始 AxiosResponse（仅请求已到达服务端时存在）
 * - cause：原始错误（HTTP/网络错误时保留原始 AxiosError）
 */
export interface ApiErrorOptions {
  code: string
  status?: number
  response?: AxiosResponse
  cause?: unknown
}

export class ApiError extends Error {
  readonly code: string
  readonly status?: number
  readonly response?: AxiosResponse

  constructor(message: string, options: ApiErrorOptions) {
    super(message)
    this.name = 'ApiError'
    this.code = options.code
    this.status = options.status
    this.response = options.response
    if (options.cause !== undefined) {
      this.cause = options.cause
    }
  }
}
