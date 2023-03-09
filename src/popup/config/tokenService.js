import axios from 'axios'
import {serverName} from './param'
import store from '../store'
import KeyUtil from '../../lib/keyUtil'
import { alertMsg } from './vanUtil'
import defaultNetworks from '../config/network'
const keyUtil = new KeyUtil()

export default class TokenService {
  constructor (callback) {
    this.randomStr = ''
    this.token = ''
    this.getOnceServer = false
    this.httpData = null
    this.promiseBack = {}
    if (typeof callback !== 'undefined') {
      this.promiseBack['tokenServer'] = {
        resolve: callback,
        reject: e => console.log('error: ', e)
      }
    }
  }
  async getRandomService (getOnceServer) {
    this.getOnceServer = getOnceServer
    const url = defaultNetworks.currentNetworkObj.rpcUrl
    const bid = store.state.bweVault.activeAccount.address
    // eslint-disable-next-line no-return-await
    await axios.post(url + `${serverName}bid/auth/random`, {bid: bid}).then(res => {
      if (res.data.errorCode === 0) {
        this.randomStr = res.data.data.randomStr
        this.signRandomService()
      }
    })
  }
  findKeyStoreArray () {
    const address = store.state.bweVault.activeAccount.address
    const KeyStoreArray = store.state.bweVault.keystoreData
    let obj = KeyStoreArray.find(e => e.keystoreData.address === address)
    if (obj) {
      return obj.keystoreData
    } else {
      return null
    }
  }
  signRandomService () {
    const keystoreData = this.findKeyStoreArray()
    if (!keystoreData) {
      return false
    }
    const password = store.state.wallet.password
    keyUtil.importAccountKeystoreFn(keystoreData, password).then((res) => {
      if (res) {
        this.signRandomStr(res)
      } else {
      }
    }).catch(error => {
      console.log(error)
    })
  }
  signRandomStr (pk) {
    keyUtil.sign(this.randomStr, pk).then((res) => {
      if (res) {
        let param = { signBlob: res }
        this.getPublicKey(pk, param)
      } else {
      }
    }).catch(error => {
      console.log(error)
    })
  }
  getPublicKey (privateKey, param) {
    keyUtil.getPublicKeyServiceFn(privateKey).then((res) => {
      param.publicKey = res
      param.randomStr = this.randomStr
      this.getAccessTokenService(param)
    }).catch(error => {
      console.log(error)
    })
  }
  filterAccountToken (token) {
    const address = store.state.bweVault.activeAccount.address
    let accessToken = window.localStorage.getItem('accessToken')
    if (!accessToken) {
      accessToken = []
    } else {
      accessToken = JSON.parse(accessToken)
    }
    let isHas = false
    for (let i = 0; i < accessToken.length; i++) {
      if (accessToken[i].address === address) {
        isHas = true
        accessToken[i].value = token
      }
    }
    if (!isHas) {
      accessToken.push({
        address: address,
        value: token
      })
    }
    window.localStorage.setItem('accessToken', JSON.stringify(accessToken))
  }
  getAccessTokenService (param) {
    const url = defaultNetworks.currentNetworkObj.rpcUrl
    axios.post(url + `${serverName}bid/auth`, {...param}).then(res => {
      if (res.data.errorCode === 0) {
        this.token = res.data.data.accessToken
        this.filterAccountToken(res.data.data.accessToken)
        if (this.getOnceServer) {
          this.onceGetHttpServer()
        }
      } else {
        alertMsg(res.data.message)
        const req = this.promiseBack['tokenServer']
        req.resolve(res.data)
      }
    })
  }
  onceGetHttpServer () {
    let data = this.httpData
    axios.post(data.config.baseURL + data.config.url, {...JSON.parse(data.config.data)}, {headers: {accessToken: this.token}}).then(res => {
      const req = this.promiseBack['tokenServer']
      if (res.data.errorCode === 0) {
        req.resolve(res.data)
      } else {
        req.reject(res.data)
      }
    })
  }
}
