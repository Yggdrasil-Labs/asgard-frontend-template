import type { AxiosProgressEvent, AxiosRequestConfig, AxiosResponse, ResponseType } from 'axios'
import type { R } from '@/types/api'
import request from './request'

type JsonConfig = AxiosRequestConfig & { responseType?: Exclude<ResponseType, 'blob' | 'arraybuffer'> }
type BlobConfig = AxiosRequestConfig & { responseType: 'blob' }
type BufferConfig = AxiosRequestConfig & { responseType: 'arraybuffer' }
type JsonResponse<T> = Promise<AxiosResponse<R<T>>>
type BlobResponse = Promise<AxiosResponse<Blob>>
type BufferResponse = Promise<AxiosResponse<ArrayBuffer>>
type Query = Record<string, unknown>
type ResponsePromises = readonly Promise<AxiosResponse<unknown>>[]

class Http {
  get(url: string, params: Query | undefined, config: BlobConfig): BlobResponse
  get(url: string, params: Query | undefined, config: BufferConfig): BufferResponse
  get<T = unknown>(url: string, params?: Query, config?: JsonConfig): JsonResponse<T>
  get(url: string, params?: Query, config?: AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
    return request.get(url, { params, ...config })
  }

  post(url: string, data: unknown, config: BlobConfig): BlobResponse
  post(url: string, data: unknown, config: BufferConfig): BufferResponse
  post<T = unknown>(url: string, data?: unknown, config?: JsonConfig): JsonResponse<T>
  post(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
    return request.post(url, data, config)
  }

  put(url: string, data: unknown, config: BlobConfig): BlobResponse
  put(url: string, data: unknown, config: BufferConfig): BufferResponse
  put<T = unknown>(url: string, data?: unknown, config?: JsonConfig): JsonResponse<T>
  put(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
    return request.put(url, data, config)
  }

  delete(url: string, config: BlobConfig): BlobResponse
  delete(url: string, config: BufferConfig): BufferResponse
  delete<T = unknown>(url: string, config?: JsonConfig): JsonResponse<T>
  delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
    return request.delete(url, config)
  }

  patch(url: string, data: unknown, config: BlobConfig): BlobResponse
  patch(url: string, data: unknown, config: BufferConfig): BufferResponse
  patch<T = unknown>(url: string, data?: unknown, config?: JsonConfig): JsonResponse<T>
  patch(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
    return request.patch(url, data, config)
  }

  head(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
    return request.head(url, config)
  }

  options(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<void>> {
    return request.options(url, config)
  }

  upload<T = unknown>(
    url: string,
    file: File | FormData,
    onProgress?: (event: AxiosProgressEvent) => void,
    config?: JsonConfig,
  ): JsonResponse<T> {
    const formData = file instanceof FormData
      ? file
      : new FormData()
    if (file instanceof File)
      formData.append('file', file)
    return request.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
      ...config,
    })
  }

  async download(url: string, filename?: string, config?: AxiosRequestConfig): Promise<void> {
    const response = await this.get(url, undefined, { ...config, responseType: 'blob' })
    const downloadUrl = window.URL.createObjectURL(response.data)
    const link = document.createElement('a')
    try {
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
    }
    finally {
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    }
  }

  all<T extends ResponsePromises>(requests: readonly [...T]): Promise<{ -readonly [K in keyof T]: Awaited<T[K]> }> {
    return Promise.all(requests)
  }

  race<T extends ResponsePromises>(requests: T): Promise<Awaited<T[number]>> {
    return Promise.race(requests)
  }

  allSettled<T extends ResponsePromises>(requests: readonly [...T]): Promise<{ -readonly [K in keyof T]: PromiseSettledResult<Awaited<T[K]>> }> {
    return Promise.allSettled(requests)
  }
}

const http = new Http()
export default http
export { Http }
export type { R } from '@/types/api'
