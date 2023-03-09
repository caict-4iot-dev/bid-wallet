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
              <use xlink:href="#icon-Keystore"></use>
            </svg>
          </div>
          <div class="kind-content">
            <h2>Keystore导入</h2>
            <p>通过输入Keystore字符串进行导入</p>
          </div>
        </div>

        <div class="kind-input-content">
          <appForm :rules="rulesForm" :model="modelForm" ref="importForm">
            <appFormItem label="将账户KeystoreJSON字符串粘贴到以下文本框" prop="keystore">
              <app-input type="textarea" v-model.trim="modelForm.keystore" textRows="6"></app-input>
            </appFormItem>
          </appForm>
          <appFormItem :label="$t('app.account.keystorePwd')" prop="password">
            <passWordInput v-model.trim="modelForm.password"></passWordInput>
          </appFormItem>
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
import passWordInput from '../../../compontents/modules/passWordInput'
import passwordVerify from '../passwordVerify'
import {alertMsg} from '../../../config/vanUtil'
import { mapMutations } from 'vuex'
import KeyUtil from '../../../../lib/keyUtil'
const keyUtil = new KeyUtil()

export default {
  name: 'KindKeystore',
  data () {
    return {
      showPasswordVerify: false,
      modelForm: {
        keystore: '',
        password: ''
      },
      rulesForm: {
        keystore: [{required: true, message: this.$t('app.errorInfo.keyStoreRequest')}],
        password: [{required: true, message: this.$t('app.errorInfo.keystorePwEmpty')}]
      },
      keystoreData: null,
      pk: null,
      password: null
    }
  },
  components: {
    appForm,
    appFormItem,
    appInput,
    passWordInput,
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
          this.keystoreData = JSON.parse(this.modelForm.keystore)
          this.getPrivateKey()
        }
      })
    },
    getPrivateKey () {
      keyUtil.importAccountKeystoreFn(this.keystoreData, this.modelForm.password).then(res => {
        if (res) {
          this.pk = res
          this.showPasswordVerify = true
        } else {
          alertMsg(this.$t('app.errorInfo.keystorePwErr'))
        }
      }).catch(error => {
        alertMsg(this.$t('app.errorInfo.keystoreFail'))
      })
    },
    getPassword (password) {
      this.importAccount(password, this.pk)
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
          alertMsg(this.$t('app.errorInfo.keystoreFail'))
        }
      }).catch(error => {
        alertMsg(this.$t('app.errorInfo.keystoreFail'))
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
