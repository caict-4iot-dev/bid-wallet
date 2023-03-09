<template>
  <div class="app-wrapper app-bg-dark send-con">
    <div class="app-absolute app-loading-full" v-if="loading">
      <van-loading type="spinner" size="40"/>
    </div>

    <div class="main-container container-no-header">
      <div class="main-container-wrapper">
        <!-- tag -->
        <div class="content-fixed-r"></div>

        <div v-for="item in transactionData.operations" class="tran-list-view">
          <div class="account-small-single">
            <div class="account-small clearfix">
              <div class="user-photo">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-yonghu1"></use>
                </svg>
              </div>
              <div class="list-info">
                <label>
                  {{transactionData.source_address}}
                </label>
              </div>

              <div class="arrow-to">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-fangxiangxiangyou-shuang"></use>
                </svg>
              </div>

            </div>
          </div>

          <div class="arrow">

          </div>

          <div class="account-small-single">
            <div class="account-small clearfix">
              <div class="user-photo">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-yonghu2"></use>
                </svg>
              </div>
              <div class="list-info">
                <label>
                  {{item.pay_coin.dest_address}}
                </label>
              </div>
            </div>
          </div>

          <div class="transfer-data-detail">
            <div class="tabs-title">
              <div :class="{'active': isShow}" @click="isShow = true">{{$t('app.send.detail')}}</div>
              <div :class="{'active': !isShow}" @click="isShow = false">{{$t('app.send.data')}}</div>
            </div>
            <div class="content-box">
              <div class="detail-item" v-if="isShow">
                <div class="item-title">Total</div>
                <div class="item-value">
                  <span>Amount + gas fee</span>
                  <span class="fr">0 + {{transactionData.fee_limit}}</span>
                </div>
                <div class="item-total">
                  <span>{{transactionData.fee_limit}} </span>XHT
                </div>

              </div>
              <div class="data-item" v-else>
                <appInput type="textarea" textRows="6" v-model="item.pay_coin.input" disabled></appInput>
              </div>
            </div>
          </div>
        </div>

        <div class="btn-box">
          <div class="sub-btn-group">
            <van-button plain type="info" class="btn-info" style="margin-right: 45px" @click="cancel">{{$t('app.btnText.cancel')}}</van-button>
            <van-button type="info" class="btn-info" @click="signTranSubmit" :loading="loadingBtn">{{$t('app.sign.signText')}}</van-button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
