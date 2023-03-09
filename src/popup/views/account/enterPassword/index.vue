<template>
  <van-dialog v-model="show" :title="this.$t('app.account.enterPassword')" :show-confirm-button="false">
    <div class="dialog-content">
      <appForm :rules="rulesform" :model="modelform" ref="pwForm">

        <appFormItem :label="this.$t('app.account.accountPw')" prop="password">
          <passWordInput v-model="modelform.password"></passWordInput>
        </appFormItem>

      </appForm>

      <div class="sub-btn-group clearfix mt15">
        <van-button
          plain
          type="info"
          class="btn-info fl dialog-btn-layer"
          @click="close()"
        >{{$t('app.btnText.cancel')}}</van-button>

          <van-button
            type="info"
            class="btn-info fr dialog-btn-layer"
            @click="setPasswordVerify('pwForm')"
          >{{$t('app.btnText.confirm')}}</van-button>
      </div>
    </div>

  </van-dialog>
</template>

<script>
import appForm from '../../../compontents/slot/formSlot/appForm'
import appFormItem from '../../../compontents/slot/formSlot/appFormItem'
import passWordInput from '../../../compontents/modules/passWordInput'
import {alertMsg} from '../../../config/vanUtil'
export default {
  name: 'enterPassword',
  data () {
    return {
      show: false,
      rulesform: {
        password: [{required: true, message: this.$t('app.errorInfo.pwRequest')}]
      },
      modelform: {
        password: ''
      },
      verifyType: null
    }
  },
  components: {
    appForm,
    appFormItem,
    passWordInput
  },
  methods: {
    open (type) {
      this.show = true
      this.modelform.password = null
      this.verifyType = type
    },
    close () {
      this.modelform.password = null
      this.show = false
    },
    findKeyStoreArray () {
      const address = this.$store.state.bweVault.activeAccount.address
      const KeyStoreArray = this.$store.state.bweVault.keystoreData
      let obj = KeyStoreArray.find(e => e.keystoreData.address === address)
      return obj.keystoreData
    },
    setPasswordVerify (form) {
      this.$refs[form].validate(r => {
        if (r) {
          const password = this.$store.state.wallet.password
          if (password === this.modelform.password) {
            this.$emit('verifyPasswordResult', this.verifyType)
            this.close()
          } else {
            this.close()
            alertMsg(this.$t('app.errorInfo.pwError'))
          }
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
