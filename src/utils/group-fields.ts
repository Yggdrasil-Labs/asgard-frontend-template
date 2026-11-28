import type { FormFieldSchema } from '@/types/pro-form'

export const DEFAULT_FIELD_GROUP = '__default__'

/** 保持分组首次出现顺序，过滤不可见字段和空组。 */
export function groupVisibleFields(schema: FormFieldSchema[]) {
  const groups = new Map<string, FormFieldSchema[]>()
  for (const field of schema) {
    const key = field.ui.layout?.group ?? DEFAULT_FIELD_GROUP
    if (!groups.has(key))
      groups.set(key, [])
    if (field.runtime?.visible !== false)
      groups.get(key)!.push(field)
  }
  return [...groups].filter(([, fields]) => fields.length > 0).map(([key, fields]) => ({
    key,
    label: key === DEFAULT_FIELD_GROUP
      ? undefined
      : key,
    fields,
  }))
}
