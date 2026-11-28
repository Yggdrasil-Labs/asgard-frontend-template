import type { ProTablePaginationState } from '@/types/pro-table'
import axios from 'axios'
import { onBeforeUnmount, ref, watch } from 'vue'
import { listCustomers } from '@/api/modules/customer'
import { ApiError } from '@/utils/api/error'
import { extractPaginatedData } from '@/utils/api/utils'
import { showError } from '@/utils/message'

export function reportCustomerError(error: unknown, fallback: string) {
  if (axios.isCancel(error) || (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_CANCELED'))
    return
  if (error instanceof ApiError) {
    showError(error.httpStatus === 404 ? '接口路径不存在，请联系管理员' : error.message)
    return
  }
  showError(fallback)
}

export function useCustomerList() {
  const loading = ref(false)
  const tableData = ref<Record<string, unknown>[]>([])
  const pagination = ref<ProTablePaginationState>({ page: 1, pageSize: 10, total: 0 })
  const searchValues = ref<Record<string, unknown>>({})
  let sequence = 0
  let syncing = false
  let alive = true
  onBeforeUnmount(() => {
    alive = false
    sequence++
  })

  async function fetchData(repairEmpty = true) {
    const request = ++sequence
    loading.value = true
    try {
      const keyword = String(searchValues.value.keyword ?? '').trim()
      const status = String(searchValues.value.status ?? '').trim()
      const response = await listCustomers({ pageIndex: pagination.value.page, pageSize: pagination.value.pageSize, keyword: keyword || undefined, status: status || undefined })
      if (!alive || request !== sequence)
        return
      const result = extractPaginatedData(response)
      tableData.value = result.data.map(customer => ({ ...customer }))
      syncing = true
      pagination.value = { page: result.pageIndex, pageSize: result.pageSize, total: result.totalCount }
      syncing = false
      const last = Math.max(1, Math.ceil(result.totalCount / result.pageSize))
      if (repairEmpty && result.data.length === 0 && result.pageIndex > last) {
        syncing = true
        pagination.value = { ...pagination.value, page: last }
        syncing = false
        await fetchData(false)
      }
    }
    catch (error) {
      if (alive && request === sequence)
        reportCustomerError(error, '列表加载失败，请稍后重试')
    }
    finally {
      if (alive && request === sequence)
        loading.value = false
    }
  }

  function fetchFromFirstPage() {
    if (pagination.value.page === 1)
      void fetchData()
    else pagination.value = { ...pagination.value, page: 1 }
  }
  watch(() => [pagination.value.page, pagination.value.pageSize], () => {
    if (!syncing)
      void fetchData()
  }, { flush: 'sync' })
  void fetchData()
  return { loading, tableData, pagination, searchValues, fetchData, fetchFromFirstPage }
}
