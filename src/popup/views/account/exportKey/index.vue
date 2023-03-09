<template>
  <van-dialog v-model="show" :title="this.$t('app.account.showKey')" :show-confirm-button="false">
    <div class="dialog-content">
      <p class="text-label-title">{{$t('app.account.noticeKey')}}</p>
      <div class="notice-box">
        <div v-clipboard:copy="key" v-clipboard:success="onCopy" v-clipboard:error="onCopyError">
          <noticeSlot notice-type="info" :style-obj="{fontSize:'12px'}" class="pointer">
            {{key}}
          </noticeSlot>
        </div>
        <noticeSlot notice-type="error" :style-obj="{fontSize:'12px'}" class="notice-m-bt">
          {{$t('app.account.warnKey')}}
        </noticeSlot>

        <div class="sub-btn-group clearfix">
          <van-button
            plain
            type="info"
            class="btn-info fl dialog-btn-layer"
            @click="show = false"
          >{{$t('app.btnText.cancel')}}</van-button>

          <div v-clipboard:copy="key" v-clipboard:success="onCopy" v-clipboard:error="onCopyError">
            <van-button
              type="info"
              class="btn-info fr dialog-btn-layer"
              @click="getPrivateKey"
            >{{$t('app.btnText.done')}}</van-button>
          </div>

        </div>
      </div>
    </div>
  </van-dialog>
</template>

<script>
import noticeSlot from '../../../compontents/slot/noticeSlot'
import KeyUtil from '../../../../lib/keyUtil'
import {alertMsg} from '../../../config/vanUtil'
export default {
  name: 'exportKey',
  data () {
    return {
      show: false,
      keyUtil: new KeyUtil(),
      key: null
    }
  },
  components: {
    noticeSlot
  },
  methods: {
    close () {
      this.key = null
      this.show = false
    },
    open () {
      this.show = true
      this.getPrivateKey()
    },
    findKeyStoreArray () {
      const address = this.$store.state.bweVault.activeAccount.address
      const KeyStoreArray = this.$store.state.bweVault.keystoreData
      let obj = KeyStoreArray.find(e => e.keystoreData.address === address)
      return obj.keystoreData
    },
    getPrivateKey () {
      const that = this
      const keystore = this.findKeyStoreArray()
      const password = this.$store.state.wallet.password
      this.keyUtil.importAccountKeystoreFn(keystore, password).then((res) => {
        if (res) {
          this.key = res
        } else {
          alertMsg(this.$t('app.errorInfo.exportKey'), function () {
            that.close()
          })
        }
      }).catch(error => {
        alertMsg(this.$t('app.errorInfo.exportKey'), function () {
          that.close()
        })
      })
    },
    onCopy () {
      const that = this
      alertMsg(this.$t('app.successInfo.copy'), function () {
        that.close()
      })
    },
    onCopyError () {
      const that = this
      alertMsg(this.$t('app.errorInfo.copy'), function () {
        that.close()
      })
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
@import "../../../static/css/theme.scss";

.notice-m-bt{
  margin: 15px 0;
}
</style>
