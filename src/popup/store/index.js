import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import vuexPersistence from '../../lib/vuexPersistence'
import wallet from './wallet'
import certificate from './certificate'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    wallet,
    certificate
  },
  state,
  mutations,
  actions,
  plugins: [vuexPersistence()]
})
