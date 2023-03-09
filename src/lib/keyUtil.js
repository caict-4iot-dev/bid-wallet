
import defaultNetworks from '../popup/config/network'
const BifWeb = require('bifchain-js-web')

export default class KeyUtil {
  constructor () {
    // init sdk
    this.serviceController = new ServiceController()
  }

  /**
   * @param {String} language, includes 'chinese' or 'english'
   * @returns {Promise}
   */
  generateMnemonicWord (random, language) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.generateMnemonicWordService(random, language)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * @param {String} mnemonic
   * @param {String} path
   * @returns {Promise}
   */
  privateKeyMnemonicCode (crypto, mnemonic, path) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.privateKeyMnemonicCodeService(crypto, mnemonic, path)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * @param {String} password
   * @param privatekey
   * @returns {Promise}
   */
  createNewAccount (password, privateKey) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.createNewAccountService({password, privateKey})
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * @returns {Promise}
   */
  randomAccount (crypto) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.randomGenerateService(crypto)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * @param keystoreContent
   * @param password
   * @returns {Promise}
   */
  importAccountKeystoreFn (keystoreContent, password) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.importAccountKeystoreService(keystoreContent, password)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * @param address
   * @returns {Promise}
   */
  getNonceAddress (address) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.getNonceAddressService(address)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * @param opt
   * @param privateKey
   * @returns {Promise}
   */
  payCoin (opt = {}, privateKey) {
    return new Promise((resolve, reject) => {
      try {
        this.serviceController.addOperationService(opt)
        this.serviceController.buildTransactionService(opt)
        this.serviceController.signTransactionService(privateKey).then((res) => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * @param  {string} uGas
   * @return {string}
   */
  uGasToGasFn (uGas) {
    if (!uGas) {
      return '0'
    }
    return this.serviceController.uGasToGasFnService(uGas)
  }

  /**
   * @param  {string} Gas
   * @return {string}
   */
  gasToUGasFn (Gas) {
    return this.serviceController.gasToUGasFnService(Gas)
  }

  /**
   * @param  {String} message
   * @return {String} privateKey
   */
  sign (message, privateKey) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.signService(message, privateKey)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  creatTransactionBlob (opt = {}) {
    return new Promise((resolve, reject) => {
      try {
        this.serviceController.addOperationService(opt)
        this.serviceController.buildTransactionService(opt)
        this.serviceController.getBlobService().then((res) => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  signTrans (txBlob, signatures) {
    return new Promise((resolve, reject) => {
      try {
        this.serviceController.signTransService(txBlob, signatures).then((res) => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  getPublicKeyServiceFn (privateKey) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.getPublicKeyService(privateKey)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  isAddressFn (address) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.isAddressService(address)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  getTransactionFromBlobFn (blob) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.getTransactionFromBlobService(blob)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  publicToAddress (publicKey) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.publicToAddressService(publicKey)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  createPublicKeystore (publicKey, password) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.createPublicKeystoreService(publicKey, password)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  encryptionKey (message, password) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.encryptionKeyService(message, password)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  getAccountInfo (address) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.getAccountInfoService(address)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  isPrivateKey (privateKey) {
    return this.serviceController.isPrivateKeyService(privateKey)
  }

  decryptKey (keystoreContent, password) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.serviceController.decryptKeyService(keystoreContent, password)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }
  verifySign (param) {
    return this.serviceController.verifySignService(param)
  }
}

class ServiceController {
  constructor () {
    this.bifWeb = new BifWeb({host: defaultNetworks.currentNetworkObj.rpcUrl})
  }

  createNewAccountService (params) {
    const reqBody = {
      password: params.password,
      privateKey: params.privateKey || ''
    }
    let accPrivateKey = null
    if (reqBody.privateKey !== '') {
      accPrivateKey = params.privateKey
    } else {
      const generateAccount = this.bifWeb.BifAccount.generate()
      accPrivateKey = generateAccount.privateKey
    }
    const keystoreData = this.bifWeb.BifAccount.createAccountKeystore(accPrivateKey, reqBody.password)
    const resultData = {
      keystoreData,
      accPublicKey: this.bifWeb.BifAccount.privateToPublic(accPrivateKey)
    }
    return resultData
  }

  getPublicKeyService (accPrivateKey) {
    return this.bifWeb.BifAccount.privateToPublic(accPrivateKey)
  }

  randomGenerateService (crypto) {
    const CRYPTO_TYPE = (type) => {
      if (type === 'TYPE_SM2') {
        return this.bifWeb.BifAccount.CRYPTO_SM2
      }
      return this.bifWeb.BifAccount.CRYPTO_ED25519
    }
    crypto = CRYPTO_TYPE(crypto)

    return this.bifWeb.BifAccount.generateByCryptoType(crypto)
  }

  generateMnemonicWordService (random, language) {
    return this.bifWeb.BifAccount.generateMnemonicCodeWithRandom(random, language)
  }

  privateKeyMnemonicCodeService (crypto, mnemonic, path) {
    const CRYPTO_TYPE = (type) => {
      if (type === 'TYPE_SM2') {
        return this.bifWeb.BifAccount.CRYPTO_SM2
      }
      return this.bifWeb.BifAccount.CRYPTO_ED25519
    }

    crypto = CRYPTO_TYPE(crypto)
    return this.bifWeb.BifAccount.privKeyFromMCodeAndCrypto(crypto, mnemonic, path)
  }

  getNonceAddressService (address) {
    return this.bifWeb.BifQuery.getNonceByAddress(address)
  }

  importAccountKeystoreService (keystoreContent, password) {
    return this.bifWeb.BifAccount.importAccountKeystore(keystoreContent, password)
  }

  addOperationService (opt) {
    this.bifWeb.BifTransaction.operations = []
    this.bifWeb.BifTransaction.addOperation('payCoin', opt)
  }

  buildTransactionService (opt) {
    this.bifWeb.BifTransaction.buildTransaction(opt)
  }

  async getBlobService () {
    return this.bifWeb.BifTransaction.blob
  }

  async signTransactionService (privateKey) {
    await this.bifWeb.BifTransaction.signTransaction(privateKey)
    const result = await this.bifWeb.BifTransaction.submitTransaction()
    return result
  }

  async signTransService (txBlob, signatures) {
    const result = await this.bifWeb.BifTransaction.submitTrans(txBlob, signatures)
    return result
  }

  signService (message, privateKey) {
    return this.bifWeb.BifSigner.sign(message, privateKey)
  }

  uGasToGasFnService (uGas) {
    return this.bifWeb.BifUnit.uGasToGas(uGas)
  }

  gasToUGasFnService (Gas) {
    return this.bifWeb.BifUnit.gasToUGas(Gas)
  }

  isAddressService (address) {
    return this.bifWeb.BifAccount.isAddress(address)
  }

  getTransactionFromBlobService (blob) {
    return this.bifWeb.BifQuery.getTransactionFromBlob(blob)
  }

  publicToAddressService (publicKey) {
    return this.bifWeb.BifAccount.publicToAddress(publicKey)
  }

  createPublicKeystoreService (publicKey, password) {
    const keystoreData = this.bifWeb.BifAccount.setSkeyStore(publicKey, password)
    const resultData = {
      keystoreData
    }
    return resultData
  }
  encryptionKeyService (message, password) {
    const keystoreData = this.bifWeb.BifAccount.setSkeyStore(message, password)
    const resultData = {
      keystoreData
    }
    return resultData
  }
  decryptKeyService (keystoreContent, password) {
    return this.bifWeb.BifAccount.getSkeyFromStore(keystoreContent, password)
  }

  getAccountInfoService (address) {
    return this.bifWeb.BifQuery.getAccountInfo(address)
  }
  isPrivateKeyService (privateKey) {
    return this.bifWeb.BifAccount.isPrivateKey(privateKey)
  }
  verifySignService (param) {
    return this.bifWeb.BifSigner.verify(param.message, param.signature, param.publicKey)
  }
}
