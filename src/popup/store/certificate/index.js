export default {
  namespaced: true,
  state: {
    certificateList: []
  },
  mutations: {
    setCertificate (state, data) {
      if (data.content && data.content.vc) {
        data.content.vc = null
      }
      state.certificateList.push(data)
    },
    setCertificateData (state, data) {
      state.certificateList = data
    }
  }
}
