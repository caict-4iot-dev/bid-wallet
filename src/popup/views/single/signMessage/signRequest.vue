<template>

  <div class="app-wrapper app-bg-light sign-rq">

    <div class="main-container container-no-header">

      <div class="main-container-wrapper">

        <div class="single-handle">
          <h3 class="wrapper-list-title">
            {{$t('app.sign.signTitle')}}
          </h3>
          <div class="account-small-def account-bg clearfix">
            <div class="user-photo">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhanghu"></use>
              </svg>
            </div>
            <div class="list-info">
              <label>
                {{accountName}}
              </label>
              <p>({{shorten(address)}})</p>
            </div>
          </div>

          <h3 class="wrapper-list-title">
            {{$t('app.sign.origin')}}
          </h3>
          <div class="account-small-def origin-bg clearfix">
            <div class="user-photo">
              <img :src="websiteInfo.icon" width="100%" height="100%" />
            </div>
            <div class="sign-url">
              {{websiteInfo.url}}
            </div>
          </div>

          <h3 class="wrapper-list-title">
            {{$t('app.sign.signData')}}
          </h3>

          <appInput
            :is-disabled="true"
            type="textarea"
            textRows="9"
            v-model="signMessage"
          ></appInput>
        </div>

        <div class="sub-btn-group clearfix" style="margin-top: 50px;">
          <van-button plain type="info" class="btn-info fl" @click="cancel">{{$t('app.btnText.cancel')}}</van-button>
          <van-button type="info" class="btn-info fr" @click="signSubmit" :loading="loading">{{$t('app.sign.signText')}}</van-button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
import appInput from '../../../compontents/modules/appInput'
import {shortenStr} from '../../../../lib/util'
import KeyUtil from '../../../../lib/keyUtil'
import {alertMsg} from '../../../config/vanUtil'
import * as MessageTypes from '../../../../message/MessageTypes'
import ResponseParam from '../../../../lib/responseParam'

const sjcl = require('brdc-sjcl')
const keyUtil = new KeyUtil()
const responseParam = new ResponseParam()
export default {
  name: 'signRequest',
  data () {
    return {
      checked: false,
      websiteInfo: {
        url: null,
        icon: null
      },
      accountName: null,
      address: null,
      signMessage: null,
      loading: false
    }
  },
  components: {
    headerSlot,
    appInput
  },
  methods: {
    shorten (address) {
      return shortenStr(address)
    },
    findKeyStoreArray () {
      const address = this.$store.state.bweVault.activeAccount.address
      const KeyStoreArray = this.$store.state.bweVault.keystoreData
      let obj = KeyStoreArray.find(e => e.keystoreData.address === address)
      return obj.keystoreData
    },
    signSubmit () {
      if (!this.signMessage) {
        alertMsg(this.$t('app.errorInfo.signMsg'))
        return false
      }
      const keystoreData = this.findKeyStoreArray()
      const password = this.$store.state.wallet.password
      this.loading = true
      setTimeout(() => {
        keyUtil.importAccountKeystoreFn(keystoreData, password).then((res) => {
          if (res) {
            this.signFn(this.signMessage, res)
          } else {
            this.loading = false
          }
        }).catch(error => {
          this.loading = false
        })
      }, 100)
    },
    signFn (message, privateKey) {
      let hexMessage = message
      if (!/^[A-Fa-f0-9]+$/.test(hexMessage)) {
        hexMessage = sjcl.codec.hex.fromBits(sjcl.codec.utf8String.toBits(hexMessage))
      }
      keyUtil.sign(hexMessage, privateKey).then((res) => {
        if (res) {
          let param = { signData: res, bid: this.address, message: message}
          this.getPublicKey(privateKey, param)
        } else {
          this.sendMsg({code: -1})
          alertMsg(this.$t('app.errorInfo.sign'))
        }
      }).catch(error => {
        this.sendMsg({code: -1})
        alertMsg(this.$t('app.errorInfo.sign'))
      })
    },
    getPublicKey (privateKey, param) {
      const self = this
      keyUtil.getPublicKeyServiceFn(privateKey).then((res) => {
        param.publicKey = res
        alertMsg(this.$t('app.successInfo.sign'), function () {
          self.sendMsg({code: 0, data: {...param}}, function () {
            window.close()
          })
        })
      }).catch(error => {
        this.sendMsg({code: -1}, '')
        alertMsg(this.$t('app.errorInfo.sign'))
      })
    },
    cancel () {
      window.removeEventListener('beforeunload', this.closeWindow)
      this.sendMsg({code: 1}, function () {
        window.close()
      })
    },
    closeWindow () {
      this.cancel()
    },
    sendMsg (param, fn) {
      this.loading = false
      const resultMsg = responseParam.resultObj({
        code: param.code,
        data: param.data,
        uuid: this.websiteInfo.uuid
      })
      chrome.tabs.sendMessage(Number(this.websiteInfo.tabId), {type: MessageTypes.SIGN_MESSAGE, ...resultMsg}, () => {
      })
      if (param.code !== -1) {
        window.removeEventListener('beforeunload', this.closeWindow)
      }
      if (fn) fn()
    }
  },
  mounted () {
    document.title = this.$t('app.sign.signRequest')
    this.websiteInfo = this.$route.query
    this.signMessage = this.$route.query.message
    this.accountName = this.$store.state.bweVault.activeAccount.accountName
    this.address = this.$store.state.bweVault.activeAccount.address
    window.addEventListener('beforeunload', this.closeWindow)
  },
  destroyed () {
    window.removeEventListener('beforeunload', this.closeWindow)
  }
}
</script>

<style lang="scss" scoped>
@import "../../../static/css/theme";

.sign-rq .account-bg {
  background-color:  $app-def-dark-color;
  margin-bottom: 15px;
}
.sign-rq .origin-bg {
  background-color: $app-box-msg-bg;
  margin-bottom: 30px;
}

.sign-rq .single-handle{
  margin-top: 15px;
}
</style>
