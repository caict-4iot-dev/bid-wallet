<template>
  <van-dialog v-model="show" :title="this.$t('app.account.accountName')" :show-confirm-button="false">
    <div class="dialog-content">
      <appForm :rules="rulesform" :model="modelform" ref="userForm">

        <appFormItem :label="this.$t('app.account.accountName')" prop="name">
          <appInput v-model="modelform.name"></appInput>
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
          @click="setName('userForm')"
        >{{$t('app.btnText.confirm')}}</van-button>
      </div>
    </div>

  </van-dialog>
</template>

<script>
import appForm from '../../../compontents/slot/formSlot/appForm'
import appFormItem from '../../../compontents/slot/formSlot/appFormItem'
import appInput from '../../../compontents/modules/appInput'
import { mapMutations } from 'vuex'
import {alertMsg} from '../../../config/vanUtil'
export default {
  name: 'editUser',
  data () {
    return {
      show: false,
      rulesform: {
        name: [{required: true, message: this.$t('app.errorInfo.nameRequest')}]
      },
      modelform: {
        name: ''
      }
    }
  },
  components: {
    appForm,
    appFormItem,
    appInput
  },
  methods: {
    ...mapMutations([
      'setActiveAccountName',
      'setKeystoreDataNewData'
    ]),
    open () {
      this.show = true
      this.modelform.name = this.$store.state.bweVault.activeAccount.accountName
    },
    close () {
      this.modelform.name = null
      this.show = false
    },
    findKeyStoreArray () {
      const address = this.$store.state.bweVault.activeAccount.address
      const KeyStoreArray = this.$store.state.bweVault.keystoreData
      for (let i = 0; i < KeyStoreArray.length; i++) {
        if (KeyStoreArray[i].keystoreData.address === address) {
          KeyStoreArray[i].accountName = this.modelform.name
        }
      }
      this.setKeystoreDataNewData(KeyStoreArray)
    },
    filterRepeatAccountName () {
      let keystoreData = this.$store.state.bweVault.keystoreData
      let repeatState = keystoreData.filter(item => item.accountName == this.modelform.name)
      return repeatState
    },
    setName (form) {
      this.$refs[form].validate(r => {
        if (r) {
          const repeatLength = this.filterRepeatAccountName()
          if (repeatLength.length > 0) {
            alertMsg(this.$t('app.errorInfo.repeatName'))
            return false
          }
          const that = this
          this.findKeyStoreArray()
          this.setActiveAccountName(this.modelform.name)
          alertMsg(this.$t('app.successInfo.update'), function () {
            that.close()
          })
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
