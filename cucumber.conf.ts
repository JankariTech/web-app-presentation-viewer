import {Before, BeforeAll, AfterAll, After, setDefaultTimeout} from "@cucumber/cucumber"

import { chromium, firefox } from "playwright"

// default timeout(in milliseconds)
setDefaultTimeout(60000)

// launch the browser
BeforeAll(async function () {
  global.browser = await firefox.launch({
      headless: false,
      slowMo: 1000,
  });
});

// close the browser
AfterAll(async function () {
  await global.browser.close();
});


// Create a new browser context and page per scenario
Before(async function () {
  global.context = await global.browser.newContext();
  global.page = await global.context.newPage();
});

// Cleanup after each scenario
After(async function () {
  await global.page.close();
  await global.context.close();
});
