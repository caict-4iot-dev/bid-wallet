import { EncryptedStream } from 'extension-streams'
import * as MessageTypes from '../message/MessageTypes'
import idGenerator from '../lib/idGenerator'
import InternalMessage from '../message/InternalMessage'
import * as InternalMessageTypes from '../message/InternalMessageTypes'
import ExtensionStore from '../lib/localStore'
import AccountSign from '../lib/accountSign'
import extension from 'extensionizer'
import KeyUtil from '../lib/keyUtil'
import ResponseParam from '../lib/responseParam'
import {jwsFormatDecode} from '../lib/util'
const sjcl = require('brdc-sjcl')

let stream = new WeakMap()
let extensionStore = new ExtensionStore()
let accountSign = new AccountSign()
const responseParam = new ResponseParam()

class Inject {
  constructor () {
    this.contentInteractionScript()
    this.setEncryptedStream()
    this.tabMessageListener()
  }
  // 监听消息 CONTENT主题
  setEncryptedStream () {
    stream = new EncryptedStream(MessageTypes.CONTENT, idGenerator.text(64))
    stream.listenWith((msg) => this.injectListener(msg))
    stream.onSync(async () => {
      this.initBuWeb()
    })
  }

  // 注入js脚本
  injectScriptInit (scriptSrc, callback = false) {
    const container = (document.head || document.documentElement)
    const content = extension.runtime.getURL(scriptSrc)
    const script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', content)
    script.onload = () => {
      script.remove()
      if (callback) callback()
    }
    container.insertBefore(script, container.children[0])
  }
  contentInteractionScript () {
    this.injectScriptInit('js/content.js', () => {
    })
  }

  injectListener (msg) {
    switch (msg.type) {
      case MessageTypes.INIT:
        this.initConnect(msg)
        break
      case MessageTypes.AUTHORIZATION:
        this.authorizationConnect(msg)
        break
      case MessageTypes.LOGINAUTHORIZATION:
        this.loginConnect(msg)
        break
      case MessageTypes.SENDRANDOM:
        this.loginSignMessage(msg)
        break
      case MessageTypes.CHECKAUTHORIZATION:
        this.checkConnect(msg)
        break
      case MessageTypes.CHECKTRANSACTTION:
        this.checkTransaction(msg)
        break
      case MessageTypes.CHECK_MULTIPLE_TRANSACTTION:
        this.checkMultipleTransaction(msg)
        break
      case MessageTypes.CHECK_ONCE_TRANSACTTION:
        this.checkOnceTransaction(msg)
        break
      case MessageTypes.LOGIN_AUTH:
        this.loginAuthConnect(msg)
        break
      case MessageTypes.GETPV:
        this.getPVConnect(msg)
        break
      case MessageTypes.SIGN_AUTH:
        this.getSignAuthConnect(msg)
        break
      case MessageTypes.SIGN_MESSAGE:
        this.getSignMessageConnect(msg)
        break
    }
  }
  initConnect (msg) {
    accountSign.initDomainData(msg.payload.obj)
  }
  authorizationConnect (msg) {
    InternalMessage.widthPayload(InternalMessageTypes.AUTHORIZATION_BG, msg.payload) // => background
      .send()
  }
  loginConnect (msg) {
    InternalMessage.widthPayload(InternalMessageTypes.LOGIN_AUTHORIZATION_BG, msg.payload) // => background
      .send()
  }
  loginSignMessage (msg) {
    msg.payload.data = msg.payload.obj
    setStorageFn.changeStorage('signSendRandom', msg.payload)
  }
  checkConnect (msg) {
    InternalMessage.widthPayload(InternalMessageTypes.CHECK_AUTHORIZATION_BG, msg.payload) // => background
      .send()
  }
  checkTransaction (msg) {
    InternalMessage.widthPayload(InternalMessageTypes.CHECK_TRANSACTTION_BG, msg.payload) // => background
      .send()
  }
  checkMultipleTransaction (msg) {
    InternalMessage.widthPayload(InternalMessageTypes.CHECK_MULTIPLE_TRANSACTTION_BG, msg.payload) // => background
      .send()
  }
  checkOnceTransaction (msg) {
    msg.payload.data = msg.payload.obj
    setStorageFn.changeStorage('signSendOnce', msg.payload)
  }
  loginAuthConnect (msg) {
    InternalMessage.widthPayload(InternalMessageTypes.LOGIN_AUTH_BG, msg.payload) // => background
      .send()
  }
  getPVConnect (msg) {
    accountSign.changeActiveAccount(msg.payload.obj, function (res) {
      if (!res) {
        InternalMessage.widthPayload(InternalMessageTypes.GET_PV_BG, msg.payload) // => background
          .send()
      } else {
        res.uuid = msg.payload.obj.uuid
        res.type = MessageTypes.GETPV
        extensionStore.sendMessage(res)
      }
    })
  }
  getSignAuthConnect (msg) {
    InternalMessage.widthPayload(InternalMessageTypes.SIGN_AUTH_BG, msg.payload) // => background
      .send()
  }
  getSignMessageConnect (msg) {
    InternalMessage.widthPayload(InternalMessageTypes.SIGN_MESSAGE_BG, msg.payload) // => background
      .send()
  }
  initBuWeb () {}

  tabMessageListener () {
    chrome.runtime.onMessage.addListener((media, sender, sendResponse) => {
      window.postMessage(media)
      sendResponse()
      return true
    })
  }
}
/* eslint-disable no-new */
new Inject()

class SetStorageFn {
  constructor () {
    this.initStorageListener()
  }
  changeStorage (key, param) {
    extensionStore.get('data').then((res) => {
      const data = JSON.parse(res.data)
      data.wallet.changeOptions[key] = param.data
      extensionStore.set({
        'data': JSON.stringify(data)
      }).then((e) => {})
    })
  }
  initStorageListener () {
    let handleName = ['sign', 'transfer', 'signSendWeb', 'signResult', 'checkTransition', 'checkFirstTransition', 'checkSecondTransition']
    extensionStore.storageListener(function (changeKey, newValue) {
      handleName.map(item => {
        if (item === changeKey) {
          extensionStore.sendMessage(newValue.wallet.changeOptions[changeKey])
          return false
        }
      })
    })
  }
}

const setStorageFn = new SetStorageFn()
