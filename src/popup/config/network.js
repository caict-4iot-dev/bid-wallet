const networkEnvironment = {
  development: {
    rpcUrl: '' // 开发环境 后台服务地址
  },
  production: {
    rpcUrl: '' // 生产环境 后台服务地址
  }
}

let currentNetworkObj = null
if (process.env.NODE_ENV) {
  currentNetworkObj = networkEnvironment[process.env.NODE_ENV] || networkEnvironment.production
} else {
  currentNetworkObj = networkEnvironment.production
}

export default {
  currentNetworkObj
}
