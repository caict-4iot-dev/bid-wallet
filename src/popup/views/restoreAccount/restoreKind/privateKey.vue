<template>
  <div class="fullScreen-layer">
    <img src="../../../static/images/hardware-top-img.png" class="top-left-img"/>
    <img src="../../../static/images/hardware-footer-img.png" class="footer-right-img"/>


    <div class="full-screen-wrapper flex-wrapper main-container-wrapper app-bg-light">

      <div class="restore-kind-layer">
        <h1>{{$t('app.welcome.restoreAccountTitle')}}</h1>
        <div class="kind-box">
          <div class="restore-icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-siyuedaoru1"></use>
            </svg>
          </div>
          <div class="kind-content">
            <h2>私钥明文串</h2>
            <p>通过输入明文私钥字符串进行导入</p>
          </div>
        </div>

        <div class="kind-input-content">
          <appForm :rules="rulesForm" :model="modelForm" ref="importForm">
            <appFormItem label="请将私钥明文串粘贴以下文本框" prop="privateKey">
              <app-input type="textarea" v-model.trim="modelForm.privateKey" textRows="6"></app-input>
            </appFormItem>
          </appForm>
        </div>

        <van-button
          type="info"
          class="btn-info fr"
          style="width: 100%; height: 42px;margin-top: 70px"
          @click="submitForm('importForm')"
        >{{$t('app.btnText.next')}}</van-button>

      </div>

    </div>
    <passwordVerify
      ref="passwordVerify"
      @setPassword="getPassword"
      v-if="showPasswordVerify"
    ></passwordVerify>
  </div>
</template>

<script>
import appForm from '../../../compontents/slot/formSlot/appForm'
import appFormItem from '../../../compontents/slot/formSlot/appFormItem'
import appInput from '../../../compontents/modules/appInput'
import passwordVerify from '../passwordVerify'
import {alertMsg} from '../../../config/vanUtil'
import { mapMutations } from 'vuex'
import KeyUtil from '../../../../lib/keyUtil'
const keyUtil = new KeyUtil()

export default {
  name: 'PrivateKey',
  data () {
    return {
      showPasswordVerify: false,
      modelForm: {
        privateKey: ''
      },
      rulesForm: {
        privateKey: [{required: true, message: this.$t('app.errorInfo.privateKeyRequest')}]
      }
    }
  },
  components: {
    appForm,
    appFormItem,
    appInput,
    passwordVerify
  },
  methods: {
    ...mapMutations([
      'setKeystoreData',
      'setActiveAccount',
      'setKeystoreDataEmpty'
    ]),
    ...mapMutations('wallet', [
      'setPassword'
    ]),
    submitForm (form) {
      this.$refs[form].validate(r => {
        if (r) {
          const isPrivateKeyData = keyUtil.isPrivateKey(this.modelForm.privateKey)
          if (!isPrivateKeyData) {
            alertMsg(this.$t('app.errorInfo.privateKeyFail'))
            return false
          }
          this.showPasswordVerify = true
        }
      })
    },
    getPassword (password) {
      this.importAccount(password, this.modelForm.privateKey)
    },
    importAccount (password, key) {
      keyUtil.createNewAccount(password, key).then(res => {
        if (res) {
          // 清空keystoreData
          this.setKeystoreDataEmpty()
          let param = {
            keystoreData: res.keystoreData,
            accountName: 'Account 1',
            permissions: 'create'
          }
          this.setKeystoreData(param)
          this.setPassword(password)
          this.setActiveAccount({
            accountName: 'Account 1',
            address: res.keystoreData.address
          })
          const self = this
          alertMsg(this.$t('app.successInfo.import'), function () {
            self.$router.push({path: '/restoreResult'})
          })
        } else {
          alertMsg(this.$t('app.errorInfo.privateKeyFail'))
        }
      }).catch(error => {
        console.log(error)
        alertMsg(this.$t('app.errorInfo.privateKeyFail'))
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
