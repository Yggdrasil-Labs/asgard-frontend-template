/**
 * 从 Axios 响应中提取 data 字段
 */
export function extractData(response) {
  return response?.data?.data
}

/**
 * 从 Axios 响应中提取 data 字段（非空）
 */
export function extractDataOrDefault(response, defaultValue) {
  return response?.data?.data ?? defaultValue
}

/**
 * 从分页响应中提取数据
 */
export function extractPaginatedData(response) {
  const { data, totalCount, pageSize, pageIndex, totalPages, notEmpty, empty } = response?.data ?? {}
  return {
    data: data ?? [],
    totalCount: totalCount ?? 0,
    pageSize: pageSize ?? 10,
    pageIndex: pageIndex ?? 1,
    totalPages: totalPages ?? 0,
    notEmpty: notEmpty ?? false,
    empty: empty ?? true,
  }
}

/**
 * 检查响应是否成功
 */
export function isSuccess(response) {
  return response?.success === true
}

/**
 * 获取错误信息
 */
export function getErrorMessage(error) {
  if (error instanceof Error)
    return error.message
  if (typeof error === 'string')
    return error
  return '未知错误'
}

/**
 * 获取错误码
 */
export function getErrorCode(error) {
  if (error && typeof error === 'object' && 'code' in error) {
    return String(error.code)
  }
  return 'UNKNOWN_ERROR'
}
