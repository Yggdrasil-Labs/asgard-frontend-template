import type { PageResult } from '@/types/api'
import { describe, expect, it } from 'vitest'
import http from '@/utils/api/http'
import { extractData, extractDataOrDefault, extractPaginatedData, isSuccess } from '@/utils/api/utils'
import { envelope, responseAdapter } from './adapter'

describe('r extraction', () => {
  it('reads the inner PageResult including server-corrected pagination', async () => {
    const page = {
      data: [
        { id: 42 },
      ],
      totalCount: 23,
      pageIndex: 2,
      pageSize: 10,
      totalPages: 3,
      hasNext: true,
      hasPrevious: true,
    }
    const response = await http.get<PageResult<{ id: number }>>('/test', undefined, {
      adapter: responseAdapter(envelope(page)),
    })
    expect(extractPaginatedData(response)).toBe(response.data.data)
    expect(extractPaginatedData(response)).toEqual(page)
  })

  it('preserves an empty page and rejects null or an old outer pagination shape', async () => {
    const empty = {
      data: [],
      totalCount: 0,
      pageIndex: 1,
      pageSize: 10,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    }
    const response = await http.get<PageResult>('/test', undefined, {
      adapter: responseAdapter(envelope(empty)),
    })
    expect(extractPaginatedData(response)).toEqual(empty)
    for (const data of [
      null,
      [],
      { ...empty, data: null },
    ]) {
      const malformed = await http.get<PageResult>('/test', undefined, {
        adapter: responseAdapter(envelope(data)),
      })
      expect(() => extractPaginatedData(malformed)).toThrow(expect.objectContaining({ code: 'PROTOCOL_ERROR' }))
    }
  })

  it.each([0, false, ''])('only defaults null and preserves %j', async (value) => {
    const response = await http.get<typeof value>('/test', undefined, {
      adapter: responseAdapter(envelope(value)),
    })
    expect(extractData(response)).toBe(value)
    expect(extractDataOrDefault(response, value)).toBe(value)
  })

  it('returns null and uses a supplied default for null', async () => {
    const response = await http.get<string>('/test', undefined, {
      adapter: responseAdapter(envelope()),
    })
    expect(extractData(response)).toBeNull()
    expect(extractDataOrDefault(response, 'default')).toBe('default')
  })

  it('uses code for business success', () => {
    expect(isSuccess({
      ...envelope(),
      success: false,
    })).toBe(true)
    expect(isSuccess({
      ...envelope(null, '21001'),
      success: true,
    })).toBe(false)
  })
})
