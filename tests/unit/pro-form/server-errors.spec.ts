// @vitest-environment jsdom
import type { FormFieldSchema, ProFormExpose } from '@/types/pro-form'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { registerDefaultFieldComponents } from '@/components/pro-form/form-registry'
import ProForm from '@/components/pro-form/ProForm.vue'

const unmounts: (() => void)[] = []

afterEach(() => {
  unmounts.splice(0).forEach(unmount => unmount())
})

function field(key: string, group: string, runtime?: FormFieldSchema['runtime']): FormFieldSchema {
  return {
    meta: { field: key, label: key, valueType: 'string', required: false },
    ui: { component: 'Input', props: { 'aria-label': key }, layout: { group } },
    runtime,
  }
}

function mountForm(schema = [field('name', '基本信息'), field('email', '联系方式')]) {
  registerDefaultFieldComponents()
  const model = ref<Record<string, unknown>>({ name: 'Ada', email: 'ada@example.test' })
  const fields = ref(schema)
  const formRef = ref<ProFormExpose | null>(null)
  const onSubmit = vi.fn()
  const container = document.createElement('div')
  document.body.appendChild(container)
  const app = createApp(defineComponent({
    setup: () => () => h(ProForm, {
      'ref': formRef,
      'schema': fields.value,
      'modelValue': model.value,
      'onUpdate:modelValue': (value: Record<string, unknown>) => { model.value = value },
      onSubmit,
    }),
  }))
  app.mount(container)
  unmounts.push(() => {
    app.unmount()
    container.remove()
  })

  function input(key: string) {
    const result = container.querySelector<HTMLInputElement>(`input[aria-label="${key}"]`)
    if (!result)
      throw new Error(`Missing input: ${key}`)
    return result
  }

  function errors(key: string) {
    return input(key).closest('.el-form-item')?.querySelector('[role="alert"]')?.textContent?.trim()
  }

  async function flush() {
    await nextTick()
    await Promise.resolve()
    await nextTick()
  }

  async function change(key: string, value: string) {
    input(key).value = value
    input(key).dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
  }

  return { model, fields, formRef, container, input, errors, flush, change, onSubmit }
}

