class PresentationViewer {
  constructor() {
    this.slidesContainerSelector = '#presentation-viewer-main .slides'
    this.presentationViewerHomepageSelector = '#presentation-viewer-main'
    this.currentSlideSelector = '.slides .present'
    this.nextSlideBtnSelector = 'aside button.navigate-right.enabled'
  }

  async goToNextSlide() {
    await page.locator(this.nextSlideBtnSelector).click()
  }

  async getServerParsedSlide() {
    await page.waitForSelector(this.slidesContainerSelector)
    const slides = await page.$$eval(this.currentSlideSelector, (elements) => {
      return elements.map((element) => {
        const clonedElement = element.cloneNode(true)
        clonedElement.querySelectorAll('[id]').forEach((element) => {
          element.removeAttribute('id')
        })
        return clonedElement.innerHTML
      })
    })
    return slides
  }
}

module.exports = PresentationViewer
