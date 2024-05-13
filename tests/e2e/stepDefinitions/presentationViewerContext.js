const { Given, When, Then } = require('@cucumber/cucumber')
const { expect } = require('@playwright/test')
const { getUserCredentials } = require('../utils/userHelper')
const { uploadFileWithContent } = require('../utils/fileHelper')
const PresentationViewer = require('../pageObjects/PresentationViewerPage')
const Ocis = require('../pageObjects/OcisPage')

const presentationViewer = new PresentationViewer()
const ocis = new Ocis()

Given(
  'user {string} has uploaded markdown file {string} with content:',
  async function (user, fileName, mdContent) {
    await uploadFileWithContent(fileName, user, mdContent)
  }
)

Given(
  'user {string} has uploaded markdown file {string} with {string}',
  async function (user, fileName, markdownContent) {
    await uploadFileWithContent(fileName, user, markdownContent)
  }
)

Given('user {string} has logged in to the web UI', async function (user) {
  await ocis.navigateToLoginPage()
  const { username, password } = getUserCredentials(user)
  await ocis.login(username, password)
  await expect(page.locator(ocis.filesContainerSelector)).toBeVisible()
})

When('the user previews the markdown file using the webUI', async function () {
  await ocis.openMDFileInPresentationViewer()
  await expect(page.locator(presentationViewer.presentationViewerHomepageSelector)).toBeVisible()
  await expect(page.locator(presentationViewer.slidesContainerSelector)).toBeVisible()
})

Then('the rendered HTML should be:', async function (htmlContent) {
  const expectedHTMLContent = htmlContent.replace(/\s+/g, '') // Removing all whitespace
  const serverRenderedHTMLContent = (await presentationViewer.getServerParsedSlide())[0].replace(
    /\s+/g,
    ''
  ) // Removing all whitespace
  expect(expectedHTMLContent).toEqual(serverRenderedHTMLContent)
})

Then('the rendered HTML should be {string}', async function (htmlContent) {
  const expectedHTMLContent = htmlContent.replace(/\s+/g, '') // Removing all whitespace
  const serverRenderedHTMLContent = (await presentationViewer.getServerParsedSlide())[0].replace(
    /\s+/g,
    ''
  ) // Removing all whitespace
  expect(expectedHTMLContent).toEqual(serverRenderedHTMLContent)
})