describe('pro-form server errors', () => {
  it('renders ordered messages only for exact visible schema fields and expands their groups', async () => {
    const form = mountForm([
      field('name', '基本信息'),
      field('email', '联系方式'),
      field('hidden', '隐藏', { visible: false }),
    ])
    await form.flush()
    const header = [...form.container.querySelectorAll<HTMLElement>('[role="button"]')]
      .find(button => button.textContent?.includes('联系方式'))!
    header.click()
    await form.flush()
    expect(header.getAttribute('aria-expanded')).toBe('false')
    expect(form.formRef.value).toHaveProperty('setFieldErrors', expect.any(Function))

    const values = { ...form.model.value }
    form.formRef.value!.setFieldErrors({
      'name': ['姓名无效'],
      'email': ['邮箱已被占用', '请使用其他邮箱'],
      'hidden': ['不可显示'],
      'customer.email': ['不可写入路径'],
      '__proto__.polluted': ['不可污染原型'],
    })
    await form.flush()

    expect(form.errors('name')).toBe('姓名无效')
    expect(form.errors('email')).toBe('邮箱已被占用\n请使用其他邮箱')
    expect(header.getAttribute('aria-expanded')).toBe('true')
    expect(form.container.textContent).not.toContain('不可')
    expect(form.model.value).toEqual(values)
    expect({}).not.toHaveProperty('polluted')

    form.formRef.value!.setFieldErrors({ email: ['新错误'] })
    await form.flush()
    expect(form.errors('name')).toBeUndefined()
    expect(form.errors('email')).toBe('新错误')
  })

  it('keeps server errors through unchanged blur, successful dependency validation and identical reinjection', async () => {
    const validator = vi.fn(() => true)
    const form = mountForm([
      field('name', '基本信息', {
        dependencies: ['email'],
        validation: { rules: [{ validator, message: '本地姓名错误', trigger: 'blur' }] },
      }),
      field('email', '联系方式'),
    ])
    await form.flush()
    form.formRef.value!.setFieldErrors({ name: ['服务端姓名错误'] })
    await form.flush()

    form.input('name').focus()
    await form.flush()
    form.input('name').dispatchEvent(new FocusEvent('blur', { bubbles: true }))
    await vi.waitFor(() => expect(validator).toHaveBeenCalledTimes(1))
    expect(form.errors('name')).toBe('服务端姓名错误')
    expect(form.input('name').closest('.el-form-item')?.classList.contains('is-error')).toBe(true)

    await form.change('email', 'new@example.test')
    await vi.waitFor(() => expect(validator).toHaveBeenCalledTimes(2))
    expect(form.errors('name')).toBe('服务端姓名错误')

    await expect(form.formRef.value!.validateField('name')).resolves.toBe(true)
    await form.flush()
    expect(form.errors('name')).toBe('服务端姓名错误')
    form.formRef.value!.setFieldErrors({ name: ['服务端姓名错误'] })
    await form.flush()
    expect(form.errors('name')).toBe('服务端姓名错误')

    form.formRef.value!.clearFieldErrors()
    await form.flush()
    expect(form.errors('name')).toBeUndefined()
    form.formRef.value!.setFieldErrors({ name: ['服务端姓名错误'] })
    await form.flush()
    expect(form.errors('name')).toBe('服务端姓名错误')
  })

  it('clears only the edited field and keeps errors when an input event leaves the value unchanged', async () => {
    const form = mountForm()
    await form.flush()
    form.formRef.value!.setFieldErrors({ name: ['姓名错误'], email: ['邮箱错误'] })
    await form.flush()

    await form.change('name', 'Ada')
    expect(form.errors('name')).toBe('姓名错误')
    await form.change('name', 'Grace')
    expect(form.errors('name')).toBeUndefined()
    expect(form.errors('email')).toBe('邮箱错误')
  })

  it('clears service errors by exact field scope through both clearing APIs', async () => {
    const form = mountForm()
    await form.flush()
    const errors = { name: ['姓名错误'], email: ['邮箱错误'] }
    form.formRef.value!.setFieldErrors(errors)
    form.formRef.value!.clearFieldErrors(['name', 'unknown'])
    await form.flush()
    expect(form.errors('name')).toBeUndefined()
    expect(form.errors('email')).toBe('邮箱错误')
    form.formRef.value!.clearFieldErrors([])
    await form.flush()
    expect(form.errors('email')).toBe('邮箱错误')

    form.formRef.value!.setFieldErrors(errors)
    form.formRef.value!.clearValidate('name')
    await form.flush()
    expect(form.errors('name')).toBeUndefined()
    expect(form.errors('email')).toBe('邮箱错误')
    form.formRef.value!.clearValidate(['email'])
    await form.flush()
    expect(form.errors('email')).toBeUndefined()

    form.formRef.value!.setFieldErrors(errors)
    form.formRef.value!.clearValidate([])
    await form.flush()
    expect(form.errors('name')).toBeUndefined()
    expect(form.errors('email')).toBeUndefined()
  })

  it.each(['setFieldsValue', 'resetFields', 'clearValidate', 'submit'] as const)(
    'clears every previous service error when %s starts',
    async (action) => {
      const form = mountForm()
      await form.flush()
      form.formRef.value!.setFieldErrors({ name: ['姓名错误'], email: ['邮箱错误'] })
      await form.flush()

      const methods = form.formRef.value!
      const result = action === 'setFieldsValue'
        ? methods.setFieldsValue({ name: 'Grace' })
        : methods[action]()
      await form.flush()
      expect(form.errors('name')).toBeUndefined()
      expect(form.errors('email')).toBeUndefined()
      await result
      if (action === 'submit')
        expect(form.onSubmit).toHaveBeenCalledWith(form.model.value)
    },
  )

  it.each(['replace', 'mutate'] as const)('clears only changed v-model fields when the parent uses %s', async (update) => {
    const form = mountForm()
    await form.flush()
    form.formRef.value!.setFieldErrors({ name: ['姓名错误'], email: ['邮箱错误'] })
    await form.flush()

    if (update === 'replace')
      form.model.value = { ...form.model.value, name: 'Grace' }
    else form.model.value.name = 'Grace'
    await form.flush()
    expect(form.errors('name')).toBeUndefined()
    expect(form.errors('email')).toBe('邮箱错误')
  })

  it('discards service errors for fields removed from the visible schema', async () => {
    const form = mountForm()
    await form.flush()
    form.formRef.value!.setFieldErrors({ email: ['旧邮箱错误'] })
    await form.flush()
    form.fields.value[1]!.runtime = { visible: false }
    await form.flush()
    expect(form.container.textContent).not.toContain('旧邮箱错误')
    form.fields.value[1]!.runtime.visible = true
    await form.flush()
    expect(form.errors('email')).toBeUndefined()
  })

  it('preserves local required validation before and after service errors, submission and reset', async () => {
    const nameField = field('name', '基本信息')
    nameField.meta.required = true
    const form = mountForm([nameField, field('email', '联系方式')])
    await form.flush()
    await form.change('name', '')
    await vi.waitFor(() => expect(form.errors('name')).toBe('name为必填项'))

    form.formRef.value!.setFieldErrors({ name: ['服务端姓名错误'], email: ['邮箱错误'] })
    await form.flush()
    await expect(form.formRef.value!.validateField('name')).rejects.toHaveProperty('name')
    expect(form.errors('name')).toBe('服务端姓名错误')
    form.formRef.value!.clearFieldErrors(['name'])
    await vi.waitFor(() => expect(form.errors('name')).toBe('name为必填项'))
    expect(form.errors('email')).toBe('邮箱错误')

    const formItem = form.input('name').closest<HTMLElement>('.el-form-item')!
    formItem.scrollIntoView = vi.fn()
    await form.formRef.value!.submit()
    expect(form.onSubmit).not.toHaveBeenCalled()
    expect(form.errors('name')).toBe('name为必填项')
    expect(form.errors('email')).toBeUndefined()

    form.formRef.value!.resetFields()
    await form.flush()
    expect(form.input('name').value).toBe('Ada')
    await vi.waitFor(() => expect(form.errors('name')).toBeUndefined())
  })

  it('treats declared dotted keys literally and renders messages as plain text', async () => {
    const form = mountForm([field('contact.email', '联系方式')])
    await form.flush()
    form.formRef.value!.setFieldErrors({ 'contact.email': ['<b>邮箱错误</b>'] })
    await form.flush()
    expect(form.errors('contact.email')).toBe('<b>邮箱错误</b>')
    expect(form.container.querySelector('b')).toBeNull()
    expect(form.model.value).not.toHaveProperty('contact')
    expect(form.model.value).not.toHaveProperty('contact.email')
  })

  it('clears only the edited array field when its value is mutated in place', async () => {
    const form = mountForm()
    form.model.value.name = ['Ada']
    await form.flush()
    form.formRef.value!.setFieldErrors({ name: ['姓名错误'], email: ['邮箱错误'] })
    await form.flush()
    ;(form.model.value.name as string[]).push('Grace')
    await form.flush()
    expect(form.errors('name')).toBeUndefined()
    expect(form.errors('email')).toBe('邮箱错误')
  })
})
