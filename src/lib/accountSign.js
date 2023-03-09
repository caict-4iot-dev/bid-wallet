import ExtensionStore from '../lib/localStore'

let extensionStore = new ExtensionStore()

const connectedDf = {
  icon: '',
  connectedList: []
}

export default class AccountSign {
  responseParam (param) {
    return {
      type: 'init',
      code: param.code,
      param: {
        address: param.address || ''
      },
      timeStamp: new Date().getTime()
    }
  }

  isCurrentAccount (obj, fn) {
    extensionStore.getStorage('data', function (data) {
      const currentAccount = data.bweVault.activeAccount
      if (obj.address === currentAccount.address) {
        fn(null)
      } else {
        const result = {
          code: 100003,
          message: '请切换账户'
        }
        fn(result)
      }
    })
  }

  changeActiveAccount (obj, fn) {
    extensionStore.getStorage('data', function (data) {
      const KeyStoreArray = data.bweVault.keystoreData
      if (KeyStoreArray.length === 0) {
        const result = {
          code: 100000,
          message: '请初始化Bid Wallet'
        }
        fn(result)
        return false
      }
      const currentAccount = data.bweVault.activeAccount
      if (obj.address === currentAccount.address) {
        fn(null)
        return false
      }

      let ks = KeyStoreArray.find(e => e.keystoreData.address === obj.address)

      if (!ks) {
        const result = {
          code: 100004,
          message: '没有找到这个账户'
        }
        fn(result)
        return false
      } else {
        fn(null)
        return false
      }
    })
  }

  initDomainData (msg) {
    extensionStore.getStorage('data', function (data) {
      const domain = data.wallet.domain
      if (domain[msg.url]) {
      } else {
        const obj = connectedDf
        obj.icon = msg.icon
        domain[msg.url] = obj
        extensionStore.changeStorage('data', data)
      }
    })
  }
}
