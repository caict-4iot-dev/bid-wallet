<template>
  <van-dialog v-model="show" :title="this.$t('app.setting.importAccount')" :show-confirm-button="false" className="import-dialog">

   <div class="form-account-import">

      <appForm :rules="rulesform" :model="modelform" ref="importForm">

        <appFormItem :label="this.$t('app.account.accountName')" prop="accountName">
          <app-input v-model="modelform.accountName"></app-input>
        </appFormItem>

        <appFormItem :label="this.$t('app.account.selectType')" >

          <div class="type-item">

            <div class="item-icon">

              <div class="icon-key">
                <svg class="icon" aria-hidden="true" v-if="typeFlag === '0'">
                  <use xlink:href="#icon-siyuedaoru" ></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="typeFlag === '1'">
                  <use xlink:href="#icon-a-keystoredaoru"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="typeFlag === '2'">
                  <use xlink:href="#icon-zhujicidaoru" ></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="typeFlag === '3'">
                  <use xlink:href="#icon-yingjianqianbaoicon"></use>
                </svg>
              </div>
              <span class="">{{typeName}}</span>
              <i class="down-icon" @click="isTypeShow = !isTypeShow">
                <van-icon name="arrow-down" color="#c4c4c4"/>
              </i>
            </div>

            <div class="item-desc">{{ typeDesc }}</div>

            <div class="account-type" v-if="isTypeShow">

              <div class="account-item" @click="selectAccount('0')">
                <i class="acc-icon">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-siyuedaoru" ></use>
                  </svg>
                </i>
                <span class="acc-type">
                    {{$t('app.account.privateKey')}}
                </span>
              </div>

              <div class="account-item" @click="selectAccount('1')">
                <i class="acc-icon">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-a-keystoredaoru"></use>
                  </svg>
                </i>
                <span class="acc-type">
                    {{$t('app.account.keystore')}}
                </span>
              </div>

              <div class="account-item" @click="selectAccount('2')">
                <i class="acc-icon">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhujicidaoru"></use>
                  </svg>
                </i>
                <span class="acc-type">
                    {{$t('app.account.mnemonic')}}
                </span>
              </div>

            </div>

          </div>

        </appFormItem>

        <appFormItem :label="$t('app.account.keyNotice')" v-if="typeFlag === '0'">
          <app-input type="textarea" v-model="modelform.key" textRows="4"></app-input>
        </appFormItem>

        <appFormItem :label="$t('app.account.keyStoreNotice')" v-if="typeFlag === '1'">
          <app-input type="textarea" v-model="modelform.keystore" textRows="4"></app-input>
        </appFormItem>

        <appFormItem :label="$t('app.account.keystorePwd')" v-if="typeFlag === '1'">
          <passWordInput v-model="modelform.password"></passWordInput>
        </appFormItem>

        <appFormItem :label="$t('app.account.eType')" v-if="typeFlag === '2'">
          <encryptionType ref="encryptionRef"/>
        </appFormItem>

        <appFormItem :label="$t('app.account.inputMnemonic')" v-if="typeFlag === '2'">
          <app-input
            type="textarea"
            v-model.trim="modelform.mnemonic"
            textRows="4"
            :placeholder="$t('app.account.mnemonicPla')"
          ></app-input>
        </appFormItem>

      </appForm>

       <div class="sub-btn-group" style="padding: 8px 0 35px 0;">
         <van-button
           plain
           type="info"
           class="btn-info fl"
           style="width: 120px; height: 35px"
           @click="cancel('importForm')"
         >{{$t('app.btnText.cancel')}}</van-button>
         <van-button
           type="info"
           class="btn-info fr"
           :loading="loadingBtn"
           style="width: 120px; height: 35px"
           @click="submitForm('importForm')"
         >{{$t('app.btnText.import')}}</van-button>
       </div>

   </div>

  </van-dialog>
</template>

<script>
import $event, { EVENT_NAME } from '../../../evenBus'
import appForm from '../../../compontents/slot/formSlot/appForm'
import appFormItem from '../../../compontents/slot/formSlot/appFormItem'
import appInput from '../../../compontents/modules/appInput'
import passWordInput from '../../../compontents/modules/passWordInput'
import encryptionType from '../../../compontents/modules/encryptionType'
import { hdPaths, encryption, accountLength } from '../../../config/param'
import { alertMsg, verifyWord } from '../../../config/vanUtil'
import { mapMutations } from 'vuex'
import BewController from '../../../../extensionService/controller/bewController'
import KeyUtil from '../../../../lib/keyUtil'
const keyUtil = new KeyUtil()
const bewController = new BewController()

