const { Given, When, Then } = require('@cucumber/cucumber')
const { expect } = require('@playwright/test')
const { PresentationViewer } = require('../pageObjects/PresentationViewerPage')
const { uploadFile } = require('../utils/helpers')
const { getUserCredentials } = require('../utils/getUserCredentials')
const { Ocis } = require('../pageObjects/OcisPage')

const presentationViewer = new PresentationViewer()
const ocis = new Ocis()

Given('user {string} has logged in', async function (user) {
  await ocis.navigateToLoginPage()
  const { username, password } = getUserCredentials(user)
  await ocis.login(username, password)
  await expect(page.locator(ocis.filesContainerSelector)).toBeVisible()
})

Given('user {string} has uploaded the markdown file {string}', async function (user, fileName) {
  await uploadFile(fileName, user)
  await page.reload()
})

When(
  'user {string} previews a markdown file {string} in presentation viewer',
  async function (user, fileName) {
    await ocis.openMDFileInPresentationViewer()
    await expect(page.locator(presentationViewer.presentationViewerHomepageSelector)).toBeVisible()
  }
)

Then(
  'markdown file {string} should be opened and rendered in the presentation viewer',
  async function (fileName) {
    await expect(page.locator(presentationViewer.slidesContainerSelector)).toBeVisible()
  }
)
