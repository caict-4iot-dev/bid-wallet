import ExtensionStore from './localStore'
let extensionStore = new ExtensionStore()
let merge = require('lodash.merge')
/*
* vuex + chrome storage持久化存储
* */
function vuexPersistence ({
  SS = null,
  LS = null,
  saveName = 'data',
  mode = 'LS',
  MMD = 2,
  ciphertext = false,
  encode = (data) => {
    return window.btoa(encodeURIComponent(JSON.stringify(data)))
  },
  decode = (data) => {
    return JSON.parse(decodeURIComponent(window.atob(data)))
  },
  setState = (state, Sg) => {
    state = ciphertext ? encode(state) : JSON.stringify(state)
    // window[Sg].setItem(saveName, state)

    extensionStore.set({[saveName]: state}).then((e) => {})
  },
  getState = async (Sg) => {
    try {
      let dataState
      // eslint-disable-next-line no-inner-declarations
      async function result () {
        const getData = () => extensionStore.get(saveName).then((res) => {
          return res[saveName]
        })
        dataState = await getData()
      }
      await result()

      if (!dataState) return null

      return ciphertext ? decode(dataState) : JSON.parse(dataState)
    } catch (error) {
      return null
    }
  },
  checkParams = (params) => {
    if (!(params.hasOwnProperty('storePath') && params.hasOwnProperty('module'))) {
      console.warn(`SS,LS的key约定必须包含storePath、module`)
      return false
    }
    return true
  },
  deepMerge = (origin, target, deep) => {
    // target  覆盖  origin  //
    if (!deep) return target
    for (let key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        origin[key] = origin[key] && Object.prototype.toString.call(origin[key]) === '[object Object]' ? deepMerge(origin[key], target[key], --deep) : origin[key] = target[key]
      }
    }
    return origin
  }
} = {}) {
  // 辅助函数 减少代码
  function typeHandle (namespaced, type) {
    if (namespaced) {
      const arr = type.split('/')
      return arr[arr.length - 1]
    }
    return type
  }
  // 处理函数
  function dataHandle (data, mutation, state) {
    let result = null
    // data  组件传入的模块
    for (const item of data) {
      const type = typeHandle(item.module.namespaced, mutation.type)
      const mutations = item.module.mutations
      if (!mutations) continue
      if (Object.prototype.hasOwnProperty.call(mutations, type)) {
        result = {...result, [item.storePath]: state[item.storePath]}
      }
    }
    return result
  }
  return store => {
    let _SS = !SS || Array.isArray(SS) ? SS : [SS]
    let _LS = !LS || Array.isArray(LS) ? LS : [LS]
    // eslint-disable-next-line no-unused-vars
    let data
    let initSSData = null
    let initLSData = null
    if (_LS) {
      for (const item of _LS) {
        if (!checkParams(item)) {
          _LS = null
          break
        }
      }
      if (_LS) {
        initLSData = data = getState('localStorage')
      }
    }
    if (_SS) {
      for (const item of _SS) {
        if (!checkParams(item)) {
          _SS = null
          break
        }
      }
      if (_SS) {
        initSSData = getState('sessionStorage')
        data = initLSData ? {...initLSData, ...initSSData} : initSSData
      }
    }
    if (!_LS && !_SS) {
      getState().then(function (res) {
        res && store.replaceState(merge({}, store.state, res)) // {...store.state, ...data}
        setState(merge({}, store.state, res))
      })
    }

    // 当 store 初始化后调用
    store.subscribe((mutation, state) => {
      if (_LS) {
        let localData = dataHandle(_LS, mutation, state)
        if (localData) {
          initLSData = {...initLSData, ...localData}
          setState(initLSData, 'localStorage')
        }
        if (!_SS) return
      }

      if (_SS) {
        let sessionData = dataHandle(_SS, mutation, state)
        // 要和以前的合并
        if (sessionData) {
          initSSData = {...initSSData, ...sessionData}
          setState(initSSData, 'sessionStorage')
        }
        return
      }

      !LS && !SS && setState(state, `${mode !== 'SS' ? 'localStorage' : 'sessionStorage'}`)
    })
  }
}

export default vuexPersistence
