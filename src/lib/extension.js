import extension from 'extensionizer'

// chrome API
export default class BewExtension {
  reload () {
    extension.runtime.reload()
  }

  getExtensionId () {
    return extension.runtime.id || null
  }

  openTabs (url) {
    extension.tabs.create({index: 9, url: url})
  }

  sendTabMessage (tabId, message) {
    extension.tabs.sendMessage(Number(tabId), message, () => {
    })
  }

  tabQuery (callback) {
    extension.tabs.query({active: true, currentWindow: true}, function (tabs) {
      callback(tabs)
    })
  }
}
