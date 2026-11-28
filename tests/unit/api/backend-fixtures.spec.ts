import type { CustomerCO } from '@/api/modules/customer'
import type { PageResult } from '@/types/api'
import { describe, expect, it } from 'vitest'
import { isR, isValidationErrorData } from '@/types/api'
import http from '@/utils/api/http'
import { extractPaginatedData } from '@/utils/api/utils'
import businessMissing from '../../fixtures/api-contract-r/business-20001.json'
import duplicateEmail from '../../fixtures/api-contract-r/business-21001.json'
import versionConflict from '../../fixtures/api-contract-r/business-21002.json'
import malformedJson from '../../fixtures/api-contract-r/malformed-json.json'
import emptyPage from '../../fixtures/api-contract-r/page-empty.json'
import largePage from '../../fixtures/api-contract-r/page-large-total.json'
import page from '../../fixtures/api-contract-r/page.json'
import protocolMissing from '../../fixtures/api-contract-r/protocol-404.json'
import created from '../../fixtures/api-contract-r/success-create.json'
import deleted from '../../fixtures/api-contract-r/success-delete.json'
import detail from '../../fixtures/api-contract-r/success-detail.json'
import updated from '../../fixtures/api-contract-r/success-update.json'
import systemFailure from '../../fixtures/api-contract-r/system-500.json'
import fieldErrors from '../../fixtures/api-contract-r/validation-field.json'
import objectErrors from '../../fixtures/api-contract-r/validation-object.json'
import versionErrors from '../../fixtures/api-contract-r/validation-version.json'
import { responseAdapter } from './adapter'

// 样例来源及 HTTP 元数据见 tests/fixtures/api-contract-r/README.md。
// 这些后端隔离测试响应不证明实际服务运行或数据库集成已通过验证。
describe('backend standalone fixtures through Axios', () => {
  it.each([
    ['create', created],
    ['detail', detail],
    ['update', updated],
    ['delete', deleted],
  ])('consumes the %s success envelope intact', async (_scenario, fixture) => {
    expect(isR(fixture)).toBe(true)
    const response = await http.get('/fixture', undefined, { adapter: responseAdapter(fixture) })
    expect(response.data).toEqual(fixture)
  })

  it.each([
    ['page', page],
    ['empty', emptyPage],
    ['large total', largePage],
  ])('consumes the %s nested pagination without truncating numbers', async (_scenario, fixture) => {
    const response = await http.get<PageResult<CustomerCO>>('/fixture', undefined, { adapter: responseAdapter(fixture) })
    expect(extractPaginatedData(response)).toEqual(fixture.data)
    expect(Array.isArray(extractPaginatedData(response).data)).toBe(true)
  })

  it.each([
    ['business missing', businessMissing, 200],
    ['duplicate email', duplicateEmail, 200],
    ['version conflict mapping', versionConflict, 200],
    ['field errors', fieldErrors, 400],
    ['object errors', objectErrors, 400],
    ['version errors', versionErrors, 400],
    ['protocol missing', protocolMissing, 404],
    ['system failure', systemFailure, 500],
    ['malformed request JSON', malformedJson, 400],
  ] as const)('preserves %s metadata', async (_scenario, fixture, status) => {
    await expect(http.get('/fixture', undefined, { adapter: responseAdapter(fixture, status) })).rejects.toMatchObject({
      code: fixture.code,
      message: fixture.message,
      httpStatus: status,
      traceId: fixture.traceId,
      details: isValidationErrorData(fixture.data) ? fixture.data : undefined,
    })
  })
})
