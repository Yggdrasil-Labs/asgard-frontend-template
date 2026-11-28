import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { isR, isValidationErrorData } from '@/types/api'
import { ApiError } from './error'

function isRawRequest(config: AxiosRequestConfig): boolean {
  const method = config.method?.toLowerCase()
  return method === 'head' || method === 'options'
    || config.responseType === 'blob' || config.responseType === 'arraybuffer'
}

function headerTraceId(response: AxiosResponse<unknown>): string | null {
  const value = Object.entries(response.headers).find(([key]) => key.toLowerCase() === 'x-trace-id')?.[1]
  return typeof value === 'string' ? value : null
}

function httpFailure(status: number): { code: string, message: string } {
  switch (status) {
    case 401: return { code: 'UNAUTHORIZED', message: '未授权' }
    case 403: return { code: 'FORBIDDEN', message: '拒绝访问' }
    case 404: return { code: 'NOT_FOUND', message: '请求的资源不存在' }
    case 500: return { code: 'INTERNAL_SERVER_ERROR', message: '服务器内部错误' }
    case 502: return { code: 'BAD_GATEWAY', message: '网关错误' }
    case 503: return { code: 'SERVICE_UNAVAILABLE', message: '服务不可用' }
    case 504: return { code: 'GATEWAY_TIMEOUT', message: '网关超时' }
    default: return { code: 'HTTP_ERROR', message: `请求失败 (${status})` }
  }
}

/** 成功、失败响应共用归一化逻辑，不能通过 validateStatus 配置绕过 HTTP 判定。 */
export function normalizeResponse(response: AxiosResponse<unknown>, cause?: unknown): AxiosResponse<unknown> {
  const successfulHttp = response.status >= 200 && response.status < 300
  const raw = isRawRequest(response.config)
  const body = !raw && isR(response.data) ? response.data : undefined
  if (successfulHttp && (raw || body?.code === '00000'))
    return response

  const fallback = successfulHttp
    ? { code: 'PROTOCOL_ERROR', message: '响应格式不符合接口契约' }
    : httpFailure(response.status)
  throw new ApiError(body?.message || fallback.message, {
    code: body?.code ?? fallback.code,
    httpStatus: response.status,
    traceId: body?.traceId ?? headerTraceId(response),
    details: body && isValidationErrorData(body.data) ? body.data : undefined,
    response,
    cause,
  })
}
