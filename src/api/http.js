import request from './request'

class Http {
  get(url, params, config) {
    return request.get(url, { params, ...config })
  }

  post(url, data, config) {
    return request.post(url, data, config)
  }

  put(url, data, config) {
    return request.put(url, data, config)
  }

  delete(url, config) {
    return request.delete(url, config)
  }

  patch(url, data, config) {
    return request.patch(url, data, config)
  }

  head(url, config) {
    return request.head(url, config)
  }

  options(url, config) {
    return request.options(url, config)
  }

  upload(url, file, onProgress, config) {
    const formData = file instanceof FormData ? file : new FormData()
    if (file instanceof File) {
      formData.append('file', file)
    }
    return request.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
      ...config,
    })
  }

  download(url, filename, config) {
    return request.get(url, { responseType: 'blob', ...config }).then((response) => {
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
  }

  all(requests) {
    return Promise.all(requests)
  }

  race(requests) {
    return Promise.race(requests)
  }

  allSettled(requests) {
    return Promise.allSettled(requests)
  }
}

const http = new Http()
export default http
export { Http }
