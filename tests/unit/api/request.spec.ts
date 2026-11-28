import type { AxiosResponse } from 'axios'
import { AxiosError, CanceledError } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/utils/api/error'
import http from '@/utils/api/http'
import request from '@/utils/api/request'
import { envelope, responseAdapter } from './adapter'

function get(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return http.get('/test', undefined, {
    adapter: responseAdapter(data, status, headers),
  })
}

describe('r response interceptor', () => {
  it('rejects a business error even when success is true', async () => {
    await expect(get({
      ...envelope(null, '21001'),
      success: true,
    })).rejects.toMatchObject({
      code: '21001',
      httpStatus: 200,
      message: '契约消息',
    })
  })

  it('returns the full response for code 00000 even when success is false', async () => {
    const response = await get({
      ...envelope({ id: 42 }),
      success: false,
    })
    expect(response.status).toBe(200)
    expect(response.config.url).toBe('/test')
    expect(response.data.data).toEqual({ id: 42 })
  })

  it('accepts delete null data', async () => {
    const response = await http.delete('/test', {
      adapter: responseAdapter(envelope()),
    })
    expect(response.data.data).toBeNull()
  })

  it.each(['20001', '21001', '21002'])('preserves business code %s at HTTP 200', async (code) => {
    await expect(get(envelope(null, code))).rejects.toMatchObject({ code, httpStatus: 200 })
  })

  it('preserves structured details, future sources, body trace and status alias', async () => {
    const details = {
      errors: [
        {
          source: 'FIELD',
          path: 'name',
          parameterIndex: 0,
          constraint: 'Size',
          message: '姓名长度无效',
        },
        {
          source: 'OBJECT',
          path: '$',
          parameterIndex: null,
          constraint: 'Update',
          message: '没有更新字段',
        },
        {
          source: 'FUTURE',
          path: 'x',
          parameterIndex: null,
          constraint: 'Future',
          message: '未来来源',
        },
      ],
      totalCount: 3,
      truncated: false,
    }
    const failure = await get({
      ...envelope(details, '00004'),
      traceId: 'body-trace',
    }, 400, { 'x-trace-id': 'header-trace' }).catch(error => error)
    expect(failure).toBeInstanceOf(ApiError)
    expect(failure).toMatchObject({
      code: '00004',
      httpStatus: 400,
      status: 400,
      traceId: 'body-trace',
      details,
    })
    expect(failure.cause).toBeInstanceOf(AxiosError)
    expect(failure.response.status).toBe(400)
  })

  it('ignores malformed validation details and falls back to trace header for null body trace', async () => {
    await expect(get(envelope({
      errors: [{}],
      totalCount: 1,
      truncated: false,
    }, '00004'), 400, { 'X-Trace-Id': 'header-trace' }))
      .rejects
      .toMatchObject({ details: undefined, traceId: 'header-trace' })
  })

  it.each([
    [404, '20001'],
    [500, '10000'],
    [500, '00000'],
  ])('rejects HTTP %s with code %s through the rejected branch', async (status, code) => {
    await expect(get(envelope(null, code), status)).rejects.toMatchObject({ code, httpStatus: status })
  })

  it('rejects non-2xx even when validateStatus resolves and code is 00000', async () => {
    await expect(http.get('/test', undefined, {
      adapter: responseAdapter(envelope(), 404),
      validateStatus: () => true,
    })).rejects.toMatchObject({ code: '00000', httpStatus: 404 })
  })

  it.each([
    null,
    undefined,
    '',
    '<html>private response</html>',
    '{invalid json',
    {},
    { success: true, data: {} },
  ])(
    'rejects missing/legacy/malformed JSON envelopes: %j',
    async (data) => {
      await expect(get(data)).rejects.toMatchObject({ code: 'PROTOCOL_ERROR', httpStatus: 200 })
    },
  )

  it.each([
    'code',
    'message',
    'data',
    'timestamp',
    'traceId',
    'success',
  ])('requires the %s field', async (field) => {
    const body: Record<string, unknown> = envelope()
    delete body[field]
    await expect(get(body)).rejects.toMatchObject({ code: 'PROTOCOL_ERROR' })
  })

  it.each([
    { code: 0 },
    { message: null },
    { timestamp: '1' },
    { timestamp: Number.NaN },
    { traceId: 123 },
    { success: 'true' },
  ])('validates envelope field shapes: %j', async (invalid) => {
    await expect(get({
      ...envelope(),
      ...invalid,
    })).rejects.toMatchObject({ code: 'PROTOCOL_ERROR' })
  })

  it('rejects ordinary JSON 204 instead of treating it as a successful delete', async () => {
    await expect(get('', 204)).rejects.toMatchObject({ code: 'PROTOCOL_ERROR', httpStatus: 204 })
  })

  it.each([400, 404, 500, 502])('uses safe HTTP messages without reflecting HTML at HTTP %s', async (status) => {
    const failure = await get('<html>secret server content</html>', status, { 'X-Trace-Id': 'trace-http' }).catch(error => error)
    expect(failure).toBeInstanceOf(ApiError)
    expect(failure.httpStatus).toBe(status)
    expect(failure.traceId).toBe('trace-http')
    expect(failure.message).not.toContain('secret')
  })

  it('keeps strict JSON parsing failures safe', async () => {
    await expect(request.get('/test', {
      responseType: 'json',
      transitional: { silentJSONParsing: false },
      adapter: responseAdapter('{invalid json'),
    })).rejects.toMatchObject({ code: 'PROTOCOL_ERROR', httpStatus: 200 })
  })

  it.each([
    new CanceledError('cancelled'),
    Object.assign(new Error('cancelled by code'), { code: 'ERR_CANCELED' }),
    { __CANCEL__: true },
  ])('preserves cancellation identity', async (error) => {
    await expect(http.get('/test', undefined, {
      adapter: async () => {
        throw error
      },
    })).rejects.toBe(error)
  })

  it.each(['ECONNABORTED', 'ETIMEDOUT'])('classifies %s before response/network and preserves cause', async (code) => {
    const failure = new AxiosError('unsafe internal message', code, undefined, {})
    failure.response = { status: 500 } as AxiosResponse
    await expect(http.get('/test', undefined, {
      adapter: async () => {
        throw failure
      },
    })).rejects.toMatchObject({
      code: 'TIMEOUT',
      message: '请求超时',
      cause: failure,
    })
  })

  it('classifies missing response as network failure without leaking the cause message', async () => {
    const failure = new AxiosError('internal connection detail', 'ERR_NETWORK', undefined, {})
    await expect(http.get('/test', undefined, {
      adapter: async () => {
        throw failure
      },
    })).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      cause: failure,
      message: '网络连接失败，请检查网络',
    })
  })

  it('keeps the 10000ms timeout and never retries a failed write', async () => {
    const adapter = vi.fn(responseAdapter(envelope(null, '21002')))
    await expect(http.put('/test', { version: 3 }, { adapter })).rejects.toMatchObject({ code: '21002' })
    expect(adapter).toHaveBeenCalledOnce()
    expect(adapter.mock.calls[0][0].timeout).toBe(10000)
  })
})

