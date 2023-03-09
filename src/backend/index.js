// 消息发布监听
import { LocalStream } from 'extension-streams'
import InternalMessage from '../message/InternalMessage'
import * as InternalMessageTypes from '../message/InternalMessageTypes'
// 业务控制层
import BewController from '../extensionService/controller/bewController'
// 谷歌本地存储
import ExtensionStore from '../lib/localStore'
// 打开新窗口
import NotificationService from '../extensionService/notificationService'

// 初始化实例
const controller = new BewController()

export default class Background {
  constructor () {
    chrome.runtime.onInstalled.addListener(function () {
      controller.openTabsForCreate()
    })
    // 谷歌缓存工具，*维护未与vuex关联的数据
    this.extensionStore = new ExtensionStore()

    // 监听消息
    this.watchInternalMessaging()
  }
  // 监听消息
  watchInternalMessaging () {
    LocalStream.watch((request, response) => {
      const message = InternalMessage.fromJson(request)
      this.dispenseMessage(response, message)
    })
  }
  // 解析消息
  dispenseMessage (sendResponse, message) {
    switch (message.type) {
      case InternalMessageTypes.AUTHORIZATION_BG:
        this.insetTabId(res => {
          message.payload.obj.tabId = res
          NotificationService.open(message.payload, '#/signUser').then(r => {})
        })
        break
      case InternalMessageTypes.SETOPENWINDOW:
        this.openTabsForCreate()
        break
      case InternalMessageTypes.LOGIN_AUTHORIZATION_BG:
        NotificationService.open(message.payload, '#/loginSignUser').then(r => {})
        break
      case InternalMessageTypes.CHECK_AUTHORIZATION_BG:
        NotificationService.open(message.payload, '#/checkSign').then(r => {})
        break
      case InternalMessageTypes.CHECK_TRANSACTTION_BG:
        this.insetTabId(res => {
          message.payload.obj.tabId = res
          NotificationService.open(message.payload, '#/signBlobTransaction').then(r => {})
        })
        break
      case InternalMessageTypes.CHECK_MULTIPLE_TRANSACTTION_BG:
        NotificationService.open(message.payload, '#/multipleSignTransaction').then(r => {})
        break
      case InternalMessageTypes.LOGIN_AUTH_BG:
        this.insetTabId(res => {
          message.payload.obj.tabId = res
          NotificationService.open(message.payload, '#/selectUserAuth').then(r => {})
        })
        break
      case InternalMessageTypes.GET_PV_BG:
        this.insetTabId(res => {
          message.payload.obj.tabId = res
          NotificationService.open(message.payload, '#/showCertificates').then(r => {})
        })
        break
      case InternalMessageTypes.SIGN_AUTH_BG:
        this.insetTabId(res => {
          message.payload.obj.tabId = res
          NotificationService.open(message.payload, '#/signAuthAccount').then(r => {})
        })
        break
      case InternalMessageTypes.SIGN_MESSAGE_BG:
        this.insetTabId(res => {
          message.payload.obj.tabId = res
          NotificationService.open(message.payload, '#/signMessageAccount').then(r => {})
        })
        break
    }
  }

  insetTabId (callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs =>
      callback(tabs[0].id)
    )
  }

  openTabsForCreate () {
    this.extensionStore.get('data').then(res => {
      if (!res && !res.data) {
        controller.openTabsForCreate()
        return false
      }
      let data = JSON.parse(res.data)
      if (data.bweVault.keystoreData.length === 0) {
        controller.openTabsForCreate()
      }
    })
  }
}

/* eslint-disable no-new */
new Background()
