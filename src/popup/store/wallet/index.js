export default {
  namespaced: true,
  state: {
    password: '',
    changeOptions: {
      // pop => web
      sign: {},
      transfer: {},
      signSendWeb: {},
      signResult: {},
      checkTransition: {},
      checkFirstTransition: {},
      checkSecondTransition: {},
      // web => pop
      signSendRandom: {},
      signSendOnce: {}
    },
    domain: {}
  },
  mutations: {
    setPassword (state, password) {
      state.password = password
    },
    setSignInfo (state, data) {
      state.changeOptions.sign = data
    },
    setTransferInfo (state, data) {
      state.changeOptions.transfer = data
    },
    setSignSendWeb (state, data) {
      state.changeOptions.signSendWeb = data
    },
    setSignSendRandom (state, data) {
      state.changeOptions.signSendRandom = data
    },
    setSignResult (state, data) {
      state.changeOptions.signResult = data
    },
    setTransitionInfo (state, data) {
      state.changeOptions.checkTransition = data
    },
    setFirstTransitionInfo (state, data) {
      state.changeOptions.checkFirstTransition = data
    },
    setSecondTransitionInfo (state, data) {
      state.changeOptions.checkSecondTransition = data
    },
    setSignSendOnce (state, data) {
      state.changeOptions.signSendOnce = data
    },
    setUpdateDomain (state, data) {
      if (state.domain[data.host]) {
        state.domain[data.host].connectedList.push(data.data)
      }
    }
  }
}
