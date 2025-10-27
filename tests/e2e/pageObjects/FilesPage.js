const Ocis = require('./OcisPage')
const config = require('../config')

class Files {
  constructor() {
    this.contextMenuBtnSelector = '[class*=-btn-action-dropdown]'
    this.openInPresentationViewerBtnSelector = '.oc-files-actions-presentation-viewer-trigger'
    this.openWithBtnSelector = 'button[id^="oc-files-context-actions-open-with-toggle"]'
  }

  async openMDFileInPresentationViewer() {
    await page.click(this.contextMenuBtnSelector)
    if (config.targetServer === 'opencloud') {
      await page.click(this.openWithBtnSelector)
    }
    await page.click(this.openInPresentationViewerBtnSelector)
  }
}

module.exports = Files
