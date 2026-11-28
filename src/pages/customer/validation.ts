import type { ValidationErrorData } from '@/types/api'

export function mapCustomerValidation(details: ValidationErrorData | undefined, visibleFields: string[]) {
  const fields: Record<string, string[]> = Object.create(null)
  const summary: string[] = []
  const visible = new Set(visibleFields)
  for (const error of details?.errors ?? []) {
    if (error.source === 'FIELD' && visible.has(error.path)) {
      fields[error.path] ??= []
      fields[error.path]!.push(error.message)
    }
    else {
      summary.push(error.message)
    }
  }
  if (details?.truncated)
    summary.push('校验错误较多，仅展示部分，请检查其余输入')
  return { fields, summary }
}
