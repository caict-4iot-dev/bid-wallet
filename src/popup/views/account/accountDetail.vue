<template>
  <div class="app-wrapper app-bg-dark">
    <!--  顶部组件  -->
    <headerSlot
      :title-name="this.$t('app.account.accountDetail')"
      :isShadow="false"
    >
    </headerSlot>

    <div class="main-container">
      <div class="account-def bg-light clearfix">
        <div class="user-photo">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhanghu"></use>
          </svg>
        </div>
        <div class="list-info">
          <label>
            {{accountName}}
            <van-icon name="edit" class="edit-user-icon" @click="openEditUser"/>
          </label>
          <p
            class="pointer"
            v-clipboard:copy="address"
            v-clipboard:success="onCopy"
            v-clipboard:error="onCopyError"
          >{{shorten(address)}}</p>
        </div>
      </div>

      <div class="detail-btn-box">
        <van-button plain type="info" class="btn-info export-private" @click="exportKeyFn">{{$t('app.home.exportKey')}}</van-button>
        <van-button plain type="danger" class="btn-info remove-account" @click="confirmPassword" v-if="isShow">{{$t('app.home.remove')}}</van-button>
      </div>
      <!-- 导出私钥 -->
      <exportKey ref="exportKey"></exportKey>
      <enterPassword ref="enterPassword" @verifyPasswordResult="verifyPasswordResult"></enterPassword>
      <editUser ref="editUser"></editUser>
    </div>
  </div>
</template>

<script>
import headerSlot from '../../compontents/slot/headerSlot'
import exportKey from './exportKey'
import enterPassword from './enterPassword'
import editUser from './editUser'
import { mapState, mapMutations } from 'vuex'
import {shortenStr} from '../../../lib/util'
import {alertMsg} from '../../config/vanUtil'
import confirmHandle from '../../compontents/modules/confirmHandle'

export default {
  name: 'accountDetail',
  components: {
    headerSlot,
    exportKey,
    enterPassword,
    editUser,
    confirmHandle
  },
  data () {
    return {
      isShow: true
    }
  },
  computed: {
    ...mapState({
      accountName: state => state.bweVault.activeAccount.accountName,
      address: state => state.bweVault.activeAccount.address
    })
  },
  mounted () {
    this.removeShow()
  },
  methods: {
    ...mapMutations([
      'setKeystoreDataNewData',
      'setActiveAccount'
    ]),
    shorten (address) {
      return shortenStr(address)
    },
    confirmPassword () {
      this.$dialog.confirm({
        message: this.$t('app.account.removeConfirm'),
        confirmButtonText: this.$t('app.btnText.confirm'),
        cancelButtonText: this.$t('app.btnText.cancel')
      }).then(() => {
        this.$refs.enterPassword.open('removeAccount')
      }).catch(() => {
        // on cancel
      })
    },
    verifyPasswordResult (type) {
      if (type === 'removeAccount') {
        this.findKeyStoreArray()
      } else if (type === 'exportKey') {
        this.exportPrivateKey()
      }
    },
    removeShow () {
      const address = this.$store.state.bweVault.activeAccount.address
      const KeyStoreArray = this.$store.state.bweVault.keystoreData
      for (let i = 0; i < KeyStoreArray.length; i++) {
        if (KeyStoreArray[i].keystoreData.address === address) {
          if (KeyStoreArray[i].permissions === 'create') {
            this.isShow = false
          } else {
            this.isShow = true
          }
        }
      }
    },
    findKeyStoreArray () {
      const address = this.$store.state.bweVault.activeAccount.address
      const KeyStoreArray = this.$store.state.bweVault.keystoreData
      // eslint-disable-next-line no-unused-vars
      let removeNum = null
      for (let i = 0; i < KeyStoreArray.length; i++) {
        if (KeyStoreArray[i].keystoreData.address === address) {
          if (KeyStoreArray[i].permissions === 'create') {
            alertMsg(this.$t('app.errorInfo.accountRemove'))
            return false
          } else {
            removeNum = i
          }
        }
      }
      if (removeNum === null) {
        return false
      }
      KeyStoreArray.splice(removeNum, 1)
      this.setKeystoreDataNewData(KeyStoreArray)
      this.setActiveAccount({
        accountName: KeyStoreArray[0].accountName,
        address: KeyStoreArray[0].keystoreData.address
      })
      this.$router.push({path: '/home'})
    },
    exportKeyFn () {
      this.$refs.enterPassword.open('exportKey')
    },
    exportPrivateKey () {
      this.$refs.exportKey.open()
    },
    openEditUser () {
      this.$refs.editUser.open()
    },
    onCopy () {
      this.$toast({message: this.$t('app.successInfo.copy'), position: 'top'})
    },
    onCopyError () {
      this.$toast({message: this.$t('app.errorInfo.copy'), position: 'top'})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../static/css/theme";
  .account-def {
    .user-photo {
      width: 50px;
      height: 50px;
      font-size: 50px;
    }
  }

  .detail-btn-box{
    width: 100%;
    height:433px;
    padding: 53px 24px 0 24px;
    background-color: #FFF;
    margin-top: 15px;

    .btn-info{
      height: 48px;
      border-radius: 5px;
      width: 100%;
      color: #3874dd;
      background: #fff;
      margin-bottom: 20px;
      font-weight: 500;
      border: 1px solid #3874dd;
    }

    .btn-info.remove-account{
      margin-top: 35px;
      border-radius: 3px;
      border:1px solid $app-def-danger-border-color;
      color: $app-def-danger-border-color;
    }
  }
  .edit-user-icon{
    font-size: 14px;
    color: $app-icon-handle-color;
    margin-left: 5px;
    cursor: pointer;
  }


</style>
