import { expect, test } from '@playwright/test'
import { HomePage, LayoutShellPage } from '../pages'

test.describe('layout shell', () => {
  test('opens tabs from menu navigation', async ({ page }) => {
    const home = new HomePage(page)
    await home.navigateToHome()

    const shell = home.layoutShell()
    await shell.openMenuItem('ProForm 示例')
    await shell.expectTabVisible('ProForm 示例')
    await shell.refreshActiveTab()
    await shell.closeTab('ProForm 示例')

    await expect(page).toHaveURL('/')
    await shell.expectTabVisible('首页')
  })

  test('opens the mobile drawer from the header trigger', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const shell = new LayoutShellPage(page)
    await shell.expectDrawerHidden()
    await shell.openMobileDrawer()
    await shell.expectDrawerVisible()
    await shell.openMenuItem('ProForm 示例')
    await shell.expectTabVisible('ProForm 示例')
  })

  test('keeps icon rail navigation and main-only scrolling on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    const home = new HomePage(page)
    await home.navigateToHome()

    const shell = home.layoutShell()
    await shell.toggleDesktopCollapse()
    await shell.expectIconRailItemVisible('首页')
    await shell.openMenuItem('ProForm 示例')
    await shell.expectTabVisible('ProForm 示例')

    await shell.injectScrollableContent()
    await shell.scrollMainTo(640)
    await shell.expectMainScrollWithoutWindowScroll()
  })
})
