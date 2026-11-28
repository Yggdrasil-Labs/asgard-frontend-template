import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { AxiosError, AxiosHeaders } from 'axios'

/** 仅替换网络传输，仍执行 Axios 数据转换及请求、响应拦截器。 */
export function responseAdapter(
  data: unknown,
  status = 200,
  headers: Record<string, string> = {},
  inspect?: (config: InternalAxiosRequestConfig) => void,
): AxiosAdapter {
  return async (config) => {
    inspect?.(config)
    const response: AxiosResponse<unknown> = {
      data,
      status,
      statusText: String(status),
      headers: new AxiosHeaders(headers),
      config,
    }
    if (config.validateStatus && !config.validateStatus(status)) {
      throw new AxiosError('HTTP transport failure', AxiosError.ERR_BAD_RESPONSE, config, {}, response)
    }
    return response
  }
}

/** 手工构造的格式错误及边界输入，不作为后端生成样例。 */
export function envelope(data: unknown = null, code = '00000') {
  return { code, message: '契约消息', data, timestamp: 1, traceId: null, success: code === '00000' }
}
