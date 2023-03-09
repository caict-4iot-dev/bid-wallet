import request from '../request'

const walletApi = {
  getAuthRandom (params) {
    return request({
      url: 'bid/auth/random',
      method: 'post',
      data: params
    })
  },
  auth (params) {
    return request({
      url: 'bid/auth',
      method: 'post',
      data: params
    })
  },
  applicationCredential (params) {
    return request({
      url: 'credential/apply',
      method: 'post',
      data: params
    })
  },
  getRecommendList (params) {
    return request({
      url: 'credential/template/list',
      method: 'post',
      data: params
    })
  },
  getCredentialOwnerList (params) {
    return request({
      url: 'credential/owner/list',
      method: 'post',
      data: params
    })
  },
  downCredentialData (params) {
    return request({
      url: 'credential/download',
      method: 'post',
      data: params
    })
  },
  showCredentialData (params) {
    return request({
      url: 'credential/cert/show',
      method: 'post',
      data: params
    })
  },
  getCustomDetailData (params) {
    return request({
      url: 'credential/template/detail',
      method: 'post',
      data: params
    })
  }
}

export default walletApi
