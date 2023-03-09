import TokenService from '../config/tokenService'
const tokenService = new TokenService()

const mutations = {
  setKeystoreData (state, data) {
    state.bweVault.keystoreData.push(data)
  },
  setKeystoreDataEmpty (state) {
    state.bweVault.keystoreData = []
  },
  setKeystoreDataNewData (state, data) {
    state.bweVault.keystoreData = data
  },
  setActiveAccount (state, data) {
    state.bweVault.activeAccount = data
    // getToken()
  },
  setActiveAccountName (state, name) {
    state.bweVault.activeAccount.accountName = name
  },
  setMarkTime (state, time) {
    state.bweVault.config.markTime = time
  },
  setCurrentNetwork (state, data) {
    state.bweVault.currentNetwork = data
  },
  setAddressData (state, data) {
    state.bweVault.address = data
  },
  setAddressNewData (state, data) {
    state.bweVault.address.push(data)
  }
}

export default mutations

async function getToken () {
  await tokenService.getRandomService()
}
