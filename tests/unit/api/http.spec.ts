// @vitest-environment jsdom
import type { AxiosResponse } from 'axios'
import type { R } from '@/types/api'
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import http from '@/utils/api/http'
import { envelope, responseAdapter } from './adapter'

afterEach(() => vi.restoreAllMocks())

describe('public HTTP helpers', () => {
  it('keeps JSON methods typed and passes their real transformed bodies', async () => {
    const adapter = responseAdapter(envelope('ok'))
    const calls = [
      http.get<string>('/test', undefined, { adapter }),
      http.post<string>('/test', {}, { adapter }),
      http.put<string>('/test', {}, { adapter }),
      http.patch<string>('/test', {}, { adapter }),
      http.delete<string>('/test', { adapter }),
      http.upload<string>('/test', new File(['sample'], 'sample.txt'), undefined, { adapter }),
    ]
    expectTypeOf(calls).toEqualTypeOf<Promise<AxiosResponse<R<string>>>[]>()
    for (const response of await http.all(calls))
      expect(response.data.data).toBe('ok')
  })

  it('uploads FormData and keeps the progress handler', async () => {
    const form = new FormData()
    form.append('field', 'value')
    const progress = vi.fn()
    await http.upload('/test', form, progress, {
      adapter: responseAdapter(envelope(), 200, {}, (config) => {
        expect(config.data).toBe(form)
        expect(config.onUploadProgress).toBe(progress)
      }),
    })
  })

  it('retains the response types of mixed JSON and raw concurrent requests', async () => {
    const json = http.get<number>('/test', undefined, {
      adapter: responseAdapter(envelope(42)),
    })
    const blob = http.get('/test', undefined, {
      responseType: 'blob',
      adapter: responseAdapter(new Blob(['a'])),
    })
    const head = http.head('/test', {
      adapter: responseAdapter(undefined, 204),
    })
    const buffer = http.put('/test', undefined, {
      responseType: 'arraybuffer',
      adapter: responseAdapter(new ArrayBuffer(8)),
    })
    const options = http.options('/test', {
      adapter: responseAdapter(undefined, 204),
    })
    expectTypeOf(buffer).toEqualTypeOf<Promise<AxiosResponse<ArrayBuffer>>>()
    expectTypeOf(options).toEqualTypeOf<Promise<AxiosResponse<void>>>()
    const results = await http.all([json, blob, head])
    expectTypeOf(results).toEqualTypeOf<[AxiosResponse<R<number>>, AxiosResponse<Blob>, AxiosResponse<void>]>()
    expect(results[0].data.data).toBe(42)
    const raced = http.race([json, blob] as const)
    expectTypeOf(raced).toEqualTypeOf<Promise<AxiosResponse<R<number>> | AxiosResponse<Blob>>>()
    const settled = await http.allSettled([
      json,
      blob,
      Promise.reject(new Error('failed')),
    ])
    expectTypeOf(settled[0]).toEqualTypeOf<PromiseSettledResult<AxiosResponse<R<number>>>>()
    expect(settled.map(result => result.status)).toEqual(['fulfilled', 'fulfilled', 'rejected'])
    await Promise.all([buffer, options, raced])
  })

  it('downloads through explicit blob semantics and releases the object URL', async () => {
    const create = vi.fn(() => 'blob:test')
    const revoke = vi.fn()
    Object.defineProperty(window.URL, 'createObjectURL', { configurable: true, value: create })
    Object.defineProperty(window.URL, 'revokeObjectURL', { configurable: true, value: revoke })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const blob = new Blob(['download'])
    await http.download('/test', 'test.txt', {
      responseType: 'json',
      adapter: responseAdapter(blob),
    })
    expect(create).toHaveBeenCalledWith(blob)
    expect(click).toHaveBeenCalledOnce()
    expect(revoke).toHaveBeenCalledWith('blob:test')
    expect(document.querySelector('a')).toBeNull()
  })
})
