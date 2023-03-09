import router from './index'
import store from '../store'

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    setTimeout(function () {
      if (store.state.bweVault.keystoreData.length === 0 &&
        to.name !== 'welcome') {
        next({name: 'welcome'})
      } else {
        next()
      }
    }, 100)
  } else {
    next()
  }
})
