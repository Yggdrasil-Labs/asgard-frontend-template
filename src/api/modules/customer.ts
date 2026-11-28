import type { PageResult } from '@/types/api'
import http from '@/utils/api/http'

export interface CustomerCO {
  id: number
  name: string
  email: string
  phone: string | null
  status: string
  version: number
}

export interface CreateCustomerRequest {
  name: string
  email: string
  phone?: string
}

export interface UpdateCustomerRequest {
  /** 所读整数版本，写入范围 0..2147483646；不提供默认值。 */
  version: number
  name?: string | null
  email?: string | null
  phone?: string | null
}

export interface CustomerListParams {
  pageIndex: number
  pageSize: number
  keyword?: string
  status?: string
}

export function createCustomer(data: CreateCustomerRequest) {
  return http.post<CustomerCO>('/api/customers', data)
}

export function getCustomer(id: number) {
  return http.get<CustomerCO>(`/api/customers/${id}`)
}

export function listCustomers(params: CustomerListParams) {
  return http.get<PageResult<CustomerCO>>('/api/customers', { ...params })
}

export function updateCustomer(id: number, data: UpdateCustomerRequest) {
  return http.put<CustomerCO>(`/api/customers/${id}`, data)
}

export function deleteCustomer(id: number) {
  return http.delete<null>(`/api/customers/${id}`)
}
