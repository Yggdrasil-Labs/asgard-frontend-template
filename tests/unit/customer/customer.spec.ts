// @vitest-environment jsdom
import type { App } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import CustomerPage from '@/pages/customer.vue'

const api = vi.hoisted(() => ({
  createCustomer: vi.fn(),
  listCustomers: vi.fn(),
  updateCustomer: vi.fn(),
  getCustomer: vi.fn(),
  deleteCustomer: vi.fn(),
}))
const messages = vi.hoisted(() => ({
  confirm: vi.fn(),
  showError: vi.fn(),
  showSuccess: vi.fn(),
}))
vi.mock('@/api/modules/customer', () => api)
vi.mock('@/utils/message', () => messages)
// 使用真实 ProForm、ProDialog；表格和搜索容器仅模拟其公开事件。
vi.mock('@/components/pro-table', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    registerDefaultColumnComponents: () => {},
    ProTable: defineComponent({
      props: ['data', 'columns', 'pagination'],
      emits: ['update:pagination'],
      setup(props, { slots, emit }) {
        return () => h('section', [
          slots['toolbar-prefix']?.(),
          h('span', { 'data-testid': 'page' }, `${props.pagination.page}/${props.pagination.total}`),
          h('button', {
            onClick: () => emit('update:pagination', { ...props.pagination, page: props.pagination.page + 1 }),
          }, '下一页'),
          ...props.data.map((row: Record<string, unknown>) => h('article', [
            h('span', String(row.name)),
            ...props.columns.find((col: { meta: { field: string } }) => col.meta.field === '_actions').runtime.actions.map((action: { label: string, onClick: (row: Record<string, unknown>) => void }) => h('button', {
              onClick: () => action.onClick(row),
            }, action.label)),
          ])),
        ])
      },
    }),
  }
})
vi.mock('@/components/search-bar', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    registerDefaultSearchFieldComponents: () => {},
    SearchBar: defineComponent({
      emits: ['search'],
      setup(_, { emit }) {
        return () => h('button', {
          onClick: () => emit('search'),
        }, '搜索')
      },
    }),
  }
})

const row = {
  id: 42,
  name: '张三',
  email: 'one@example.com',
  phone: null,
  status: 'ACTIVE',
  version: 3,
}
function response<T>(data: T) {
  return {
    data: {
      code: '00000',
      message: '成功',
      data,
      timestamp: 1,
      traceId: null,
      success: true,
    },
    status: 200,
  }
}
function page(data = [row], pageIndex = 1, totalCount = 1) {
  return response({
    data,
    pageIndex,
    pageSize: 10,
    totalCount,
    totalPages: Math.ceil(totalCount / 10),
    hasNext: false,
    hasPrevious: pageIndex > 1,
  })
}
let app: App | undefined
async function flush() {
  for (let i = 0; i < 8; i++) {
    await new Promise(resolve => setTimeout(resolve, 0))
    await nextTick()
  }
}
async function mount() {
  const host = document.createElement('div')
  document.body.append(host)
  app = createApp(CustomerPage)
  app.mount(host)
  await flush()
}
function button(label: string) {
  const found = [
    ...document.querySelectorAll('button'),
  ].find(el => el.textContent?.trim() === label)
  if (!found)
    throw new Error(`Button not found: ${label}`)
  return found
}
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

beforeEach(() => {
  vi.resetAllMocks()
  api.listCustomers.mockResolvedValue(page())
  api.updateCustomer.mockResolvedValue(response({ ...row, version: 4 }))
  api.createCustomer.mockResolvedValue(response(row))
  api.getCustomer.mockResolvedValue(response({ ...row, version: 4, name: '新数据' }))
  api.deleteCustomer.mockResolvedValue(response(null))
  messages.confirm.mockResolvedValue('confirm')
})
afterEach(() => {
  app?.unmount()
  app = undefined
  document.body.innerHTML = ''
})

