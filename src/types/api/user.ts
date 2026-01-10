/**
 * 用户相关类型定义
 */

import type { ApiResponse, ListParams, PaginatedResponse } from './response'

/**
 * 用户信息类型（用于当前登录用户）
 */
export interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
  createdAt: string
  updatedAt: string
}

/**
 * 用户数据对象（与后端 API 一致）
 */
export interface UserCO {
  /** 用户 ID */
  id: string
  /** 用户名 */
  username: string
  /** 邮箱 */
  email?: string
  /** 手机号 */
  phone?: string
  /** 昵称 */
  nickname?: string
  /** 头像 URL */
  avatar?: string
  /** 状态：0-禁用，1-启用 */
  status: number
  /** 扩展信息（JSON） */
  metadata?: string
  /** 角色 ID 列表 */
  roleIds?: string[]
  /** 用户来源 */
  source?: string
  /** 注册类型 */
  registerType?: string
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 创建用户请求
 */
export interface CreateUserRequest {
  /** 用户名（必填） */
  username: string
  /** 邮箱 */
  email?: string
  /** 手机号 */
  phone?: string
  /** 昵称 */
  nickname?: string
  /** 头像 URL */
  avatar?: string
  /** 状态：0-禁用，1-启用（默认启用） */
  status?: number
  /** 扩展信息（JSON） */
  metadata?: string
  /** 角色 ID 列表 */
  roleIds?: string[]
}

/**
 * 更新用户请求
 */
export interface UpdateUserRequest {
  /** 用户 ID（必填） */
  id: string
  /** 邮箱 */
  email?: string
  /** 手机号 */
  phone?: string
  /** 昵称 */
  nickname?: string
  /** 头像 URL */
  avatar?: string
  /** 状态：0-禁用，1-启用 */
  status?: number
  /** 扩展信息（JSON） */
  metadata?: string
  /** 乐观锁版本号 */
  version?: number
}

/**
 * 查询用户列表参数
 */
export interface GetUsersQuery {
  /** 用户名（模糊匹配） */
  username?: string
  /** 状态：0-禁用，1-启用 */
  status?: number
}

/**
 * 查询用户列表参数（带分页）
 */
export type GetUsersParams = ListParams<GetUsersQuery>

/**
 * 分配用户角色请求
 */
export interface AssignUserRoleRequest {
  /** 角色 ID 列表 */
  roleIds: string[]
}

/**
 * 单个用户响应
 */
export type SingleUserResponse = ApiResponse<UserCO>

/**
 * 分页用户列表响应
 */
export type PaginatedUserResponse = PaginatedResponse<UserCO>

/**
 * 用户列表响应（不分页）
 */
export type UserListResponse = ApiResponse<UserCO[]>
