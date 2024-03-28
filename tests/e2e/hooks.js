const { Before, BeforeAll, AfterAll, After, setDefaultTimeout } = require('@cucumber/cucumber')
const { deleteFile } = require('./utils/helpers')
const { config } = require('./config')
const { chromium } = require('@playwright/test')
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
  global.context = await global.browser.newContext({ ignoreHTTPSErrors: true })
  global.page = await global.context.newPage()
})

// Cleanup after each scenario
After(async function () {
  await global.page.close()
  await global.context.close()
  await deleteFile()
})
