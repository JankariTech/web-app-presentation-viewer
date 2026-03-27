const config = require('../config')
const { openActionsMenuFromSidebarPanel } = require('../utils/presentationViewer')

class Files {
  constructor() {
    this.contextMenuBtnSelector = '[class*=-btn-action-dropdown]'
    this.openInPresentationViewerBtnSelector = '.oc-files-actions-presentation-viewer-trigger'
    this.openWithBtnSelector = 'button[id^="oc-files-context-actions-open-with-toggle"]'
    this.openInTextEditorBtnSelector = '.oc-files-actions-text-editor-trigger'
  }

  async openMDFileInPresentationViewer() {
    await page.click(this.contextMenuBtnSelector)
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
}

module.exports = Files
