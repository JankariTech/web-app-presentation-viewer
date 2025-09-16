class PresentationViewer {
  constructor() {
    this.slidesContainerSelector = '#presentation-viewer-main .slides'
    this.presentationViewerHomepageSelector = '#presentation-viewer-main'
    this.currentSlideSelector = '#presentation-viewer-main section.present'
  }

  async getCurrentSlideContent() {
    return await page.locator(this.currentSlideSelector).innerText()
  }
}

module.exports = PresentationViewer
