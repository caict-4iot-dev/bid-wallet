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
            {{ $t('app.sign.signAccount') }} <br>
             <label>{{ shortenStr(address) }}</label>
          </span>
        </targetBox>

        <!--    分割线    -->
        <van-divider/>

        <div class="single-handle">
          <h3 class="wrapper-list-title">
            {{ $t('app.sign.targetPermissions') }}
          </h3>
          <div class="account-def">
            <van-checkbox v-model="checked" shape="square" disabled>{{ $t('app.sign.targetPermissionsNote') }}
            </van-checkbox>
          </div>
        </div>

        <div class="sub-btn-group" style="margin-top: 80px;">
          <van-button plain type="info" class="btn-info fl" @click="cancel">{{ $t('app.btnText.cancel') }}</van-button>
          <van-button type="info" class="btn-info fr" @click="signSubmit" :loading="loading">
            {{ $t('app.btnText.connect') }}
          </van-button>
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
import {mapMutations} from 'vuex'
import KeyUtil from '../../../../lib/keyUtil'
import walletApi from '../../../service/api/walletApi'
import ResponseParam from '../../../../lib/responseParam'

const keyUtil = new KeyUtil()
const responseParam = new ResponseParam()

export default {
  name: 'signConfirm',
  data () {
    return {
      checked: true,
      websiteInfo: {
        url: null,
        icon: null,
        uuid: null,
        tabId: null
      },
      message: null,
      accountName: null,
      address: null,
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
      this.getRandomData()
    },
    getRandomData () {
      const data = {
        bid: this.address
      }
      walletApi.getAuthRandom(data).then(res => {
        this.message = res.data.randomStr
        this.$nextTick(() => {
          this.sign()
        })
      })
    },
    sign () {
      if (!this.message) {
        alertMsg(this.$t('app.errorInfo.sign'), function () {
          window.close()
        })
        return false
      }
      const keystoreData = this.findKeyStoreArray()
      const password = this.$store.state.wallet.password

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
          let param = {signData: res}
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
        let data = {
          randomStr: this.message,
          signBlob: param.signData,
          publicKey: res
        }
        this.toAuth(data)
      }).catch(error => {
        this.sendMsg({code: -1}, '')
        alertMsg(this.$t('app.errorInfo.sign'))
      })
    },
    toAuth (data) {
      const self = this
      walletApi.auth(data).then(res => {
        alertMsg(this.$t('app.successInfo.sign'), function () {
          self.sendMsg({
            code: 0,
            data: {
              accessToken: res.data.accessToken,
              publicKey: data.publicKey,
              bid: self.address
            }
          }, function () {
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
      this.loading = false

      const resultMsg = responseParam.resultObj({
        code: param.code,
        data: param.data,
        uuid: this.websiteInfo.uuid
      })
      chrome.tabs.sendMessage(Number(this.websiteInfo.tabId), {type: this.type, ...resultMsg}, () => {
      })
      if (fn) fn()
    }
  },
  mounted () {
    document.title = this.$t('app.sign.signRequest')
    this.websiteInfo = this.$route.query
    this.type = this.$route.query.type

    this.accountName = this.$store.state.bweVault.activeAccount.accountName
    this.address = this.$store.state.bweVault.activeAccount.address
  }
}
</script>

<style scoped>
.sign-cf .target-box {
  margin-bottom: 10px;
}


</style>
