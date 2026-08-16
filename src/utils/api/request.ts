import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'
import axios from 'axios'
import { env } from '@/config/env'
import { ApiError } from './error'

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    if (import.meta.env.DEV) {
      console.warn('[request] 请求发送:', {
        url: config.url,
        method: config.method,
      })
    }

    return config
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error('[request] 请求拦截器错误:', error.message)
    }
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response

    if (import.meta.env.DEV) {
      console.warn('[request] 响应接收:', {
        url: response.config.url,
        status: response.status,
      })
    }

    // DELETE 等成功的无响应体请求不包含 COLA 信封。
    if (response.status === 204) {
      return response
    }

    // cola5.0 统一处理响应数据
    if (data.success === true) {
      // 请求成功，直接返回响应
      return response
    }
    else {
      // 业务错误处理
      const errorMessage = data.errMessage || '请求失败'
      const errorCode = data.errCode || 'UNKNOWN_ERROR'

      if (import.meta.env.DEV) {
        console.error('[request] 业务错误:', {
          errCode: errorCode,
          errMessage: errorMessage,
        })
      }

      // 可以在这里添加全局错误提示
      // ElMessage.error(errorMessage)

      return Promise.reject(new ApiError(errorMessage, {
        code: errorCode,
        status: response.status,
        response,
      }))
    }
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error('[request] 响应拦截器错误:', error.message)
    }

    let errorMessage = '网络错误，请稍后重试'
    let errorCode = 'NETWORK_ERROR'

    // 取消：组件卸载等场景的主动取消，原样透传不包装，避免被当成失败
    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error)
    }

    // 超时：error.request 同时为真，必须先于 response/request 判断，
    // 否则会误报为「网络连接失败」
    if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时'
      errorCode = 'TIMEOUT'
    }
    else if (error.response) {
      const { status, data } = error.response
      const apiData = data as ApiResponse

      // 优先使用后端返回的错误信息
      if (apiData?.errMessage) {
        errorMessage = apiData.errMessage
        errorCode = apiData.errCode || 'UNKNOWN_ERROR'
      }
      else {
        // HTTP 状态码错误处理
        switch (status) {
          case 401:
            errorMessage = '未授权'
            errorCode = 'UNAUTHORIZED'
            break
          case 403:
            errorMessage = '拒绝访问'
            errorCode = 'FORBIDDEN'
            break
          case 404:
            errorMessage = '请求的资源不存在'
            errorCode = 'NOT_FOUND'
            break
          case 500:
            errorMessage = '服务器内部错误'
            errorCode = 'INTERNAL_SERVER_ERROR'
            break
          case 502:
            errorMessage = '网关错误'
            errorCode = 'BAD_GATEWAY'
            break
          case 503:
            errorMessage = '服务不可用'
            errorCode = 'SERVICE_UNAVAILABLE'
            break
          case 504:
            errorMessage = '网关超时'
            errorCode = 'GATEWAY_TIMEOUT'
            break
          default:
            errorMessage = apiData?.errMessage || `请求失败 (${status})`
            errorCode = 'HTTP_ERROR'
        }
      }
    }
    else if (error.request) {
      errorMessage = '网络连接失败，请检查网络'
      errorCode = 'NETWORK_ERROR'
    }

    // 可以在这里添加全局错误提示
    // ElMessage.error(errorMessage)

    return Promise.reject(new ApiError(errorMessage, {
      code: errorCode,
      status: error.response?.status,
      response: error.response,
      cause: error,
    }))
  },
)

export default request
