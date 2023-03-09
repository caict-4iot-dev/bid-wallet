import extension from 'extensionizer'
import { checkForError } from './util'

/**
 * chrome storage API
 */
export default class ExtensionStore {
  constructor () {
    this.isSupported = Boolean(extension.storage.local)
    if (!this.isSupported) {
      console.log('Storage local API not available.')
    }
  }

  changeStorage (keyName, param, fn) {
    this.set({[keyName]: JSON.stringify(param)}).then((e) => {
      if (fn) { fn() }
    })
  }
  getStorage (keyName, callback) {
    // eslint-disable-next-line no-undef
    this.get(keyName).then((res) => {
      if (res) {
        const data = JSON.parse(res.data)
        callback(data)
      }
    })
  }

  async get (data) {
    if (!this.isSupported) {
      return undefined
    }
    const result = await this._get(data)
    if (isEmpty(result)) {
      return undefined
    }
    return result
  }

  async set (state) {
    return this._set(state)
  }

  _get (data) {
    const { local } = extension.storage
    return new Promise((resolve, reject) => {
      local.get(data, (/** @type {any} */ result) => {
        const err = checkForError()
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  _set (obj) {
    const { local } = extension.storage
    return new Promise((resolve, reject) => {
      local.set(obj, () => {
        const err = checkForError()
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
  diff (oldData, newData) {
    for (let item in oldData) {
      if (Object.keys(oldData[item]).length === 0 && newData[item].timeStamp) {
        return item
      }
    }
  }
  sendMessage (msg) {
    window.postMessage(msg)
  }
  storageListener (callBack) {
    const that = this
    document.addEventListener('DOMContentLoaded', function () {
      extension.storage.onChanged.addListener(function (changes, namespace) {
        if (!changes) { return false }
        let oldValue = JSON.parse(changes.data.oldValue)
        let newValue = JSON.parse(changes.data.newValue)
        const changeKey = that.diff(oldValue.wallet.changeOptions, newValue.wallet.changeOptions)
        if (changeKey) {
          callBack(changeKey, newValue)
        }
      })
    })
  }
}

function isEmpty (obj) {
  return Object.keys(obj).length === 0
}
