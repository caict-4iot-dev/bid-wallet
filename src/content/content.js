import { EncryptedStream } from 'extension-streams'
import Message from '../message/Message'
import * as MessageTypes from '../message/MessageTypes'
import idGenerator from '../lib/idGenerator'
import { v4 } from 'uuid'
let stream = new WeakMap()

export class BidControl {
  constructor () {
    stream = new EncryptedStream(MessageTypes.INJECT, idGenerator.text(64))
    stream.listenWith((msg) => this.contentListener(msg))
    stream.sync(MessageTypes.CONTENT, stream.key)
  }
  contentListener (msg) {
    if (!msg) return false
  }
  listenerWindowMessage (type, callback) {
    window.addEventListener('message', function (e) {
      if (e.data.type === type) {
        callback(e.data)
      }
    })
  }
  getHost () {
    return window.location.protocol + '//' + window.location.host
  }
  getIcon () {
    let ico = ''
    try {
      ico = document.querySelectorAll("link[rel*='icon']")[0].href
    } catch (e) {
      ico = 'data:image/png;base64,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'
    }
    return ico
  }
  initConnect () {
    let obj = {}
    obj.url = this.getHost()
    obj.icon = ''
    try {
      obj.ico = document.querySelectorAll("link[rel*='icon']")[0].href
    } catch (e) {
      obj.icon = ''
    }
    let message = new Message(MessageTypes.INIT, { obj })
    stream.send(message, MessageTypes.CONTENT)
  }
  connect (obj) {
    obj.url = this.getHost()
    obj.icon = this.getIcon()
    let message = new Message(MessageTypes.AUTHORIZATION, { obj })
    stream.send(message, MessageTypes.CONTENT)
  }
  loginSign (uuid) {
    let obj = {
      url: this.getHost(),
      icon: this.getIcon(),
      uuid: uuid
    }
    let message = new Message(MessageTypes.LOGINAUTHORIZATION, { obj })
    stream.send(message, MessageTypes.CONTENT)
  }
  loginSignMessage (obj) {
    let message = new Message(MessageTypes.SENDRANDOM, { obj })
    stream.send(message, MessageTypes.CONTENT)
  }
  checkSign (obj) {
    if (!obj.icon) {
      obj.icon = this.getIcon()
    }
    obj.url = this.getHost()
    let message = new Message(MessageTypes.CHECKAUTHORIZATION, { obj })
    stream.send(message, MessageTypes.CONTENT)
  }
  checkTransactionBlob (obj) {
    let message = new Message(MessageTypes.CHECKTRANSACTTION, { obj })
    stream.send(message, MessageTypes.CONTENT)
  }
  checkMultipleTransactionMsg (obj) {
    let message = new Message(MessageTypes.CHECK_MULTIPLE_TRANSACTTION, { obj })
    stream.send(message, MessageTypes.CONTENT)
  }
  checkOnceTransactionMsg (obj) {
    let message = new Message(MessageTypes.CHECK_ONCE_TRANSACTTION, { obj })
    stream.send(message, MessageTypes.CONTENT)
  }
  loginAuth (uuid) {
    const obj = {
      icon: this.getIcon(),
      url: this.getHost(),
      uuid: uuid
    }
    let message = new Message(MessageTypes.LOGIN_AUTH, { obj })
    stream.send(message, MessageTypes.CONTENT)
  }
  getPVConnect (obj) {
    obj.url = this.getHost()
    obj.icon = this.getIcon()
    let message = new Message(MessageTypes.GETPV, { obj })
    stream.send(message, MessageTypes.CONTENT)
  }
  signAuthConnect (obj) {
    obj.url = this.getHost()
    obj.icon = this.getIcon()
    let message = new Message(MessageTypes.SIGN_AUTH, { obj })
    stream.send(message, MessageTypes.CONTENT)
  }
  signMessageConnect (obj) {
    obj.url = this.getHost()
    obj.icon = this.getIcon()
    let message = new Message(MessageTypes.SIGN_MESSAGE, { obj })
    stream.send(message, MessageTypes.CONTENT)
  }
}

