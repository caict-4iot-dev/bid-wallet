<template>
  <van-dialog v-model="show" :title="this.$t('app.setting.createAccount')" :show-confirm-button="false">

   <div class="form-account-create">

      <appForm :rules="rulesform" :model="modelform" ref="createForm">
        <appFormItem :label="this.$t('app.inputText.eType')" prop="eType">
          <encryptionType ref="encryptionRef"/>
        </appFormItem>
        <appFormItem :label="this.$t('app.account.accountName')" >
          <app-input v-model="modelform.accountName" maxLength="20"></app-input>
        </appFormItem>

      </appForm>

       <div class="sub-btn-group" style="padding: 14px 0 35px 0;">
         <van-button
           plain
           type="info"
           class="btn-info fl"
           style="width: 120px; height: 35px"
           @click="show = false"
         >{{$t('app.btnText.cancel')}}</van-button>
         <van-button
           type="info"
           class="btn-info fr"
           style="width: 120px; height: 35px"
           @click="submitForm('createForm')"
         >{{$t('app.btnText.create')}}</van-button>
       </div>

   </div>

  </van-dialog>
</template>

<script>
import $event, { EVENT_NAME } from '../../../evenBus'

import appForm from '../../../compontents/slot/formSlot/appForm'
import appFormItem from '../../../compontents/slot/formSlot/appFormItem'
import appInput from '../../../compontents/modules/appInput'
import encryptionType from '../../../compontents/modules/encryptionType'
import { alertMsg } from '../../../config/vanUtil'
import { mapMutations } from 'vuex'
import { accountLength } from '../../../config/param'
import KeyUtil from '../../../../lib/keyUtil'
const keyUtil = new KeyUtil()

export default {
  name: 'createAccount',
  data () {
    return {
      show: false,
      crypto: 'TYPE_ED25519',
      rulesform: {
        accountName: [{required: true, message: this.$t('app.errorInfo.accountName')}]
      },
      modelform: {
        accountName: ''
      }
    }
  },
  components: {
    appForm,
    appFormItem,
    appInput,
    encryptionType
  },
  destroyed () {
    $event.$off(EVENT_NAME.CREATE_ACCOUNT)
  },
  created () {
    $event.$on(EVENT_NAME.CREATE_ACCOUNT, () => {
      this.getKeystoreData()
    })
  },
  mounted () {

  },
  methods: {
    ...mapMutations([
      'setKeystoreData',
      'setActiveAccount'
    ]),
    getKeystoreData () {
      let keystoreData = this.$store.state.bweVault.keystoreData
      if (keystoreData.length === accountLength) {
        alertMsg(this.$t('app.errorInfo.accountLimit'))
      } else {
        this.show = true
        this.modelform.accountName = `Account ${this.filterAccountName(keystoreData)}`
      }
    },
    filterAccountName (data) {
      let AccountNum = 1
      for (let i = 0; i < data.length; i++) {
        if (data[i].accountName.indexOf('Account') > -1) {
          AccountNum++
        }
      }
      return AccountNum
    },
    filterRepeatAccountName () {
      let keystoreData = this.$store.state.bweVault.keystoreData
      let repeatState = keystoreData.filter(item => item.accountName == this.modelform.accountName)
      return repeatState
    },
    submitForm (form) {
      this.$refs[form].validate(r => {
        if (r) {
          const repeatLength = this.filterRepeatAccountName()
          if (repeatLength.length > 0) {
            alertMsg(this.$t('app.errorInfo.repeatName'))
            return false
          }
          this.getPrivateKey()
        } else {
          // alertMsg('')
        }
      })
    },
    getPrivateKey () {
      let crypto = this.$refs.encryptionRef.crypto
      keyUtil.randomAccount(crypto).then(res => {
        if (res) {
          let password = this.$store.state.wallet.password
          this.createAccount(password, res.privateKey)
        }
      }).catch(error => {

      })
    },
    createAccount (password, key) {
      keyUtil.createNewAccount(password, key).then(res => {
        if (res) {
          alertMsg(this.$t('app.successInfo.create'))
          let param = {
            keystoreData: res.keystoreData,
            accountName: this.modelform.accountName
          }
          this.setKeystoreData(param)
          this.setActiveAccount({
            accountName: this.modelform.accountName,
            address: res.keystoreData.address
          })

          this.show = false
          this.modelform.accountName = ''
        }
      }).catch(error => {
        alertMsg(this.$t('app.errorInfo.create'))
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.form-account-create {
  padding: 23px 18px 20px;
}
</style>
