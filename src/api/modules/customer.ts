import http from '@/utils/api/http'

export interface CustomerCO {
  id: number
  name: string
  email: string
  phone: string | null
  status: string
}

export interface CreateCustomerRequest {
  name: string
  email: string
  phone?: string
}

export interface UpdateCustomerRequest {
  name?: string
  email?: string
  phone?: string
}

export interface CustomerListParams {
  page: number
  size: number
  keyword?: string
  status?: string
}

export function createCustomer(data: CreateCustomerRequest) {
  return http.post('/api/customers', data)
}

export function getCustomer(id: number) {
  return http.get(`/api/customers/${id}`)
}

export function listCustomers(params: CustomerListParams) {
  return http.get('/api/customers', params)
}

export function updateCustomer(id: number, data: UpdateCustomerRequest) {
  return http.put(`/api/customers/${id}`, data)
}

export function deleteCustomer(id: number) {
  return http.delete(`/api/customers/${id}`)
}
