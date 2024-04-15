const { Given, When, Then } = require('@cucumber/cucumber')
const { expect } = require('@playwright/test')
const { getUserCredentials } = require('../utils/userHelper')
const { uploadFile } = require('../utils/fileHelper')
const PresentationViewer = require('../pageObjects/PresentationViewerPage')
const Ocis = require('../pageObjects/OcisPage')

const presentationViewer = new PresentationViewer()
const ocis = new Ocis()

Given(
  'user {string} has uploaded the markdown file {string} using API',
  async function (user, fileName) {
    await uploadFile(fileName, user)
  }
)

Given('user {string} has logged in', async function (user) {
  await ocis.navigateToLoginPage()
  const { username, password } = getUserCredentials(user)
  await ocis.login(username, password)
  await expect(page.locator(ocis.filesContainerSelector)).toBeVisible()
})

When(
  'user {string} previews a markdown file {string} in presentation viewer',
  async function (user, fileName) {
    await ocis.openMDFileInPresentationViewer()
  }
)

Then(
  'markdown file {string} should be opened in the presentation viewer',
  async function (fileName) {
    await expect(page.locator(presentationViewer.presentationViewerHomepageSelector)).toBeVisible()
    await expect(page.locator(presentationViewer.slidesContainerSelector)).toBeVisible()
  }
)
