/** Mimir R 的公共 JSON 信封；成功由 HTTP 状态与 code 共同判定。 */
export interface R<T = unknown> {
  code: string
  message: string
  data: T | null
  timestamp: number
  traceId: string | null
  success: boolean
}

export interface PageResult<T = unknown> {
  data: T[]
  totalCount: number
  pageIndex: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface ValidationErrorDetail {
  /** 已知值为 FIELD / PARAMETER / OBJECT；未知来源保留给消费方汇总。 */
  source: string
  path: string
  parameterIndex: number | null
  constraint: string
  message: string
}

export interface ValidationErrorData {
  errors: ValidationErrorDetail[]
  totalCount: number
  truncated: boolean
}

export interface PaginationParams {
  pageIndex?: number
  pageSize?: number
}

export type ListParams<T = Record<string, unknown>> = T & PaginationParams
