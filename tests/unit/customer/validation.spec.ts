import { describe, expect, it } from 'vitest'
import { mapCustomerValidation } from '@/pages/customer/validation'

describe('customer validation mapping', () => {
  it('maps only visible exact FIELD keys and preserves order, keeping other details in summary', () => {
    const detail = (source: string, path: string, message: string) => ({ source, path, message, parameterIndex: 0, constraint: 'Validation' })
    expect(mapCustomerValidation({
      errors: [detail('FIELD', 'email', 'first'), detail('FIELD', 'email', 'second'), detail('OBJECT', '$', 'empty'), detail('FIELD', 'hidden', 'hidden error'), detail('FIELD', '__proto__', 'bad path'), detail('OTHER', 'email', 'unknown')],
      totalCount: 9,
      truncated: true,
    }, ['email'])).toEqual({
      fields: { email: ['first', 'second'] },
      summary: ['empty', 'hidden error', 'bad path', 'unknown', '校验错误较多，仅展示部分，请检查其余输入'],
    })
  })
  it('handles missing details without inventing fields', () => {
    expect(mapCustomerValidation(undefined, ['name'])).toEqual({ fields: {}, summary: [] })
  })
})
