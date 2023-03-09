import extension from 'extensionizer'
import { isWindowsSystem } from '../lib/util'
let openWindow = null
let windowId = ''
// 打开新窗口、关闭窗口
export default class NotificationService {
  static async open (notification, urlStr) {
    if (openWindow) {
      openWindow = null
      await this.close()
    }

    openWindow = notification
    const height = 600
    const width = isWindowsSystem() ? 390 : 375
    const urlPath = urlStr
    const getPopup = async () => {
      try {
        const url = extension.runtime.getURL(`/pages/popup.html${urlPath}?${this.queryParams(notification.obj)}`)
        const created = await extension.windows.create({
          url,
          height,
          width,
          type: 'popup'
        }, function (res) {
          windowId = res.id
        })
        return created
      } catch (e) {
        console.log('notification error', e)
        return null
      }
    }
    await getPopup()
  }
  static queryParams (data, isPrefix = false) {
    let prefix = isPrefix ? '?' : ''
    let _result = []
    for (let key in data) {
      let value = data[key]
      // 去掉为空的参数
      if (['', undefined, null].includes(value)) {
        continue
      }
      if (value.constructor === Array) {
        value.forEach(_value => {
          _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(_value))
        })
      } else {
        _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
      }
    }
    return _result.length ? prefix + _result.join('&') : ''
  }

  static async close () {
    if (!windowId && windowId !== 0) {
      return false
    }
    extension.windows.remove(windowId)
  }
}
