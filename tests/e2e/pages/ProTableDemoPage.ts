import type { Page } from '@playwright/test'

/**
 * ProTable 示例页
 */
export class ProTableDemoPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/pro-table-demo')
  }

  root() {
    return this.page.getByTestId('pro-table-demo')
  }

  tableBodyRows() {
    return this.root().locator('.el-table__body-wrapper tbody tr')
  }

  async clickClearData() {
    await this.page.getByTestId('pro-table-demo-clear-data').click()
  }

  async clickRestoreData() {
    await this.page.getByTestId('pro-table-demo-restore-data').click()
  }

  async clickPaginationNext() {
    await this.root().getByTestId('pro-table-pagination').locator('.btn-next').click()
  }

  async clickSimulateError() {
    await this.page.getByTestId('pro-table-demo-trigger-error').click()
  }

  async clickRetry() {
    await this.root().getByTestId('pro-table-retry').click()
  }

  batchCount() {
    return this.page.getByTestId('pro-table-demo-batch')
  }

  rowClickCount() {
    return this.page.getByTestId('pro-table-demo-row-click-count')
  }

  lastAction() {
    return this.page.getByTestId('pro-table-demo-last-action')
  }

  async toggleRowSelection(index: number) {
    await this.tableBodyRows()
      .nth(index)
      .locator('.el-checkbox')
      .first()
      .click()
  }

  /** 名称列（示例页带自定义插槽 ★） */
  firstNameCell() {
    return this.page.getByTestId('pro-table-demo-custom-name').first()
  }

  firstLinkCell() {
    return this.page.getByTestId('pro-table-cell-link').first()
  }

  async dispatchClickOnFirstLinkCell() {
    await this.firstLinkCell().dispatchEvent('click')
  }

  firstInlineActionButton() {
    return this.tableBodyRows().first().getByRole('button', { name: '查看' })
  }

  async dispatchClickOnFirstInlineActionButton() {
    await this.firstInlineActionButton().dispatchEvent('click')
  }
}
