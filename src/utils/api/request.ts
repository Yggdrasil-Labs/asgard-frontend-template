import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { env } from '@/config/env'
import { ApiError } from './error'
import { normalizeResponse } from './normalize'

const request: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
})

request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now(),
    }
  }
  return config
})

request.interceptors.response.use(
  (response: AxiosResponse<unknown>) => normalizeResponse(response),
  (error: unknown) => {
    // 主动取消保留同一错误对象，调用方可使用 axios.isCancel。
    const code = error && typeof error === 'object' && 'code' in error
      ? error.code
      : undefined
    if (axios.isCancel(error) || code === 'ERR_CANCELED')
      return Promise.reject(error)
    if (error instanceof ApiError)
      return Promise.reject(error)

    const axiosError = axios.isAxiosError(error)
      ? error
      : undefined
    if (axiosError?.code === 'ECONNABORTED' || axiosError?.code === 'ETIMEDOUT') {
      return Promise.reject(new ApiError('请求超时', {
        code: 'TIMEOUT',
        httpStatus: axiosError.response?.status,
        response: axiosError.response,
        cause: error,
      }))
    }
    if (axiosError?.response) {
      return normalizeResponse(axiosError.response, error)
    }
    return Promise.reject(new ApiError('网络连接失败，请检查网络', {
      code: 'NETWORK_ERROR',
      cause: error,
    }))
  },
)

export default request
