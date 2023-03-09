import BewExtension from '../../lib/extension'

export default class BewController {
  constructor () {
    this.bewExtension = new BewExtension()
  }

  getExtensionId () {
    return this.bewExtension.getExtensionId()
  }

  openTabsForCreate (data) {
    this.bewExtension.openTabs('pages/popup.html#/welcome?type=openAfter')
  }
}
