import type { FormFieldSchema } from '@/types/pro-form'
import { describe, expect, it } from 'vitest'
import { groupVisibleFields } from '@/utils/group-fields'

function field(name: string, group?: string, visible = true): FormFieldSchema {
  return {
    meta: {
      field: name,
      label: name,
      valueType: 'string',
      required: false,
    },
    ui: {
      component: 'Input',
      layout: { group },
    },
    runtime: { visible },
  }
}

describe('groupVisibleFields', () => {
  it('preserves first group order including initially hidden fields and omits empty groups', () => {
    const hidden = field('hidden', 'second', false)
    const visible = field('visible', 'second')
    const defaultField = field('default')
    const input = [
      hidden,
      defaultField,
      visible,
      field('empty', 'empty', false),
    ]
    expect(groupVisibleFields(input)).toEqual([
      {
        key: 'second',
        label: 'second',
        fields: [visible],
      },
      {
        key: '__default__',
        label: undefined,
        fields: [defaultField],
      },
    ])
    expect(input).toHaveLength(4)
  })
  it('handles empty input and keeps visible field identity', () => {
    const value = field('value')
    expect(groupVisibleFields([])).toEqual([])
    expect(groupVisibleFields([value])[0]?.fields[0]).toBe(value)
  })
})
