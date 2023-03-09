<template>
  <div class="app-wrapper app-bg-light">

    <!--  header  -->
    <headerSlot
      :title-name="this.$t('app.createWallet.createTitle')"
      :isShadow="true">
    </headerSlot>

    <div class="main-container">

      <div class="main-container-wrapper">

        <!--   notice   -->
        <noticeSlot
          notice-type="error">
          <div>.{{$t('app.createWallet.passwordNotice1')}}</div>
          <div>.{{$t('app.createWallet.passwordNotice2')}}</div>
          <div>.{{$t('app.createWallet.passwordNotice3')}}</div>
        </noticeSlot>

        <div class="form-mt-create">
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

          <van-button 
            type="info" 
            class="btn-info width-stretch create-btn-mt" 
            @click="submitForm('passForm')" 
            :loading="isLoading"
            :disabled="isDisabled"
          >
            {{$t('app.btnText.createNow')}}
          </van-button>

        </div>

      </div>

    </div>

  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
import noticeSlot from '../../../compontents/slot/noticeSlot'

import appForm from '../../../compontents/slot/formSlot/appForm'
import appFormItem from '../../../compontents/slot/formSlot/appFormItem'
import passWordInput from '../../../compontents/modules/passWordInput'
import encryptionType from '../../../compontents/modules/encryptionType'

import { alertMsg } from '../../../config/vanUtil'
import {pwPattern} from '../../../config/param'

export default {
  name: 'createWallet',
  data () {
    return {
      isActive: true,
      crypto: 'TYPE_ED25519',
      rulesform: {
        password: [{required: true, message: this.$t('app.errorInfo.pw')}]
      },
      isLoading: false,
      modelform: {
        password: '',
        rePassword: ''
      },
      isDisabled: true
    }
  },

  components: {
    headerSlot,
    noticeSlot,
    appForm,
    appFormItem,
    passWordInput,
    encryptionType
  },
  watch: {
    'modelform.password' () {
      if (this.modelform.password && this.modelform.rePassword) {
        this.isDisabled = false
      }
    },
    'modelform.rePassword' () {
      if (this.modelform.password && this.modelform.rePassword) {
        this.isDisabled = false
      }
    }
  },
  methods: {
    submitForm (form) {
      if (!this.modelform.password) {
        alertMsg(this.$t('app.errorInfo.pw'))
        return false
      } else {
        if (!this.modelform.password.match(pwPattern)) {
          alertMsg(this.$t('app.errorInfo.pwFormatRequest'))
          return false
        }
      }
      this.crypto = this.$refs.encryptionRef.crypto
      this.$refs[form].validate(r => {
        if (r) {
          if (this.modelform.password === this.modelform.rePassword) {
            this.isLoading = true
            this.$emit('setPw', this.modelform.password)
          } else {
            alertMsg(this.$t('app.errorInfo.pwConfirm'))
          }
        } else {
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.form-mt-create{
   padding-top: 24px;
   .app-form-item {
     margin-bottom: 16px;
   }
}
.create-btn-mt{ margin-top: 74px; }

</style>
