import {lockTimeDef} from '../config/param'
import defaultNetworks from '../config/network'

const state = {
  bweVault: {
    keystoreData: [],
    activeAccount: {
      accountName: '',
      address: ''
    },
    config: {
      lockTime: lockTimeDef,
      markTime: null
    },
    currentNetwork: defaultNetworks.currentNetworkObj,
    address: []
  }
}

export default state
