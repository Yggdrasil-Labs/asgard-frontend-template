import type { FormFieldSchema } from '@/types/pro-form'

export function createDemoDateFields(expiryPlaceholder: string): FormFieldSchema[] {
  return [
    ['publishDate', '发布日期', '选择日期'],
    ['expiryDate', '有效期至', expiryPlaceholder],
  ].map(([field, label, placeholder]) => ({
    meta: { field: field!, label: label!, valueType: 'date', required: false },
    ui: {
      component: 'DatePicker',
      props: { type: 'date', placeholder, valueFormat: 'YYYY-MM-DD' },
      layout: { group: '扩展信息', span: 8 },
    },
  }))
}
