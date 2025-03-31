const { Before, BeforeAll, AfterAll, After, setDefaultTimeout } = require('@cucumber/cucumber')
const config = require('./config')
const { chromium } = require('@playwright/test')
const { cleanupResources } = require('./utils/fileHelper')

// default timeout (in milliseconds)
setDefaultTimeout(config.timeout * 1000)

// launch the browser
BeforeAll(async function () {
  global.browser = await chromium.launch({
    headless: config.headless,
    slowMo: config.slowMo
  })
})

// close the browser
AfterAll(async function () {
  await global.browser.close()
})

// Create a new browser context and page per scenario
Before(async function () {
  global.context = await global.browser.newContext({ ignoreHTTPSErrors: true, locale: 'en-US' })
  global.page = await global.context.newPage()
})

// Cleanup after each scenario
After(async function () {
  await global.page.close()
  await global.context.close()
  await cleanupResources()
})
