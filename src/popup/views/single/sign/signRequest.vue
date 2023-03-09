<template>
  <!--  签名  -->
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
            type="textarea"
            textRows="9"
            v-model="messageView"
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
import { mapMutations } from 'vuex'
import {shortenStr} from '../../../../lib/util'
import KeyUtil from '../../../../lib/keyUtil'
import {alertMsg} from '../../../config/vanUtil'
import {msgType} from '../../../config/param'
import BewExtension from '../../../../lib/extension'
import ResponseParam from '../../../../lib/responseParam'

const keyUtil = new KeyUtil()
const bewExtension = new BewExtension()
const responseParam = new ResponseParam()

export default {
  name: 'signRequest',
  data () {
    return {
      checked: false,
      websiteInfo: {
        url: null,
        icon: null,
        uuid: null
      },
      accountName: null,
      address: null,
      signMessage: null,
      messageView: '',
      tabId: null,
      loading: false
    }
  },
  components: {
    headerSlot,
    appInput
  },
  methods: {
    ...mapMutations('wallet', [
      'setSignInfo'
    ]),
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
      keyUtil.sign(message, privateKey).then((res) => {
        if (res) {
          let param = { signData: res, address: this.address }
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
          self.sendMsg({code: 0, data: param}, function () {
            window.close()
          })
        })
      }).catch(error => {
        this.sendMsg({code: -1}, '')
        alertMsg(this.$t('app.errorInfo.sign'))
      })
    },
    cancel () {
      this.sendMsg({code: 1}, function () {
        window.close()
      })
    },
    sendMsg (param, fn) {
      const resultMsg = responseParam.resultParam({
        code: param.code,
        data: param.data,
        uuid: this.websiteInfo.uuid
      })
      bewExtension.sendTabMessage(this.tabId, {type: msgType.sign, ...resultMsg})
      if (fn) fn()
    }
  },
  mounted () {
    document.title = this.$t('app.sign.signRequest')
    this.websiteInfo = this.$route.query
    this.websiteInfo.icon = this.$route.query.icon
    this.websiteInfo.url = this.$route.query.url
    this.websiteInfo.uuid = this.$route.query.uuid
    this.accountName = this.$route.query.accountName
    this.address = this.$route.query.address
    this.signMessage = this.$route.query.message
    this.messageView = this.$route.query.messageView
    this.tabId = this.$route.query.tabId
    this.setSignInfo({})
  }
}
</script>

<style lang="scss" scoped>
@import "../../../static/css/theme";

.sign-rq .account-bg {
  background-color: $app-def-dark-color;
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
