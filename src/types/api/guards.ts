import type { PageResult, R, ValidationErrorData, ValidationErrorDetail } from './response'

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

/** 只验证公共信封，不假装验证任意 T 的业务载荷。 */
export function isR(value: unknown): value is R {
  return isRecord(value)
    && typeof value.code === 'string'
    && typeof value.message === 'string'
    && Object.hasOwn(value, 'data')
    && typeof value.timestamp === 'number' && Number.isFinite(value.timestamp)
    && (typeof value.traceId === 'string' || value.traceId === null)
    && typeof value.success === 'boolean'
}

export function isPageResult(value: unknown): value is PageResult {
  return isRecord(value)
    && Array.isArray(value.data)
    && isNonNegativeInteger(value.totalCount)
    && isNonNegativeInteger(value.pageIndex) && value.pageIndex >= 1
    && isNonNegativeInteger(value.pageSize) && value.pageSize >= 1
    && isNonNegativeInteger(value.totalPages)
    && typeof value.hasNext === 'boolean'
    && typeof value.hasPrevious === 'boolean'
}

function isValidationErrorDetail(value: unknown): value is ValidationErrorDetail {
  return isRecord(value)
    && typeof value.source === 'string'
    && typeof value.path === 'string'
    && (value.parameterIndex === null || isNonNegativeInteger(value.parameterIndex))
    && typeof value.constraint === 'string'
    && typeof value.message === 'string'
}

export function isValidationErrorData(value: unknown): value is ValidationErrorData {
  return isRecord(value)
    && Array.isArray(value.errors) && value.errors.every(isValidationErrorDetail)
    && isNonNegativeInteger(value.totalCount)
    && typeof value.truncated === 'boolean'
}
