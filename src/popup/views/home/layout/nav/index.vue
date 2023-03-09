<template>

    <van-popup
      v-model="show"
      position="left"
      :style="{ width: '70%', height: '100%' }"
    >

      <div class="layout-nav">
        <div class="nav-title">
          <div class="nav-title-l">
            <img src="../../../../static/images/logo-name.svg" width="100%" height="100%" />
          </div>
          <div class="nav-title-r" @click="closePopup">
            <van-icon name="cross" />
          </div>
        </div>

        <div class="layout-nav-wrapper">

          <div class="nav-title-h1">
            {{$t('app.home.myAccount')}}
          </div>

          <div class="nav-account-box">

            <div class="account-small" v-for="(item,index) in keystoreData" :key="index" @click="changeAccount(item)">
              <div class="user-photo">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhanghu"></use>
                </svg>
              </div>
              <div class="list-info">
                <label>{{item.accountName}}</label>
                <p>{{shorten(item.keystoreData.address)}}</p>
              </div>
              <div class="account-active" v-if="activeAddress === item.keystoreData.address">
                <van-icon name="success" />
              </div>
            </div>
          </div>

          <div class="nav-setting">

            <div class="nav-setting-item" @click="createAccount">
              <span class="nav-setting-icon">
                 <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-add-icon"></use>
                 </svg>
              </span>
              <label>{{$t('app.setting.createAccount')}}</label>
            </div>

            <div class="nav-setting-item" @click="importAccount">
              <span class="nav-setting-icon">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-import-icon"></use>
                </svg>
              </span>
              <label>{{$t('app.setting.importAccount')}}</label>
            </div>

            <div class="nav-setting-item" @click="setting">
              <span class="nav-setting-icon">
                 <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-settings-icon"></use>
                 </svg>
              </span>
              <label>{{$t('app.setting.setting')}}</label>
            </div>

            <div class="nav-setting-item" @click="lock">
              <span class="nav-setting-icon">
                 <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-Lock-icon"></use>
                 </svg>
              </span>
              <label>{{$t('app.setting.lock')}}</label>
            </div>

          </div>

        </div>

      </div>

    </van-popup>

</template>

<script>
import $event, { EVENT_NAME } from '../../../../evenBus'
import { mapState, mapMutations } from 'vuex'
import {shortenStr} from '../../../../../lib/util'

export default {
  name: 'layoutNav',
  data () {
    return {
      show: false
    }
  },
  computed: {
    ...mapState({
      keystoreData: state => state.bweVault.keystoreData,
      activeAddress: state => state.bweVault.activeAccount.address
    })
  },
  watch: {
  },
  methods: {
    ...mapMutations([
      'setActiveAccount',
      'setMarkTime'
    ]),
    ...mapMutations('wallet', [
      'setPassword'
    ]),
    closePopup () {
      this.show = false
    },
    createAccount () {
      this.show = false
      $event.$emit(EVENT_NAME.CREATE_ACCOUNT)
    },
    importAccount () {
      this.show = false
      $event.$emit(EVENT_NAME.IMPORT_ACCOUNT)
    },
    shorten (address) {
      if (!address) { return false }
      return shortenStr(address)
    },
    changeAccount (item) {
      this.setActiveAccount({
        accountName: item.accountName,
        address: item.keystoreData.address
      })
    },
    setting () {
      this.$router.push({path: '/setting'})
    },
    lock () {
      this.$dialog.confirm({
        message: this.$t('app.home.confirmLock'),
        confirmButtonText: this.$t('app.btnText.confirm'),
        cancelButtonText: this.$t('app.btnText.cancel')
      }).then(() => {
        // on confirm
        this.setPassword('')
        let lockTime = this.$store.state.bweVault.config.lockTime
        let markTime = this.$store.state.bweVault.config.markTime || new Date().getTime()
        this.setMarkTime(markTime - (lockTime * 5 * 60 * 1000))
        this.$router.push({path: '/lock'})
      }).catch(() => {
        // on cancel
      })
    }
  },
  created () {
    $event.$on(EVENT_NAME.CHANGE_COLLAPSE, () => {
      this.show = true
    })
  },
  destroyed () {
    $event.$off(EVENT_NAME.CHANGE_COLLAPSE)
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../static/css/theme";

.layout-nav{ width: 100%;height:100%; }
.layout-nav-wrapper{ padding: 12px 15px 15px;height:calc(100% - 45px);position: relative; }

.nav-title{ width: 100%;height:45px;line-height: 45px;background-color:$app-nev-title-bg;overflow: hidden;
  .nav-title-r{ float: right;padding: 0 16px;color:$app-font-gray-color;font-size: 13px;cursor: pointer; }
  .nav-title-l{ margin: 14px 15px;width: 91px;height:17px;float: left; }
}
.nav-title-h1{
  font-size: 14px;color:$app-font-title-gray-color;line-height: 14px; margin-bottom: 12px;font-family: SourceHanSansCN-Medium;
}
.nav-account-box{
  width: 100%;
  height: 288px;
  overflow-y: auto;
  > div{
    width: 100%;
    height:52px;
    padding: 8px 0;
    transition: .1s ease-in;
    cursor: pointer;
    background-color: $app-def-dark-color;
    border-radius: $app-radius-def;
    margin-bottom: 6px;
    position: relative;

    .list-info label{
      color:#FFF;
    }
    .list-info p{
      color:rgba(117, 207, 255, 1);
    }
  }
  .account-active{
    width: 12px;
    position: absolute;
    right:7px;
    top:7px;
    font-size: 12px;
    color: #FFF;
  }
  .account-hardware{
    width: 12px;
    position: absolute;
    right:7px;
    bottom:13px;
  }
}
.nav-setting{
  width: calc(100% - 30px);
  position: absolute;
  bottom:10px;

  &-item{
    width: 100%;
    height: 45px;
    line-height: 45px;
    background-color: rgba(242, 242, 242, 1);
    border-radius: 5px;
    padding: 0 9px;
    color: $app-font-title-gray-color;
    cursor: pointer;
    margin-bottom: 8px;
  }
  &-icon{
    display: block;
    float: left;
    font-size: 16px;
    margin-right: 10px;
    margin-top: 3px;
  }
}


</style>
