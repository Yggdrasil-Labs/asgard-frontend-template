import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { CustomerCO, CustomerListParams, UpdateCustomerRequest } from '@/api/modules/customer'
import type { PageResult, R } from '@/types/api'
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest'
import { createCustomer, deleteCustomer, getCustomer, listCustomers, updateCustomer } from '@/api/modules/customer'
import request from '@/utils/api/request'
import { envelope, responseAdapter } from './adapter'

const originalAdapter = request.defaults.adapter
const customer: CustomerCO = {
  id: 42,
  name: '示例客户',
  email: 'customer@example.test',
  phone: null,
  status: 'ACTIVE',
  version: 3,
}

afterEach(() => {
  request.defaults.adapter = originalAdapter
})

function capture(data: unknown, status = 200) {
  const calls: InternalAxiosRequestConfig[] = []
  request.defaults.adapter = responseAdapter(data, status, {}, config => calls.push(config))
  return calls
}

describe('customer API wire contract', () => {
  it('creates with JSON and returns the full typed Customer response', async () => {
    const calls = capture(envelope({ ...customer, version: 0 }))
    const input = { name: customer.name, email: customer.email, phone: '' }
    const response = await createCustomer(input)
    expectTypeOf(response).toEqualTypeOf<AxiosResponse<R<CustomerCO>>>()
    expect(response.data.data?.version).toBe(0)
    expect(calls[0].url).toBe('/api/customers')
    expect(calls[0].method).toBe('post')
    expect(JSON.parse(calls[0].data)).toEqual(input)
  })

  it('reads detail with its version and nullable phone', async () => {
    const calls = capture(envelope(customer))
    const response = await getCustomer(42)
    expectTypeOf(response).toEqualTypeOf<AxiosResponse<R<CustomerCO>>>()
    expect(response.data.data).toEqual(customer)
    expect(calls[0]).toMatchObject({ url: '/api/customers/42', method: 'get' })
  })

  it('sends pageIndex/pageSize and reads a nested page with corrected metadata', async () => {
    const page: PageResult<CustomerCO> = {
      data: [customer],
      totalCount: 23,
      pageIndex: 2,
      pageSize: 10,
      totalPages: 3,
      hasNext: true,
      hasPrevious: true,
    }
    const calls = capture(envelope(page))
    const response = await listCustomers({
      pageIndex: 2,
      pageSize: 10,
      keyword: '示例',
      status: 'ACTIVE',
    })
    expectTypeOf(response).toEqualTypeOf<AxiosResponse<R<PageResult<CustomerCO>>>>()
    expect(response.data.data).toEqual(page)
    expect(calls[0]).toMatchObject({
      url: '/api/customers',
      method: 'get',
      params: {
        pageIndex: 2,
        pageSize: 10,
        keyword: '示例',
        status: 'ACTIVE',
      },
    })
    expect(calls[0].params).not.toHaveProperty('page')
    expect(calls[0].params).not.toHaveProperty('size')
    expectTypeOf<CustomerListParams>().toMatchTypeOf<{ pageIndex: number, pageSize: number }>()
  })

  it.each([null, ''])('sends the read version with phone %j unchanged', async (phone) => {
    const calls = capture(envelope({ ...customer, version: 4 }))
    const response = await updateCustomer(42, { version: 3, name: '修改姓名', phone })
    expectTypeOf(response).toEqualTypeOf<AxiosResponse<R<CustomerCO>>>()
    expectTypeOf<UpdateCustomerRequest>().toMatchTypeOf<{ version: number }>()
    expectTypeOf<{ name: string }>().not.toMatchTypeOf<UpdateCustomerRequest>()
    expect(JSON.parse(calls[0].data)).toEqual({ version: 3, name: '修改姓名', phone })
    expect(calls[0]).toMatchObject({ url: '/api/customers/42', method: 'put' })
    expect(response.data.data?.version).toBe(4)
  })

  it('deletes with R<null>, preserving successful null data', async () => {
    const calls = capture(envelope())
    const response = await deleteCustomer(42)
    expectTypeOf(response).toEqualTypeOf<AxiosResponse<R<null>>>()
    expect(response.data.data).toBeNull()
    expect(calls[0]).toMatchObject({ url: '/api/customers/42', method: 'delete' })
  })

  it('keeps HTTP 404 distinguishable from business absence', async () => {
    capture(envelope(null, '20001'), 404)
    await expect(getCustomer(42)).rejects.toMatchObject({ code: '20001', httpStatus: 404 })
    capture(envelope(null, '20001'))
    await expect(getCustomer(42)).rejects.toMatchObject({ code: '20001', httpStatus: 200 })
  })
})
