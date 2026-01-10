/**
 * 用户相关 API 接口
 * 提供用户认证、信息管理等功能
 */

import type { AxiosResponse } from 'axios'
import type {
  ApiResponse,
  AssignUserRoleRequest,
  CreateUserRequest,
  GetUsersParams,
  PaginatedUserResponse,
  SingleUserResponse,
  UpdateUserRequest,
} from '@/types/api'
import type { LoginInfo, UserInfo } from '@/types/store'
import request from '../request'

/**
 * 用户登录
 * @param loginInfo - 登录信息
 * @returns 登录响应（包含 token 和用户信息）
 */
export function loginApi(
  loginInfo: LoginInfo,
): Promise<AxiosResponse<ApiResponse<{ token: string, user: UserInfo }>>> {
  // 模拟 API 调用（实际项目中应该调用真实接口）
  return new Promise((resolve) => {
    setTimeout(() => {
      if (loginInfo.username === 'demo' && loginInfo.password === 'password') {
        resolve({
          data: {
            success: true,
            data: {
              token: `mock-jwt-token-${Date.now()}`,
              user: {
                id: '1',
                username: 'demo',
                email: 'demo@example.com',
                avatar: '/default-avatar.png',
                roles: ['user'],
                permissions: ['read', 'write'],
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
              },
            },
          },
        } as AxiosResponse<ApiResponse<{ token: string, user: UserInfo }>>)
      }
      else {
        resolve({
          data: {
            success: false,
            errCode: 'INVALID_CREDENTIALS',
            errMessage: '用户名或密码错误',
          },
        } as AxiosResponse<ApiResponse<{ token: string, user: UserInfo }>>)
      }
    }, 1000)
  })

  // 真实项目中使用以下代码：
  // return request.post('/auth/login', loginInfo)
}

/**
 * 用户登出
 * @returns 登出响应
 */
export function logoutApi(): Promise<AxiosResponse<ApiResponse<null>>> {
  // 模拟 API 调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
        },
      } as AxiosResponse<ApiResponse<null>>)
    }, 500)
  })

  // 真实项目中使用以下代码：
  // return request.post('/auth/logout')
}

/**
 * 获取当前登录用户信息
 * @returns 用户信息响应
 */
export function getUserInfoApi(): Promise<AxiosResponse<ApiResponse<UserInfo>>> {
  // 模拟 API 调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data: {
            id: '1',
            username: 'demo',
            email: 'demo@example.com',
            avatar: '/default-avatar.png',
            roles: ['user'],
            permissions: ['read', 'write'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
      } as AxiosResponse<ApiResponse<UserInfo>>)
    }, 500)
  })

  // 真实项目中使用以下代码：
  // return request.get('/user/info')
}

/**
 * 更新当前登录用户信息
 * @param userInfo - 用户信息（部分）
 * @returns 更新后的用户信息
 */
export function updateUserInfoApi(
  userInfo: Partial<UserInfo>,
): Promise<AxiosResponse<ApiResponse<UserInfo>>> {
  // 模拟 API 调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data: {
            id: '1',
            username: 'demo',
            email: 'demo@example.com',
            avatar: '/default-avatar.png',
            roles: ['user'],
            permissions: ['read', 'write'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: new Date().toISOString(),
            ...userInfo,
          },
        },
      } as AxiosResponse<ApiResponse<UserInfo>>)
    }, 500)
  })

  // 真实项目中使用以下代码：
  // return request.put('/user/info', userInfo)
}

/**
 * 刷新 Token
 * @returns 新的 token
 */
export function refreshTokenApi(): Promise<AxiosResponse<ApiResponse<{ token: string }>>> {
  // 模拟 API 调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data: {
            token: `mock-jwt-token-refreshed-${Date.now()}`,
          },
        },
      } as AxiosResponse<ApiResponse<{ token: string }>>)
    }, 500)
  })

  // 真实项目中使用以下代码：
  // return request.post('/auth/refresh')
}

// ==================== 用户管理 API ====================

/**
 * 创建用户
 * @param userData - 用户数据
 * @returns 创建的用户信息
 */
export function createUserApi(userData: CreateUserRequest): Promise<AxiosResponse<SingleUserResponse>> {
  return request.post('/users', userData)
}

/**
 * 更新用户
 * @param id - 用户 ID
 * @param userData - 用户数据
 * @returns 更新后的用户信息
 */
export function updateUserApi(
  id: string,
  userData: UpdateUserRequest,
): Promise<AxiosResponse<SingleUserResponse>> {
  return request.put(`/users/${id}`, userData)
}

/**
 * 删除用户
 * @param id - 用户 ID
 * @returns 删除响应
 */
export function deleteUserApi(id: string): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.delete(`/users/${id}`)
}

/**
 * 获取用户详情
 * @param id - 用户 ID
 * @returns 用户详情
 */
export function getUserByIdApi(id: string): Promise<AxiosResponse<SingleUserResponse>> {
  return request.get(`/users/${id}`)
}

/**
 * 获取用户列表（分页）
 * @param params - 查询参数
 * @returns 分页用户列表
 */
export function getUsersApi(params?: GetUsersParams): Promise<AxiosResponse<PaginatedUserResponse>> {
  return request.get('/users', { params })
}

/**
 * 分配用户角色
 * @param id - 用户 ID
 * @param roleData - 角色数据
 * @returns 更新后的用户信息
 */
export function assignUserRoleApi(
  id: string,
  roleData: AssignUserRoleRequest,
): Promise<AxiosResponse<SingleUserResponse>> {
  return request.post(`/users/${id}/roles`, roleData)
}