import appInput from '../../../compontents/modules/appInput'
import KeyUtil from '../../../../lib/keyUtil'
import { mapMutations } from 'vuex'
import {alertMsg} from '../../../config/vanUtil'
import ExtensionStore from '../../../../lib/localStore'
import {msgType} from '../../../config/param'
const keyUtil = new KeyUtil()
export default {
  name: 'signMultipleBlobTransaction',
  data () {
    return {
      loading: false,
      windowData: {},
      transactionData: {},
      isShow: true,
      loadingBtn: false,
      privateKey: null,
      extensionStore: new ExtensionStore(),
      pageAddress: '',
      firstSignStr: null
    }
  },
  components: {
    headerSlot,
    appInput
  },
  methods: {
    ...mapMutations('wallet', [
      'setFirstTransitionInfo',
      'setSignSendOnce',
      'setSecondTransitionInfo'
    ]),
    getOnceSignBlob () {
      const that = this
      this.extensionStore.storageListener(function (changeKey, newValue) {
        if (changeKey === 'signSendOnce') {
          that.toNextSign(changeKey, newValue)
        }
      })
    },
    getTranData () {
      keyUtil.getTransactionFromBlobFn(this.windowData.blob).then(res => {
        res.transaction.fee_limit = this.transitionFn(res.transaction.fee_limit)
        this.transactionData = res.transaction
      })
    },
    transitionFn (uGas) {
      return keyUtil.uGasToGasFn(uGas.toString())
    },
    cancel () {
      this.sendMsg({code: 1}, function () {
        window.close()
      })
    },
    findKeyStoreArray () {
      const address = this.$store.state.bweVault.activeAccount.address
      const KeyStoreArray = this.$store.state.bweVault.keystoreData
      let obj = KeyStoreArray.find(e => e.keystoreData.address === address)
      return obj.keystoreData
    },
    signTranSubmit () {
      const keystoreData = this.findKeyStoreArray()
      const password = this.$store.state.wallet.password
      const that = this
      this.loadingBtn = true
      setTimeout(function () {
        keyUtil.importAccountKeystoreFn(keystoreData, password).then((res) => {
          if (res) {
            that.firstSignFn(res)
          } else {
            that.loadingBtn = false
            alertMsg(this.$t('app.errorInfo.sign'), function () {
              window.close()
            })
          }
        }).catch(error => {
          that.loadingBtn = false
          alertMsg(this.$t('app.errorInfo.sign'), function () {
            window.close()
          })
        })
      }, 100)
    },
    firstSignFn (privateKey) {
      keyUtil.sign(this.windowData.message, privateKey).then((res) => {
        if (res) {
          this.sendMsg({code: 0, signData: res}, '')
          this.privateKey = privateKey
        } else {
          this.sendMsg({code: -1}, '')
          alertMsg(this.$t('app.errorInfo.sign'))
        }
      }).catch(error => {
        this.sendMsg({code: -1}, '')
        alertMsg(this.$t('app.errorInfo.sign'))
      })
    },
    toNextSign (changeKey, newValue) {
      const randomResult = newValue.wallet.changeOptions[changeKey]
      if (randomResult.code === 0) {
        this.scSignFn(randomResult.param.message)
      }
    },
    scSignFn (message) {
      keyUtil.sign(message, this.privateKey).then((res) => {
        if (res) {
          let param = { signData: res }
          this.getPublicKey(param)
        } else {
          this.sendOverMsg({code: -1}, '')
          alertMsg(this.$t('app.errorInfo.sign'))
        }
      }).catch(error => {
        this.sendOverMsg({code: -1}, '')
        alertMsg(this.$t('app.errorInfo.sign'))
      })
    },
    getPublicKey (param) {
      keyUtil.getPublicKeyServiceFn(this.privateKey).then((res) => {
        param.publicKey = res
        this.sendOverMsg({code: 0, ...param}, '')
        alertMsg(this.$t('app.successInfo.sign'), function () {
          window.close()
        })
      }).catch(error => {
        this.sendOverMsg({code: -1}, '')
        alertMsg(this.$t('app.errorInfo.sign'))
      })
    },
    sendMsg (param, fn) {
      this.setFirstTransitionInfo({
        type: msgType.checkFirstTransitionSign,
        code: param.code,
        data: {
          signData: param.signData
        },
        timeStamp: new Date().getTime()
      })
      if (fn) fn()
    },
    sendOverMsg (param, fn) {
      this.loadingBtn = false
      this.setSecondTransitionInfo({
        type: msgType.checkSecondTransitionSign,
        code: param.code,
        data: {
          signData: param.signData,
          publicKey: param.publicKey
        },
        timeStamp: new Date().getTime()
      })
      if (fn) fn()
    },
    getActiveAccount () {
      const self = this
      this.pageAddress = this.$store.state.bweVault.activeAccount.address
      if (this.pageAddress !== this.windowData.address) {
        alertMsg(this.$t('app.errorInfo.switchAccount'), function () {
          self.cancel()
        })
      }
    }
  },
  mounted () {
    document.title = this.$t('app.sign.check')
    this.windowData = this.$route.query
    this.getOnceSignBlob()
    this.getTranData()
    const self = this
    setTimeout(function () {
      self.getActiveAccount()
      self.setFirstTransitionInfo({})
      self.setSignSendOnce({})
      self.setSecondTransitionInfo({})
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
@import "../../../static/css/theme";
.send-con {
  .content-fixed-r {
    margin-bottom: 10px;
    margin-top: 15px;
    //  .network-tag {
    //    margin-top: 0;
    //  }
  }
  .main-container-wrapper {
    padding-top: 10px;
    .account-small {
      background: #fff;

      .list-info {
        font-family: $app-HanSansCN-Bold;
      }
    }
    .arrow {
      height: 36px;
    }
  }
  .btn-box {
    position: fixed;
    bottom: 35px;
  }
}
.tran-list-view{ margin-bottom: 20px; }
</style>