export class BidWallet {
  constructor () {
    this.bidControl = new BidControl()
  }
  removeBaseMessage (msg) {
    delete msg.type
    delete msg.uuid
    return msg
  }
  init () {
    this.bidControl.initConnect()
  }
  loginConnect (fn) {
    const self = this
    const uuid = v4()
    this.bidControl.loginSign(uuid)
    this.bidControl.listenerWindowMessage(MessageTypes.LOGINAUTHORIZATION, function (msg) {
      if (fn && uuid === msg.uuid) {
        fn(self.removeBaseMessage(msg))
      }
    })
  }
  sendLoginSignMessage (data, fn) {
    const self = this
    const uuid = v4()
    data.uuid = uuid
    this.bidControl.loginSignMessage(data)
    this.bidControl.listenerWindowMessage(MessageTypes.SENDRANDOM, function (msg) {
      if (fn && uuid === msg.uuid) {
        fn(self.removeBaseMessage(msg))
      }
    })
  }
  // 审核 - 上链
  checkTransactionMessage (data) {
    const uuid = v4()
    data.uuid = uuid
    this.bidControl.checkTransactionBlob(data)
    this.bidControl.listenerWindowMessage(MessageTypes.CHECKTRANSACTTION, function (msg) {
      if (uuid === msg.uuid) {
        delete msg.uuid
        window.postMessage(msg)
      }
    })
  }
  // 审核 - 不上链
  checkSignMessage (data) {
    const uuid = v4()
    data.uuid = uuid
    this.bidControl.connect(data)
    this.bidControl.listenerWindowMessage(MessageTypes.LOGINAUTHORIZATION, function (msg) {
      if (uuid === msg.uuid) {
        delete msg.uuid
        window.postMessage(msg)
      }
    })
  }

  // 两次签名审核 - 上链 首次签名
  checkMultipleTransaction (data) {
    this.bidControl.checkMultipleTransactionMsg(data)
  }

  // 两次签名审核 - 上链 再次签名
  checkOnceTransaction (data) {
    this.bidControl.checkOnceTransactionMsg(data)
  }
  auth (fn) {
    const self = this
    const uuid = v4()
    this.bidControl.loginAuth(uuid)
    this.bidControl.listenerWindowMessage(MessageTypes.LOGIN_AUTH, function (msg) {
      if (fn && uuid === msg.uuid) {
        fn(self.removeBaseMessage(msg))
      }
    })
  }
  getPV (obj = {}, fn) {
    const self = this
    const uuid = v4()
    obj.uuid = uuid
    this.bidControl.getPVConnect(obj)
    this.bidControl.listenerWindowMessage(MessageTypes.GETPV, function (msg) {
      if (fn && uuid === msg.uuid) {
        fn(self.removeBaseMessage(msg))
      }
    })
  }
  signAuth (obj = {}, fn) {
    const self = this
    const uuid = v4()
    obj.uuid = uuid
    this.bidControl.signAuthConnect(obj)
    this.bidControl.listenerWindowMessage(MessageTypes.SIGN_AUTH, function (msg) {
      if (fn && uuid === msg.uuid) {
        fn(self.removeBaseMessage(msg))
      }
    })
  }
  signMessage (obj = {}, fn) {
    const self = this
    const uuid = v4()
    obj.uuid = uuid
    this.bidControl.signMessageConnect(obj)
    this.bidControl.listenerWindowMessage(MessageTypes.SIGN_MESSAGE, function (msg) {
      if (fn && uuid === msg.uuid) {
        fn(self.removeBaseMessage(msg))
      }
    })
  }
}

const bidWallet = new BidWallet()

export default class Content {
  constructor () {
    window.bidWallet = bidWallet
  }
}

/* eslint-disable no-new */
new Content()
