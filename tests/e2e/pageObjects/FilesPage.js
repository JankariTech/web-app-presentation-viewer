const config = require('../config')
const { openActionsMenuFromSidebarPanel } = require('../utils/presentationViewer')
const util = require('util')

class Files {
  constructor() {
    this.contextMenuBtnSelector =
      config.targetServer === 'ocis'
        ? '//span[@data-test-resource-name="%s"]/ancestor::tr[contains(@class, "oc-tbody-tr")]//button[contains(@class, "resource-table-btn-action-dropdown")]'
        : '//span[@data-test-resource-name="%s"]/ancestor::div[contains(@class, "oc-tile-card")]//button[contains(@class, "resource-tiles-btn-action-dropdown")]'
    this.openInPresentationViewerBtnSelector = '.oc-files-actions-presentation-viewer-trigger'
    this.openWithBtnSelector = 'button[id^="oc-files-context-actions-open-with-toggle"]'
    this.openInTextEditorBtnSelector = '.oc-files-actions-text-editor-trigger'
    this.resourceNameSelector = '//*[@data-test-resource-name="%s"]'
  }

  async openMDFileInPresentationViewer(fileName) {
    await page.locator(util.format(this.contextMenuBtnSelector, fileName)).click()
    if (config.targetServer === 'opencloud') {
      await page.click(this.openWithBtnSelector)
    }
    await page.click(this.openInPresentationViewerBtnSelector)
  }

  async openMDFileInTextEditorUsingSidebarPanel(fileName) {
    await openActionsMenuFromSidebarPanel()
    await page.click(this.openInTextEditorBtnSelector)
  }

  async openMDFileInPresentationViewerUsingSidebarPanel(fileName) {
    await openActionsMenuFromSidebarPanel()
    await page.click(this.openInPresentationViewerBtnSelector)
  }

  async openFolder(user, folder) {
    await page.click(util.format(this.resourceNameSelector, folder))
  }
}

module.exports = Files
