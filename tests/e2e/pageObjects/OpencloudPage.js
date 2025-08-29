const Ocis = require('./OcisPage')

class Opencloud extends Ocis {
  constructor() {
    super()
    this.openWithBtnSelector = 'button[id^="oc-files-context-actions-open-with-toggle"]'
  }

  async openMDFileInPresentationViewer() {
    await page.click(this.contextMenuBtnSelector)
    await page.click(this.openWithBtnSelector)
    await page.click(this.openInPresentationViewerBtnSelector)
  }
}

module.exports = Opencloud
