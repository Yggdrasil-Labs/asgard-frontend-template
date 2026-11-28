import type { CreateCustomerRequest, CustomerCO, UpdateCustomerRequest } from '@/api/modules/customer'
import type { ProFormExpose } from '@/types/pro-form'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { createCustomer, getCustomer, updateCustomer } from '@/api/modules/customer'
import { ApiError } from '@/utils/api/error'
import { confirm, showError, showSuccess } from '@/utils/message'
import { reportCustomerError } from './useCustomerList'
import { mapCustomerValidation } from './validation'

function validVersion(version: unknown): version is number {
  return typeof version === 'number' && Number.isInteger(version) && version >= 0 && version <= 2147483647
}

export function useCustomerEditor(afterSave: () => Promise<void>) {
  const dialogVisible = ref(false)
  const dialogTitle = ref('新建客户')
  const editingId = ref<number | null>(null)
  const version = ref<number | null>(null)
  const formRef = ref<ProFormExpose | null>(null)
  const formValues = ref<Record<string, unknown>>({})
  const formKey = ref(0)
  const busy = ref(false)
  const conflict = ref(false)
  const deleted = ref(false)
  const notice = ref('')
  let session = 0
  const writable = computed(() => editingId.value === null || (version.value !== null && version.value < 2147483647))
  const saveDisabled = computed(() => busy.value || conflict.value || deleted.value || !writable.value)
  const current = (token: number) => token === session && dialogVisible.value
  function invalidate() {
    session++
    busy.value = false
  }
  watch(dialogVisible, (visible) => {
    if (!visible)
      invalidate()
  }, { flush: 'sync' })
  onBeforeUnmount(invalidate)

  function open(customer?: Record<string, unknown>) {
    invalidate()
    formKey.value++
    editingId.value = customer ? Number(customer.id) : null
    version.value = customer && validVersion(customer.version) ? customer.version : null
    formValues.value = customer ? { name: customer.name, email: customer.email, phone: customer.phone } : {}
    dialogTitle.value = customer ? '编辑客户' : '新建客户'
    conflict.value = false
    deleted.value = false
    notice.value = customer && !writable.value ? '数据版本不可用于更新，请重新加载客户数据或联系管理员' : ''
    dialogVisible.value = true
  }

  function saveError(error: unknown) {
    if (!(error instanceof ApiError) || (error.httpStatus !== 200 && error.httpStatus !== 400)) {
      reportCustomerError(error, '保存失败，请稍后重试')
      return
    }
    if (error.httpStatus === 200 && error.code === '21002') {
      conflict.value = true
      notice.value = '数据已被修改，请刷新并重新编辑；未保存输入已保留'
    }
    else if (error.httpStatus === 200 && error.code === '21001') {
      formRef.value?.setFieldErrors({ email: [error.message] })
    }
    else if (error.code === '00004') {
      const mapped = mapCustomerValidation(error.details, ['name', 'email', 'phone'])
      formRef.value?.setFieldErrors(mapped.fields)
      if (mapped.summary.length || !Object.keys(mapped.fields).length)
        showError(mapped.summary.join('；') || error.message)
    }
    else if (error.httpStatus === 200 && error.code === '20001') {
      deleted.value = true
      notice.value = '客户已不存在，请关闭并刷新列表'
    }
    else {
      reportCustomerError(error, '保存失败，请稍后重试')
    }
  }

  async function handleFormSubmit(values: Record<string, unknown>) {
    if (saveDisabled.value || !dialogVisible.value)
      return
    const token = session
    busy.value = true
    formRef.value?.clearFieldErrors()
    try {
      const fields = {
        name: values.name != null ? String(values.name) : undefined,
        email: values.email != null ? String(values.email) : undefined,
        phone: values.phone == null ? null : String(values.phone),
      }
      if (editingId.value !== null) {
        const payload: UpdateCustomerRequest = { ...fields, version: version.value! }
        await updateCustomer(editingId.value, payload)
      }
      else {
        const payload: CreateCustomerRequest = { name: fields.name ?? '', email: fields.email ?? '', phone: fields.phone ?? undefined }
        await createCustomer(payload)
      }
      if (!current(token))
        return
      showSuccess(editingId.value === null ? '创建成功' : '更新成功')
      dialogVisible.value = false
      await afterSave()
    }
    catch (error) {
      if (current(token))
        saveError(error)
    }
    finally {
      if (current(token))
        busy.value = false
    }
  }

  async function handleFormConfirm() {
    if (saveDisabled.value)
      return
    try {
      await formRef.value?.submit()
    }
    catch (error) { reportCustomerError(error, '表单校验失败') }
  }

  async function refreshConflict() {
    if (busy.value || editingId.value === null || !conflict.value)
      return
    const token = session
    const id = editingId.value
    busy.value = true
    try {
      try {
        await confirm({ title: '刷新客户', message: '刷新将放弃未保存的输入，是否继续？', confirmText: '刷新', cancelText: '保留输入' })
      }
      catch { return }
      if (!current(token))
        return
      const response = await getCustomer(id)
      if (!current(token))
        return
      const customer: CustomerCO | null = response.data.data
      if (!customer || customer.id !== id || !validVersion(customer.version))
        throw new ApiError('客户详情缺少有效版本', { code: 'PROTOCOL_ERROR', httpStatus: response.status })
      formValues.value = { name: customer.name, email: customer.email, phone: customer.phone }
      version.value = customer.version
      formKey.value++
      conflict.value = false
      notice.value = writable.value ? '' : '数据版本已耗尽，无法继续更新，请联系管理员'
    }
    catch (error) {
      if (!current(token))
        return
      if (error instanceof ApiError && error.httpStatus === 200 && error.code === '20001') {
        deleted.value = true
        notice.value = '客户已不存在，请关闭并刷新列表'
      }
      else {
        reportCustomerError(error, '刷新失败，未保存输入已保留')
      }
    }
    finally {
      if (current(token))
        busy.value = false
    }
  }
  return { dialogVisible, dialogTitle, formRef, formValues, formKey, busy, conflict, deleted, notice, saveDisabled, openCreate: () => open(), openEdit: (customer: Record<string, unknown>) => open(customer), handleFormConfirm, handleFormSubmit, refreshConflict }
}
