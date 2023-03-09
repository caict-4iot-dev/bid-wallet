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
        tabId: null,
        message: null
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
      this.sign()
    },
    sign () {
      if (!this.websiteInfo.randomCode) {
        const self = this
        this.loading = false
        alertMsg(this.$t('app.errorInfo.randomNone'), function () {
          self.sendMsg({code: -1}, function () {
            window.close()
          })
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
            this.signError()
          }
        }).catch(error => {
          this.signError()
        })
      }, 100)
    },
    signFn (privateKey) {
      keyUtil.sign(this.websiteInfo.randomCode, privateKey).then((res) => {
        if (res) {
          let param = {signData: res}
          this.getPublicKey(privateKey, param)
        } else {
          this.signError()
        }
      }).catch(error => {
        this.signError()
      })
    },
    getPublicKey (privateKey, param) {
      const self = this
      keyUtil.getPublicKeyServiceFn(privateKey).then((res) => {
        if (res) {
          alertMsg(this.$t('app.successInfo.sign'), function () {
            self.sendMsg({
              code: 0,
              data: {
                bid: self.address,
                publicKey: res,
                signData: param.signData,
                randomCode: self.websiteInfo.randomCode
              }
            }, function () {
              window.close()
            })
          })
        } else {
          this.signError()
        }
      }).catch(error => {
        this.signError()
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
    },
    signError () {
      const self = this
      this.loading = false
      alertMsg(this.$t('app.errorInfo.sign'), function () {
        self.sendMsg({code: -1}, function () {
          window.close()
        })
      })
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