describe('explicit raw responses', () => {
  it.each(['head', 'options'] as const)('passes a successful %s without an R envelope', async (method) => {
    const response = await http[method]('/test', {
      adapter: responseAdapter(undefined, 204),
    })
    expect(response.status).toBe(204)
  })

  it.each(['head', 'options'] as const)('rejects failed %s with a safe HTTP error', async (method) => {
    await expect(http[method]('/test', {
      adapter: responseAdapter('<html>private</html>', 500),
    })).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
      httpStatus: 500,
    })
  })

  it('returns blob and arraybuffer payloads untouched', async () => {
    const blob = new Blob(['download'])
    const buffer = new ArrayBuffer(8)
    expect((await http.get('/test', undefined, {
      responseType: 'blob',
      adapter: responseAdapter(blob),
    })).data).toBe(blob)
    expect((await http.post('/test', {}, {
      responseType: 'arraybuffer',
      adapter: responseAdapter(buffer),
    })).data).toBe(buffer)
  })

  it.each(['blob', 'arraybuffer'] as const)('does not force a failed %s payload into R', async (responseType) => {
    await expect(request.get('/test', {
      responseType,
      adapter: responseAdapter(envelope(null, '21001'), 400),
      validateStatus: () => true,
    })).rejects.toMatchObject({ code: 'HTTP_ERROR', httpStatus: 400 })
  })
})