describe('customer contract consumption', () => {
  it('sends wire pagination and preserves the version read from the list when saving', async () => {
    await mount()
    expect(api.listCustomers).toHaveBeenCalledWith(expect.objectContaining({ pageIndex: 1, pageSize: 10 }))
    button('编辑').click()
    await flush()
    button('保存').click()
    await flush()
    expect(api.updateCustomer).toHaveBeenCalledWith(42, expect.objectContaining({ version: 3 }))
    expect(messages.showSuccess).toHaveBeenCalledWith('更新成功')
  })

  it('keeps input on conflict and only replaces it after an explicitly confirmed successful refresh', async () => {
    const { ApiError } = await import('@/utils/api/error')
    api.updateCustomer.mockRejectedValueOnce(new ApiError('数据已变化', { code: '21002', httpStatus: 200 }))
    await mount()
    button('编辑').click()
    await flush()
    button('保存').click()
    await flush()
    expect(document.body.textContent).toContain('数据已被修改')
    expect((document.querySelector('input') as HTMLInputElement).value).toBe('张三')
    messages.confirm.mockRejectedValueOnce('cancel')
    button('刷新并重新编辑').click()
    await flush()
    expect(api.getCustomer).not.toHaveBeenCalled()
    button('刷新并重新编辑').click()
    await flush()
    expect(api.getCustomer).toHaveBeenCalledWith(42)
    expect((document.querySelector('input') as HTMLInputElement).value).toBe('新数据')
    button('保存').click()
    await flush()
    expect(api.updateCustomer).toHaveBeenLastCalledWith(42, expect.objectContaining({ version: 4 }))
  })

  it('prevents duplicate save and ignores a closed session response', async () => {
    const pending = deferred<ReturnType<typeof response<typeof row>>>()
    api.updateCustomer.mockReturnValueOnce(pending.promise)
    await mount()
    button('编辑').click()
    await flush()
    button('保存').click()
    await flush()
    expect(button('保存').disabled).toBe(true)
    expect((document.querySelector('input') as HTMLInputElement).disabled).toBe(true)
    button('取消').click()
    await flush()
    button('新建客户').click()
    await flush()
    pending.resolve(response(row))
    await flush()
    expect(messages.showSuccess).not.toHaveBeenCalled()
    expect(document.body.textContent).toContain('新建客户')
    expect((document.querySelector('input') as HTMLInputElement).value).toBe('')
  })
  it('keeps server field errors until input changes', async () => {
    const { ApiError } = await import('@/utils/api/error')
    api.updateCustomer.mockRejectedValueOnce(new ApiError('邮箱已被占用', { code: '21001', httpStatus: 200 }))
    await mount()
    button('编辑').click()
    await flush()
    button('保存').click()
    await flush()
    expect(document.body.textContent).toContain('邮箱已被占用')
    const email = document.querySelector('input[placeholder="请输入邮箱"]') as HTMLInputElement
    email.dispatchEvent(new Event('blur'))
    await flush()
    expect(document.body.textContent).toContain('邮箱已被占用')
    email.value = 'other@example.com'
    email.dispatchEvent(new Event('input'))
    await flush()
    expect(document.body.textContent).not.toContain('邮箱已被占用')
  })

  it('keeps a failed refresh in conflict state and differentiates a protocol 404', async () => {
    const { ApiError } = await import('@/utils/api/error')
    api.updateCustomer.mockRejectedValueOnce(new ApiError('冲突', { code: '21002', httpStatus: 200 }))
    api.getCustomer.mockRejectedValueOnce(new ApiError('not found', { code: '20001', httpStatus: 404 }))
    await mount()
    button('编辑').click()
    await flush()
    button('保存').click()
    await flush()
    button('刷新并重新编辑').click()
    await flush()
    expect(messages.showError).toHaveBeenCalledWith('接口路径不存在，请联系管理员')
    expect(button('保存').disabled).toBe(true)
    expect((document.querySelector('input') as HTMLInputElement).value).toBe('张三')
  })

  it('marks a deleted conflict record as unsavable', async () => {
    const { ApiError } = await import('@/utils/api/error')
    api.updateCustomer.mockRejectedValueOnce(new ApiError('冲突', { code: '21002', httpStatus: 200 }))
    api.getCustomer.mockRejectedValueOnce(new ApiError('不存在', { code: '20001', httpStatus: 200 }))
    await mount()
    button('编辑').click()
    await flush()
    button('保存').click()
    await flush()
    button('刷新并重新编辑').click()
    await flush()
    expect(document.body.textContent).toContain('客户已不存在')
    expect(button('保存').disabled).toBe(true)
  })

  it('invalidates a slow conflict refresh when the dialog closes', async () => {
    const { ApiError } = await import('@/utils/api/error')
    const pending = deferred<ReturnType<typeof response<typeof row>>>()
    api.updateCustomer.mockRejectedValueOnce(new ApiError('冲突', { code: '21002', httpStatus: 200 }))
    api.getCustomer.mockReturnValueOnce(pending.promise)
    await mount()
    button('编辑').click()
    await flush()
    button('保存').click()
    await flush()
    button('刷新并重新编辑').click()
    await flush()
    expect((document.querySelector('input') as HTMLInputElement).disabled).toBe(true)
    button('取消').click()
    await flush()
    button('新建客户').click()
    await flush()
    pending.resolve(response({ ...row, name: '不应覆盖新会话' }))
    await flush()
    expect((document.querySelector('input') as HTMLInputElement).value).toBe('')
  })

  it.each([undefined, -1, 2147483647])('never defaults invalid or exhausted version %s to zero', async (version) => {
    api.listCustomers.mockResolvedValueOnce(page([
      { ...row, version: version as number },
    ]))
    await mount()
    button('编辑').click()
    await flush()
    expect(button('保存').disabled).toBe(true)
    expect(api.updateCustomer).not.toHaveBeenCalled()
  })

  it('roundtrips null phone as no-change and empty text as an explicit clear', async () => {
    await mount()
    button('编辑').click()
    await flush()
    button('保存').click()
    await flush()
    expect(api.updateCustomer).toHaveBeenCalledWith(42, expect.objectContaining({ phone: null }))
    button('编辑').click()
    await flush()
    const phone = document.querySelector('input[placeholder="请输入电话"]') as HTMLInputElement
    phone.value = '123'
    phone.dispatchEvent(new Event('input'))
    await flush()
    phone.value = ''
    phone.dispatchEvent(new Event('input'))
    await flush()
    button('保存').click()
    await flush()
    // null 渲染为空字符串时不会触发输入事件，需模拟用户实际修改。
    expect(api.updateCustomer).toHaveBeenLastCalledWith(42, expect.objectContaining({ phone: '' }))
  })

  it('creates once and does not report a successful write as failed if the subsequent list reload fails', async () => {
    await mount()
    button('新建客户').click()
    await flush()
    const name = document.querySelector('input[placeholder="请输入姓名"]') as HTMLInputElement
    const email = document.querySelector('input[placeholder="请输入邮箱"]') as HTMLInputElement
    name.value = '李四'
    name.dispatchEvent(new Event('input'))
    await flush()
    email.value = 'two@example.com'
    email.dispatchEvent(new Event('input'))
    await flush()
    api.listCustomers.mockRejectedValueOnce(new Error('offline'))
    button('保存').click()
    await flush()
    expect(api.createCustomer).toHaveBeenCalledTimes(1)
    expect(messages.showSuccess).toHaveBeenCalledWith('创建成功')
    expect(messages.showError).toHaveBeenCalledWith('列表加载失败，请稍后重试')
  })

  it('uses corrected page metadata without firing its pagination watcher again', async () => {
    api.listCustomers.mockResolvedValueOnce(page([row], 2, 23))
    await mount()
    expect(document.querySelector('[data-testid="page"]')?.textContent).toBe('2/23')
    expect(api.listCustomers).toHaveBeenCalledTimes(1)
  })

  it.each([
    { code: 'ERR_CANCELED' },
    { __CANCEL__: true },
  ])('only applies the latest list response and keeps existing records on failure or cancel %j', async (cancel) => {
    const { ApiError } = await import('@/utils/api/error')
    await mount()
    const stale = deferred<ReturnType<typeof page>>()
    api.listCustomers.mockReturnValueOnce(stale.promise).mockResolvedValueOnce(page([
      { ...row, name: '最新' },
    ], 3, 30))
    button('下一页').click()
    await flush()
    button('下一页').click()
    await flush()
    stale.resolve(page([
      { ...row, name: '过期' },
    ], 2, 30))
    await flush()
    expect(document.body.textContent).toContain('最新')
    expect(document.body.textContent).not.toContain('过期')
    api.listCustomers.mockRejectedValueOnce(new ApiError('offline', { code: 'NETWORK_ERROR' }))
    button('搜索').click()
    await flush()
    expect(document.body.textContent).toContain('最新')
    expect(messages.showError).toHaveBeenCalledWith('offline')
    messages.showError.mockClear()
    api.listCustomers.mockRejectedValueOnce(cancel)
    button('搜索').click()
    await flush()
    expect(messages.showError).not.toHaveBeenCalled()
  })

  it('repairs an empty last page exactly once after deleting and never retries the write', async () => {
    api.listCustomers.mockResolvedValueOnce(page([row], 2, 11))
    await mount()
    api.listCustomers.mockResolvedValueOnce(page([], 2, 10)).mockResolvedValueOnce(page([row], 1, 10))
    button('删除').click()
    await flush()
    expect(api.deleteCustomer).toHaveBeenCalledTimes(1)
    expect(api.listCustomers).toHaveBeenCalledTimes(3)
    expect(document.querySelector('[data-testid="page"]')?.textContent).toBe('1/10')
    expect(messages.showSuccess).toHaveBeenCalledWith('删除成功')
  })
  it('shows field validation and unlocated/truncated errors without losing the edit', async () => {
    const { ApiError } = await import('@/utils/api/error')
    api.updateCustomer.mockRejectedValueOnce(new ApiError('校验失败', {
      code: '00004',
      httpStatus: 400,
      details: {
        errors: [
          {
            source: 'FIELD',
            path: 'email',
            parameterIndex: 0,
            constraint: 'Email',
            message: '邮箱格式错误',
          },
          {
            source: 'OBJECT',
            path: '$',
            parameterIndex: 0,
            constraint: 'Validation',
            message: '整体校验失败',
          },
          {
            source: 'FIELD',
            path: 'version',
            parameterIndex: 0,
            constraint: 'Max',
            message: '版本参数错误',
          },
        ],
        totalCount: 5,
        truncated: true,
      },
    }))
    await mount()
    button('编辑').click()
    await flush()
    button('保存').click()
    await flush()
    expect(document.body.textContent).toContain('邮箱格式错误')
    expect(messages.showError).toHaveBeenCalledWith('整体校验失败；版本参数错误；校验错误较多，仅展示部分，请检查其余输入')
    expect((document.querySelector('input') as HTMLInputElement).value).toBe('张三')
  })

  it('blocks an empty new form using the real local validator', async () => {
    await mount()
    button('新建客户').click()
    await flush()
    button('保存').click()
    await new Promise(resolve => setTimeout(resolve, 400))
    await flush()
    expect(api.createCustomer).not.toHaveBeenCalled()
    expect(document.body.textContent).toContain('姓名')
  })

  it('does not claim deletion succeeded when the backend rejects it', async () => {
    const { ApiError } = await import('@/utils/api/error')
    api.deleteCustomer.mockRejectedValueOnce(new ApiError('客户不存在', { code: '20001', httpStatus: 200 }))
    await mount()
    button('删除').click()
    await flush()
    expect(messages.showError).toHaveBeenCalledWith('客户不存在')
    expect(messages.showSuccess).not.toHaveBeenCalled()
    expect(api.listCustomers).toHaveBeenCalledTimes(1)
  })
})