export default {
  name: 'importAccount',
  data () {
    return {
      show: false,
      isActive: true,
      rulesform: {
        accountName: [{required: true, message: this.$t('app.errorInfo.accountName')}]
      },
      isTypeShow: false,
      typeFlag: '0',
      typeName: this.$t('app.account.privateKey'),
      typeDesc: this.$t('app.account.importPrivateKey'),
      modelform: {
        accountName: '',
        key: '',
        keystore: '',
        password: '',
        crypto: '',
        mnemonic: ''
      },
      keystoreData: {},
      loadingBtn: false
    }
  },
  components: {
    appForm,
    appFormItem,
    appInput,
    passWordInput,
    encryptionType
  },
  created () {
    $event.$on(EVENT_NAME.IMPORT_ACCOUNT, () => {
      this.getKeystoreData()
    })
  },
  mounted () {
  },
  destroyed () {
    $event.$off(EVENT_NAME.IMPORT_ACCOUNT)
  },
  methods: {
    ...mapMutations([
      'setKeystoreData',
      'setActiveAccount'
    ]),

    selectAccount (type) {
      this.typeFlag = type
      if (type === '0') {
        this.typeName = this.$t('app.account.privateKey')
        this.typeDesc = this.$t('app.account.importPrivateKey')
      } else if (type === '1') {
        this.typeName = this.$t('app.account.keystore')
        this.typeDesc = this.$t('app.account.importKeystore')
      } else if (type === '2') {
        this.$nextTick(() => {
          this.$refs.encryptionRef.setDefConfig()
        })
        this.typeName = this.$t('app.account.mnemonic')
        this.typeDesc = this.$t('app.account.importmnemonic')
      }
      this.isTypeShow = false
    },

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
      const that = this
      this.$refs[form].validate(r => {
        if (r) {
          const repeatLength = this.filterRepeatAccountName()
          if (repeatLength.length > 0) {
            alertMsg(this.$t('app.errorInfo.repeatName'))
            return false
          }
          if (this.typeFlag === '0') {
            // 私钥导入
            if (!this.modelform.key) {
              alertMsg(this.$t('app.errorInfo.privateKeyRequest'))
              return false
            }
            let password = this.$store.state.wallet.password
            this.loadingBtn = true
            setTimeout(function () {
              that.importAccount(password, that.modelform.key)
            }, 100)
          } else if (this.typeFlag === '1') {
            // keystore导入
            if (!this.modelform.keystore) {
              alertMsg(this.$t('app.errorInfo.keyStoreRequest'))
              return false
            }
            if (!this.modelform.password) {
              alertMsg(this.$t('app.errorInfo.keystorePwEmpty'))
              return false
            }
            this.loadingBtn = true
            setTimeout(function () {
              that.importKeystore()
            }, 100)
          } else if (this.typeFlag === '2') {
            // 助记词导入
            if (!this.modelform.mnemonic) {
              alertMsg(this.$t('app.errorInfo.mCodeRequest'))
              return false
            } else {
              if (!verifyWord(this.modelform.mnemonic)) {
                alertMsg(this.$t('app.errorInfo.mnemonic'))
                return false
              }
            }
            this.loadingBtn = true
            setTimeout(function () {
              that.submitVerify()
            }, 100)
          }
        }
      })
    },
    cancel (form) {
      this.initForm()
    },

    importKeystore () {
      let obj = {}
      try {
        this.keystoreData = JSON.parse(this.modelform.keystore)
      } catch (e) {
        alertMsg(this.$t('app.errorInfo.keystoreFail'))
        this.loadingBtn = false
        return false
      }

      const KeyStoreArray = this.$store.state.bweVault.keystoreData
      obj = KeyStoreArray.find(e => e.keystoreData.address === this.keystoreData.address)
      if (!obj) {
        keyUtil.importAccountKeystoreFn(this.keystoreData, this.modelform.password).then(res => {
          if (res) {
            this.createAccount(res)
          } else {
            this.loadingBtn = false
            alertMsg(this.$t('app.errorInfo.keystorePwErr'))
          }
        }).catch(error => {
          this.loadingBtn = false
          alertMsg(this.$t('app.errorInfo.keystoreFail'))
        })
      } else {
        this.loadingBtn = false
        alertMsg(this.$t('app.errorInfo.accountRepeat'))
      }
    },
    submitVerify () {
      let crypto = this.$refs.encryptionRef.crypto
      keyUtil.privateKeyMnemonicCode(crypto, this.modelform.mnemonic, hdPaths).then(res => {
        if (res) {
          this.createAccount(res)
        }
      }).catch(error => {
      })
    },
    createAccount (privateKey) {
      let password = this.$store.state.wallet.password
      keyUtil.createNewAccount(password, privateKey).then(res => {
        if (res) {
          const newAddress = res.keystoreData.address
          const KeyStoreArray = this.$store.state.bweVault.keystoreData
          let obj = KeyStoreArray.find(e => e.keystoreData.address === newAddress)
          if (obj) {
            this.loadingBtn = false
            alertMsg(this.$t('app.errorInfo.accountRepeat'))
            return false
          }
          alertMsg(this.$t('app.successInfo.import'))
          let param = {
            keystoreData: res.keystoreData,
            accountName: this.modelform.accountName
          }
          this.setKeystoreData(param)
          this.setActiveAccount({
            accountName: this.modelform.accountName,
            address: res.keystoreData.address
          })

          this.initForm()
        }
      }).catch(error => {
        alertMsg(this.$t('app.errorInfo.import'))
        this.initForm()
      })
    },
    importAccount (password, key) {
      keyUtil.createNewAccount(password, key).then(res => {
        if (res) {
          let obj = {}
          const KeyStoreArray = this.$store.state.bweVault.keystoreData
          obj = KeyStoreArray.find(e => e.keystoreData.address === res.keystoreData.address)
          if (!obj) {
            alertMsg(this.$t('app.successInfo.import'))
            let param = {
              keystoreData: res.keystoreData,
              accountName: this.modelform.accountName
            }
            this.setKeystoreData(param)
            this.setActiveAccount({
              accountName: this.modelform.accountName,
              address: res.keystoreData.address
            })
          } else {
            alertMsg(this.$t('app.errorInfo.accountRepeat'))
          }
          this.initForm()
        }
      }).catch(error => {
        alertMsg(this.$t('app.errorInfo.privateKeyFail'))
        //  this.loadingBtn = false
        this.initForm()
      })
    },
    initForm () {
      this.loadingBtn = false
      this.isTypeShow = false
      this.typeFlag = '0'
      this.typeName = this.$t('app.account.privateKey')
      this.typeDesc = this.$t('app.account.importPrivateKey')
      this.modelform = {
        accountName: '',
        key: '',
        keystore: '',
        password: '',
        crypto: '',
        mnemonic: ''
      }
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.form-account-import {
  padding: 28px 15px;
  .app-form-item {
    margin-bottom: 16px;
  }
  .type-item {
    padding: 8px;
    background: #f7f7f7;
    font-size: 14px;
    .item-icon {
        display: flex;
        height: 23px;
      .icon-key {
        display: inline-block;
        width: 26px;
        height: 26px;
        // background: rgba(28, 143, 206, 1);
        border-radius: 50%;
        margin-right: 8px;
        font-size: 26px;
      }
      span {
        color: #3b74dd;
        line-height: 21px;
      }
      .down-icon {
        position: absolute;
        right: 16px;
        top: 48px;
        cursor: pointer;
      }
    }
    .item-desc {
      font-size: 12px;
      color: #7a7a7a;
      margin-left: 34px;
    }
    .account-type {
      background-color: #ddd;
      width: 140px;
      border-radius: 3px;
      position: absolute;
      right: 0px;
      top: 78px;
      z-index: 888;
      .account-item {
        cursor: pointer;
        padding: 4px 10px;
        display: flex;
        align-items: center;
        .acc-icon {
          width: 24px;
          height: 24px;
          font-size: 24px;
          border-radius: 50%;
          margin-right: 6px;
        }
        .acc-type {
          font-size: 12px;
          line-height: 22px;
          color: #3b74dd;
        }
      }
    }
  }
  .comm-icon {
    width: 84px;
    height: 84px;
    margin: 30px auto 30px;
  }
}
</style>
