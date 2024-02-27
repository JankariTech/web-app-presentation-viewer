const config = require('../config')

class Ocis {
  constructor() {
    this.signInPageUrl = config.baseOcisUrl
    this.homePageSelector = '.oc-login-bg'
    this.loginFormSelector = '.oc-login-form'
    this.usernameInputFieldSelector = '#oc-login-username'
    this.passwordInputFieldSelector = '#oc-login-password'
    this.loginBtnSelector = '.jss8 .oc-button-primary'
    this.filesContainerSelector = '#files-view'
    this.contextMenuBtnSelector = '.resource-table-btn-action-dropdown'
    this.openInPresentationViewerBtnSelector = '.oc-files-actions-presentation-viewer-trigger'
  }

  async navigateToLoginPage() {
    await page.goto(this.signInPageUrl)
  }

  async login(username, password) {
    await page.fill(this.usernameInputFieldSelector, username)
    await page.fill(this.passwordInputFieldSelector, password)
    await page.click(this.loginBtnSelector)
  }

  async openMDFileInPresentationViewer() {
    await page.click(this.contextMenuBtnSelector)
    await page.click(this.openInPresentationViewerBtnSelector)
  }
}

module.exports = Ocis
