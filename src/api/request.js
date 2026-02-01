import axios from 'axios'
import env from '@/config/env'

const request = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

request.interceptors.request.use(
  (config) => {
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }
    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.success === true) {
      return response
    }
    const errorMessage = data.errMessage || '请求失败'
    const errorCode = data.errCode || 'UNKNOWN_ERROR'
    const error = new Error(errorMessage)
    error.code = errorCode
    error.response = response
    return Promise.reject(error)
  },
  (error) => {
    let errorMessage = '网络错误，请稍后重试'
    let errorCode = 'NETWORK_ERROR'
    if (error.response) {
      const { status, data } = error.response
      if (data?.errMessage) {
        errorMessage = data.errMessage
        errorCode = data.errCode || 'UNKNOWN_ERROR'
      }
      else {
        const map = {
          401: ['未授权，请重新登录', 'UNAUTHORIZED'],
          403: ['拒绝访问', 'FORBIDDEN'],
          404: ['请求的资源不存在', 'NOT_FOUND'],
          500: ['服务器内部错误', 'INTERNAL_SERVER_ERROR'],
          502: ['网关错误', 'BAD_GATEWAY'],
          503: ['服务不可用', 'SERVICE_UNAVAILABLE'],
          504: ['网关超时', 'GATEWAY_TIMEOUT'],
        }
        const pair = map[status] || [`请求失败 (${status})`, 'HTTP_ERROR']
        errorMessage = pair[0]
        errorCode = pair[1]
      }
    }
    else if (error.request) {
      errorMessage = '网络连接失败，请检查网络'
    }
    else if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时'
      errorCode = 'TIMEOUT'
    }
    const customError = new Error(errorMessage)
    customError.code = errorCode
    customError.originalError = error
    return Promise.reject(customError)
  },
)

export default request
