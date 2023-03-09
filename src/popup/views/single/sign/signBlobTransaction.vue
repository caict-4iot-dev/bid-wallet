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
                  <span class="fr">
                    <label v-if="item.pay_coin.amount">{{item.pay_coin.amount}}</label>
                    <label v-else>0</label>

                    + {{transactionData.fee_limit}}
                  </span>
                </div>
                <div class="item-total">
                  <span v-if="item.pay_coin.amount">{{item.pay_coin.totleAmount}} </span>
                  <span v-else>{{transactionData.fee_limit}} </span>
                  XHT
                </div>

              </div>
              <div class="data-item" v-else>
                <appInput type="textarea" textRows="6" v-model="item.pay_coin.input" disabled></appInput>
              </div>
            </div>
          </div>
        </div>

        <div class="content-foot-handle">
          <van-button plain type="info" class="btn-info" @click="cancel">{{$t('app.btnText.cancel')}}</van-button>
          <van-button type="info" class="btn-info" @click="signTranSubmit" :loading="loadingBtn">{{$t('app.sign.signText')}}</van-button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
import appInput from '../../../compontents/modules/appInput'
import KeyUtil from '../../../../lib/keyUtil'
import { mapMutations, mapState } from 'vuex'
import {alertMsg} from '../../../config/vanUtil'
import {msgType} from '../../../config/param'
import { BigNumber } from 'bignumber.js'
import BewExtension from '../../../../lib/extension'
import ResponseParam from '../../../../lib/responseParam'

const keyUtil = new KeyUtil()
const bewExtension = new BewExtension()
const responseParam = new ResponseParam()
export default {
  name: 'signBlobTransaction',
  data () {
    return {
      loading: true,
      windowData: {},
      transactionData: {},
      isShow: true,
      loadingBtn: false,
      pageAddress: ''
    }
  },
  components: {
    headerSlot,
    appInput
  },
  computed: {
    ...mapState({
      address: state => state.bweVault.activeAccount.address
    })
  },
  watch: {
    address () {
      this.pageAddress = this.address
    }
  },
  methods: {
    ...mapMutations('wallet', [
      'setTransitionInfo'
    ]),
    ...mapMutations([
      'setActiveAccount'
    ]),
    getTranData () {
      keyUtil.getTransactionFromBlobFn(this.windowData.message).then(res => {
        res.transaction.fee_limit = this.transitionFn(res.transaction.fee_limit)
        this.transactionData = res.transaction
        for (let i = 0; i < this.transactionData.operations.length; i++) {
          if (this.transactionData.operations[i].pay_coin.amount) {
            this.transactionData.operations[i].pay_coin.amount = this.transitionFn(this.transactionData.operations[i].pay_coin.amount)
            this.transactionData.operations[i].pay_coin.totleAmount = BigNumber(this.transactionData.operations[i].pay_coin.amount).plus(this.transactionData.fee_limit)
          }
        }
      }).catch(error => {
        const self = this
        alertMsg(this.$t('app.errorInfo.blobSign'), function () {
          self.sendMsgWarn({code: -1, message: self.$t('app.errorInfo.blobSign')}, function () {
            window.close()
          })
        })
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
      const address = this.windowData.address ? this.windowData.address : this.$store.state.bweVault.activeAccount.address
      const KeyStoreArray = this.$store.state.bweVault.keystoreData
      let obj = KeyStoreArray.find(e => e.keystoreData.address === address)
      return obj
    },
    signTranSubmit () {
      const keystoreData = this.findKeyStoreArray()
      const password = this.$store.state.wallet.password
      const that = this
      this.loadingBtn = true
      setTimeout(function () {
        keyUtil.importAccountKeystoreFn(keystoreData.keystoreData, password).then((res) => {
          if (res) {
            that.signFn(res)
          } else {
            alertMsg(that.$t('app.errorInfo.sign'), function () {
              that.sendMsgWarn({code: -1, message: that.$t('app.errorInfo.sign')}, function () {
                window.close()
              })
            })
          }
        }).catch(error => {
          alertMsg(that.$t('app.errorInfo.sign'), function () {
            that.sendMsgWarn({code: -1, message: that.$t('app.errorInfo.sign')}, function () {
              window.close()
            })
          })
        })
      }, 100)
    },
    signFn (privateKey) {
      const that = this
      keyUtil.sign(this.windowData.message, privateKey).then((res) => {
        if (res) {
          let param = { signData: res }
          this.getPublicKey(privateKey, param)
        } else {
          alertMsg(that.$t('app.errorInfo.sign'), function () {
            that.sendMsgWarn({code: -1, message: that.$t('app.errorInfo.sign')}, function () {
              window.close()
            })
          })
        }
      }).catch(error => {
        alertMsg(that.$t('app.errorInfo.sign'), function () {
          that.sendMsgWarn({code: -1, message: that.$t('app.errorInfo.sign')}, function () {
            window.close()
          })
        })
      })
    },
    getPublicKey (privateKey, param) {
      const self = this
      keyUtil.getPublicKeyServiceFn(privateKey).then((res) => {
        param.publicKey = res
        alertMsg(this.$t('app.successInfo.sign'), function () {
          self.sendMsg({code: 0, data: param}, function () {
            window.close()
          })
        })
      }).catch(error => {
        alertMsg(self.$t('app.errorInfo.sign'), function () {
          self.sendMsgWarn({code: -1, message: self.$t('app.errorInfo.sign')}, function () {
            window.close()
          })
        })
      })
    },
    sendMsgWarn (param, fn) {
      this.loadingBtn = false
      const resultMsg = responseParam.resultParam({
        code: param.code,
        uuid: this.windowData.uuid,
        message: param.message
      })
      bewExtension.sendTabMessage(this.windowData.tabId, {type: msgType.checkTransitionSign, ...resultMsg})
      if (fn) fn()
    },
    sendMsg (param, fn) {
      if (param.data) {
        param.data.message = this.windowData.message
      }

      const resultMsg = responseParam.resultParam({
        code: param.code,
        data: param.data,
        uuid: this.windowData.uuid
      })
      bewExtension.sendTabMessage(this.windowData.tabId, {type: msgType.checkTransitionSign, ...resultMsg})
      if (fn) fn()
    },
    getActiveAccount () {
      const self = this
      this.pageAddress = this.$store.state.bweVault.activeAccount.address
      if (this.pageAddress !== this.windowData.address) {
        return false
      }
      return true
    },
    resultToPage () {

    },
    changeAccount (item) {
      this.setActiveAccount({
        accountName: item.accountName,
        address: item.keystoreData.address
      })
    },
    hasAccount () {
      const that = this
      if (this.windowData.address) {
        const keystore = this.findKeyStoreArray()
        if (!keystore) {
          alertMsg(that.$t('app.errorInfo.noAccount'), function () {
            that.sendMsgWarn({code: -1, message: that.$t('app.errorInfo.noAccount')}, function () {
              window.close()
            })
          })
        } else {
          if (!this.getActiveAccount()) {
            this.changeAccount(keystore)
          }
        }
      } else {
        this.getActiveAccount()
      }
    }
  },
  mounted () {
    document.title = this.$t('app.sign.check')
    this.windowData = this.$route.query
    this.getTranData()
    const self = this
    setTimeout(function () {
      self.hasAccount()
      self.setTransitionInfo({})
      self.loading = false
    }, 500)
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
