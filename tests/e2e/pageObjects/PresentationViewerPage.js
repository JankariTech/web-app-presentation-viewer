class PresentationViewer {
  constructor() {
    this.slidesContainerSelector = '#presentation-viewer-main .slides'
    this.presentationViewerHomepageSelector = '#presentation-viewer-main'
    this.currentSlideSelector = '#presentation-viewer-main section.present'
    this.navigateNextSlideSelector = 'button[aria-label="next slide"]'
    this.navigatePreviousSlideSelector = 'button[aria-label="previous slide"]'
  }

  async getCurrentSlideContent() {
    return await page
      .locator(this.currentSlideSelector)
      .innerText()
      .then((text) => text.trim())
  }

  async changeSlideUsingNavigationButton(direction) {
    if (direction === 'next') {
      await page.click(this.navigateNextSlideSelector)
    } else if (direction === 'previous') {
      await page.click(this.navigatePreviousSlideSelector)
    }
  }

  async changeSlideUsingKeyboard(direction) {
    const key = direction === 'next' ? 'ArrowRight' : 'ArrowLeft'
    await page.locator('body').press(key)
  }
}

module.exports = PresentationViewer
