<template>
  <div class="app-wrapper app-bg-dark sign-cf">

    <div class="main-container">

      <div class="main-container-wrapper">
        <!--    目标页信息展示组件    -->
        <targetBox
          :url="websiteInfo.url"
          :icon="websiteInfo.icon"
        >
           <span class="target-title">
            {{$t('app.sign.signAccount')}} <br>
             <label>{{shortenStr(address)}}</label>
          </span>
        </targetBox>

        <!--    分割线    -->
        <van-divider />

        <div class="single-handle">
          <h3 class="wrapper-list-title">
            {{$t('app.sign.targetPermissions')}}
          </h3>
          <div class="account-def">
            <van-checkbox v-model="checked" shape="square" disabled>{{$t('app.sign.targetPermissionsNote')}}</van-checkbox>
          </div>
        </div>

        <div class="sub-btn-group" style="margin-top: 80px;">
          <van-button plain type="info" class="btn-info fl" @click="cancel">{{$t('app.btnText.cancel')}}</van-button>
          <van-button type="info" class="btn-info fr" @click="signSubmit" :loading="loading">{{$t('app.btnText.connect')}}</van-button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
import targetBox from '../../../compontents/modules/targetBox'
import {shortenStr} from '../../../../lib/util'
import {alertMsg} from '../../../config/vanUtil'
import { mapMutations } from 'vuex'
import KeyUtil from '../../../../lib/keyUtil'
const keyUtil = new KeyUtil()

export default {
  name: 'signConfirm',
  data () {
    return {
      checked: true,
      websiteInfo: {
        url: null,
        icon: null,
        uuid: null
      },
      accountName: null,
      address: null,
      message: null,
      messageView: '',
      type: null,
      loading: false
    }
  },
  components: {
    headerSlot,
    targetBox
  },
  methods: {
    ...mapMutations('wallet', [
      'setSignResult',
      'setSignSendRandom'
    ]),
    shortenStr (str) {
      return shortenStr(str)
    },
    findKeyStoreArray () {
      const address = this.$store.state.bweVault.activeAccount.address
      const KeyStoreArray = this.$store.state.bweVault.keystoreData
      let obj = KeyStoreArray.find(e => e.keystoreData.address === address)
      return obj.keystoreData
    },
    signSubmit () {
      if (!this.message) {
        alertMsg(this.$t('app.errorInfo.sign'), function () {
          window.close()
        })
        return false
      }
      const keystoreData = this.findKeyStoreArray()
      const password = this.$store.state.wallet.password
      const address = this.$store.state.bweVault.activeAccount.address

      this.loading = true
      setTimeout(() => {
        keyUtil.importAccountKeystoreFn(keystoreData, password).then((res) => {
          if (res) {
            this.signFn(res)
          } else {
            this.loading = false
          }
        }).catch(error => {
          this.loading = false
        })
      }, 100)
    },
    signFn (privateKey) {
      keyUtil.sign(this.message, privateKey).then((res) => {
        if (res) {
          let param = { signData: res }
          this.getPublicKey(privateKey, param)
        } else {
          this.sendMsg({code: -1}, '')
          alertMsg(this.$t('app.errorInfo.sign'))
        }
      }).catch(error => {
        this.sendMsg({code: -1}, '')
        alertMsg(this.$t('app.errorInfo.sign'))
      })
    },
    getPublicKey (privateKey, param) {
      keyUtil.getPublicKeyServiceFn(privateKey).then((res) => {
        param.publicKey = res
        this.sendMsg({code: 0, ...param}, '')
        alertMsg(this.$t('app.successInfo.sign'), function () {
          window.close()
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
      this.loading = false
      this.setSignResult({
        type: this.type,
        code: param.code,
        uuid: this.websiteInfo.uuid,
        data: {
          address: this.address,
          message: this.message,
          signData: param.signData,
          publicKey: param.publicKey
        },
        timeStamp: new Date().getTime()
      })
      if (fn) fn()
    }
  },
  mounted () {
    document.title = this.$t('app.sign.signRequest')
    this.setSignResult({})
    this.setSignSendRandom({})
    this.websiteInfo.icon = this.$route.query.icon
    this.websiteInfo.url = this.$route.query.url
    this.websiteInfo.uuid = this.$route.query.uuid
    this.accountName = this.$route.query.accountName
    this.address = this.$route.query.address
    this.message = this.$route.query.message
    this.type = this.$route.query.type
  }
}
</script>

<style scoped>
.sign-cf .target-box{ margin-bottom: 10px; }


</style>
