import type { AxiosResponse } from 'axios'
import type { PageResult, R } from '@/types/api'
import { isPageResult } from '@/types/api'
import { ApiError } from './error'

export function extractData<T>(response: AxiosResponse<R<T>>): T | null {
  return response.data.data
}

/** 只对显式 null 使用默认值，保留 false、0 及空字符串。 */
export function extractDataOrDefault<T>(response: AxiosResponse<R<T>>, defaultValue: T): T {
  return response.data.data === null
    ? defaultValue
    : response.data.data
}

export function extractPaginatedData<T>(response: AxiosResponse<R<PageResult<T>>>): PageResult<T> {
  const page = response.data.data
  if (!isPageResult(page)) {
    throw new ApiError('分页响应格式不符合接口契约', {
      code: 'PROTOCOL_ERROR',
      httpStatus: response.status,
      traceId: response.data.traceId,
      response,
    })
  }
  return page
}

/** HTTP 状态由请求拦截器保证；此处仅判定业务结果。 */
export function isSuccess(response: R): boolean {
  return response.code === '00000'
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error)
    return error.message
  if (typeof error === 'string')
    return error
  return '未知错误'
}

export function getErrorCode(error: unknown): string {
  if (error instanceof ApiError)
    return error.code
  if (error && typeof error === 'object' && 'code' in error)
    return String(error.code)
  return 'UNKNOWN_ERROR'
}
