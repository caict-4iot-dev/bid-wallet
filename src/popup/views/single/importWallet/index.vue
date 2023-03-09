<template>
  <div class="app-wrapper app-bg-light">

    <headerSlot
      :title-name="this.$t('app.createWallet.importWallet')"
      :isShadow="false"
    >
    </headerSlot>

    <div class="main-container">
      <div class="main-container-wrapper">

        <noticeSlot
          notice-type="succeed">
          {{$t('app.createWallet.importWalletNotice')}}
        </noticeSlot>

        <div class="word-textarea">
          <appInput
            type="textarea"
            textRows="4"
            class-name="text-area-style"
            v-model="mnemonic"
          ></appInput>
        </div>

        <div class="form-import">
          <appForm :rules="rulesform" :model="modelform" ref="passForm">

            <appFormItem :label="this.$t('app.inputText.eType')" prop="eType">
              <encryptionType ref="encryptionRef"/>
            </appFormItem>

            <appFormItem :label="this.$t('app.inputText.password')" prop="password">
              <passWordInput v-model="modelform.password"></passWordInput>
            </appFormItem>

            <appFormItem :label="this.$t('app.inputText.vPassword')">
              <passWordInput v-model="modelform.rePassword"></passWordInput>
            </appFormItem>
          </appForm>

          <van-button type="info" class="btn-info width-stretch" @click="submitForm('passForm')" :loading="loading">
            {{$t('app.createWallet.importWallet')}}
          </van-button>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
import noticeSlot from '../../../compontents/slot/noticeSlot'
import appInput from '../../../compontents/modules/appInput'
import appForm from '../../../compontents/slot/formSlot/appForm'
import appFormItem from '../../../compontents/slot/formSlot/appFormItem'
import passWordInput from '../../../compontents/modules/passWordInput'
import encryptionType from '../../../compontents/modules/encryptionType'
import {hdPaths, pwPattern} from '../../../config/param'
import { mapMutations } from 'vuex'
import { alertMsg, verifyWord } from '../../../config/vanUtil'
import KeyUtil from '../../../../lib/keyUtil'
const keyUtil = new KeyUtil()

export default {
  name: 'importWallet',
  data () {
    return {
      isActive: true,
      rulesform: {
        password: [{required: true, message: this.$t('app.errorInfo.pw')}]
      },
      modelform: {
        password: '',
        rePassword: ''
      },
      mnemonic: '',
      loading: false
    }
  },
  components: {
    headerSlot,
    noticeSlot,
    appInput,
    appForm,
    appFormItem,
    passWordInput,
    encryptionType
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
      if (!this.mnemonic) {
        alertMsg(this.$t('app.errorInfo.mCodeRequest'))
        return false
      } else {
        if (!verifyWord(this.mnemonic)) {
          alertMsg(this.$t('app.errorInfo.mnemonic'))
          return false
        }
      }
      if (!this.modelform.password) {
        alertMsg(this.$t('app.errorInfo.pw'))
        return false
      } else {
        if (!this.modelform.password.match(pwPattern)) {
          alertMsg(this.$t('app.errorInfo.errPwForm'))
          return false
        }
      }

      const that = this
      this.$refs[form].validate(r => {
        if (r) {
          if (this.modelform.password === this.modelform.rePassword) {
            this.loading = true
            setTimeout(function () {
              that.submitVerify()
            }, 100)
          } else {
            alertMsg(this.$t('app.errorInfo.pwConfirm'))
          }
        } else {
        }
      })
    },
    submitVerify () {
      let crypto = this.$refs.encryptionRef.crypto
      keyUtil.privateKeyMnemonicCode(crypto, this.mnemonic, hdPaths).then(res => {
        if (res) {
          this.createAccount(res)
        }
      }).catch(error => {
      })
    },
    createAccount (key) {
      keyUtil.createNewAccount(this.modelform.password, key).then(res => {
        if (res) {
          // 清空keystoreData
          this.setKeystoreDataEmpty()
          let param = {
            keystoreData: res.keystoreData,
            accountName: 'Account 1',
            permissions: 'create'
          }
          this.setKeystoreData(param)
          this.setPassword(this.modelform.password)
          this.setActiveAccount({
            accountName: param.accountName,
            address: res.keystoreData.address
          })
          this.$router.push({path: '/home'})
        } else {
          this.loading = false
        }
      }).catch(error => {
        this.loading = false
        alertMsg(this.$t('app.errorInfo.import'))
      })
    }
  }
}
</script>

<style scoped>
.app-form-item {
  margin-bottom: 20px;
}
.word-textarea{ margin:22px 0  28px 0;}
/* .form-import .btn-info{ margin-top: 60px; } */

</style>
