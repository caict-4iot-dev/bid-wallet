import axios from 'axios'
import {alertMsg} from '../../config/vanUtil'
import {serverName} from '../../config/param'
import defaultNetworks from '../../config/network'
import store from '../../store'
import TokenService from '../../config/tokenService'

let tokenService = null

const service = axios.create({
  baseURL: `${defaultNetworks.currentNetworkObj.rpcUrl}${serverName}`,
  timeout: 60000
})

// request拦截器
service.interceptors.request.use(config => {
  const token = getAccountToken()
  if (token) {
    config.headers.accessToken = token
    return config
  }
  return config
}, error => {
  console.log(error)
}
)

// respone拦截器  根据后端业务进行整理
service.interceptors.response.use(
  response => {
    const res = response.data

    return new Promise((resolve, reject) => {
      try {
        if (res.errorCode !== 0) {
          if (res.errorCode === 2) {
            tokenService = new TokenService(function (resp) {
              resolve(resp)
            })
            tokenService.httpData = response
            getToken()
          } else {
            alertMsg(res.message)
            reject(res)
          }
        } else {
          resolve(res)
        }
      } catch (e) {
        reject(e)
      }
    })
    // return response.data
  },
  error => {
    console.log(error.response)
    if (error && error.response) {

    }
    return Promise.reject(error)
  }
)

async function getToken () {
  await tokenService.getRandomService(true)
}

function getAccountToken () {
  let accessToken = window.localStorage.getItem('accessToken')
  if (!accessToken) {
    accessToken = []
  } else {
    accessToken = JSON.parse(accessToken)
  }
  const address = store.state.bweVault.activeAccount.address
  let tokenObj = accessToken.filter(item => item.address === address)
  if (tokenObj.length > 0) {
    return tokenObj[0].value
  } else {
    return ''
  }
}

export default service
