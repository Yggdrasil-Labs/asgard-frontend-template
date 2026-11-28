import type { AxiosResponse } from 'axios'
import type { ValidationErrorData } from '@/types/api'

export interface ApiErrorOptions {
  code: string
  httpStatus?: number
  traceId?: string | null
  details?: ValidationErrorData
  response?: AxiosResponse<unknown>
  cause?: unknown
}

export class ApiError extends Error {
  readonly code: string
  readonly httpStatus?: number
  readonly traceId?: string | null
  readonly details?: ValidationErrorData
  readonly response?: AxiosResponse<unknown>
  override readonly cause?: unknown

  constructor(message: string, options: ApiErrorOptions) {
    super(message, { cause: options.cause })
    this.name = 'ApiError'
    this.code = options.code
    this.httpStatus = options.httpStatus
    this.traceId = options.traceId
    this.details = options.details
    this.response = options.response
    this.cause = options.cause
  }

  /** @deprecated 业务消费使用 httpStatus。 */
  get status(): number | undefined {
    return this.httpStatus
  }
}
