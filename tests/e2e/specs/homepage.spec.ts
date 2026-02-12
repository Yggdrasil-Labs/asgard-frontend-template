import { test } from '@playwright/test'
import { HomePage } from '../pages/HomePage'

test.describe('首页功能测试', () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.navigateToHome()
  })

  test('页面基本内容验证', async () => {
    await homePage.verifyPageTitle()
    await homePage.verifyNavbar()
    await homePage.verifyHeroSection()
    await homePage.verifyFeatureCards()
  })

  test('功能交互测试', async () => {
    await homePage.verifyVueUseDemo()
    await homePage.verifyEnvironmentInfo()
  })

  test('响应式设计验证', async () => {
    await homePage.verifyResponsiveDesign()
  })
})
