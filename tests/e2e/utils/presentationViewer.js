const PresentationViewer = require('../pageObjects/PresentationViewerPage')

const presentationViewerPage = new PresentationViewer()

const sidebarPanelOpen = async () => {
  return await page.locator(presentationViewerPage.sidebarPanelSelector).isVisible()
}

const openSidebarPanel = async () => {
  if (!(await sidebarPanelOpen())) {
    await page.click(presentationViewerPage.sidebarToggleBtnSelector)
  }
}

const openActionsMenuFromSidebarPanel = async () => {
  await openSidebarPanel()
  await page.click(presentationViewerPage.actionsMenuSelector)
}

module.exports = { sidebarPanelOpen, openSidebarPanel, openActionsMenuFromSidebarPanel }
