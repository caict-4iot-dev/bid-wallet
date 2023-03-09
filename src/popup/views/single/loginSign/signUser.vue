<template>

  <div class="app-wrapper app-bg-dark sign-user">

    <div class="app-absolute app-loading-full" v-if="loading">
      <van-loading type="spinner" size="40"/>
    </div>

    <div class="main-container container-no-header">

      <div class="main-container-wrapper">
        <targetBox
          :url="websiteInfo.url"
          :icon="websiteInfo.icon"
        >
           <span class="target-title">
            {{$t('app.sign.signUserWel')}}
          </span>
        </targetBox>

        <!--    divider    -->
        <van-divider />

        <div class="single-handle">
          <h3 class="wrapper-list-title" style="margin-top: 20px">
            {{$t('app.sign.signTitle')}}
          </h3>
          <div class="account-def clearfix" @click="changeUserFn">
            <div class="user-photo">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhanghu"></use>
              </svg>
            </div>
            <div class="list-info">
              <label>
                {{pageAccountName}}
              </label>
              <p>({{shorten(pageAddress)}})</p>
            </div>
            <!--      link icon      -->
            <div class="link-to-icon">
              <van-icon name="arrow" />
            </div>
          </div>
        </div>

        <div class="sub-btn-group clearfix" style="margin-top: 120px;">
          <van-button plain type="info" class="btn-info fl" @click="cancel">{{$t('app.btnText.cancel')}}</van-button>
          <van-button type="info" class="btn-info fr" @click="toLoginSign">{{$t('app.btnText.next')}}</van-button>
        </div>
      </div>
    </div>

    <van-popup class="small-header" v-model="changeUser" position="bottom" :style="{ height: '50%' }">
      <div class="app-absolute">
        <headerSlot
          :title-name="this.$t('app.sign.selectAccount')"
          :isShadow="false"
          :isBack="false"
        >
        </headerSlot>
        <div class="app-pop-box">
          <div class="account-small-def account-bg clearfix" v-for="(item,index) in keystoreData" :key="index" @click="changeAccount(item)">
            <div class="user-photo">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhanghu"></use>
              </svg>
            </div>
            <div class="list-info">
              <label>{{item.accountName}}</label>
              <p>{{shorten(item.keystoreData.address)}}</p>
            </div>
            <div class="account-active" v-if="address === item.keystoreData.address">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-duihao"></use>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </van-popup>

  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
import targetBox from '../../../compontents/modules/targetBox'
import {shortenStr} from '../../../../lib/util'
import { mapState, mapMutations } from 'vuex'
import {msgType, sendMsgType} from '../../../config/param'
import {alertMsg} from '../../../config/vanUtil'
import ExtensionStore from '../../../../lib/localStore'

export default {
  name: 'signUser',
  data () {
    return {
      pageAccountName: null,
      pageAddress: null,
      loading: true,
      websiteInfo: {
        icon: null,
        url: null
      },
      changeUser: false,
      extensionStore: new ExtensionStore()
    }
  },
  components: {
    headerSlot,
    targetBox
  },
  computed: {
    ...mapState({
      accountName: state => state.bweVault.activeAccount.accountName,
      address: state => state.bweVault.activeAccount.address,
      keystoreData: state => state.bweVault.keystoreData
    })
  },
  watch: {
    address () {
      this.pageAddress = this.address
    },
    accountName () {
      this.pageAccountName = this.accountName
    }
  },
  methods: {
    ...mapMutations('wallet', [
      'setSignSendWeb',
      'setSignSendRandom',
      'setSignResult'
    ]),
    ...mapMutations([
      'setActiveAccount'
    ]),
    shorten (address) {
      return shortenStr(address)
    },
    toLoginSign () {
      this.loading = true
      this.setSignSendWeb({
        code: 0,
        type: msgType.loginSign,
        uuid: this.websiteInfo.uuid,
        data: {
          address: this.pageAddress
        },
        timeStamp: new Date().getTime()
      })
    },
    cancel () {
      this.setSignSendWeb({})
      this.sendMsg(1, function () {
        window.close()
      })
    },
    sendMsg (code, fn) {
      this.setSignSendWeb({
        type: msgType.loginSign,
        code: code,
        timeStamp: new Date().getTime()
      })
      if (fn) fn()
    },
    changeUserFn () {
      this.changeUser = true
    },
    changeAccount (item) {
      this.setActiveAccount({
        accountName: item.accountName,
        address: item.keystoreData.address
      })
      this.changeUser = false
    },
    getActiveAccount () {
      this.pageAddress = this.$store.state.bweVault.activeAccount.address
      this.pageAccountName = this.$store.state.bweVault.activeAccount.accountName
    },
    getStoreForNext () {
      const keystore = this.$store.state.bweVault.keystoreData
      if (!keystore || keystore.length === 0) {
        alertMsg(this.$t('app.errorInfo.noAccount'), function () {
          window.close()
        })
      }
    },
    getRandom () {
      const that = this
      this.extensionStore.storageListener(function (changeKey, newValue) {
        if (changeKey === 'signSendRandom') {
          that.toNextSign(changeKey, newValue)
        }
      })
    },
    toNextSign (changeKey, newValue) {
      const randomResult = newValue.wallet.changeOptions[changeKey]
      if (randomResult.code === 0) {
        this.$router.push({
          path: '/signConfirm',
          query: {
            icon: this.websiteInfo.icon,
            url: this.websiteInfo.url,
            accountName: this.pageAccountName,
            address: this.pageAddress,
            message: randomResult.param.random,
            type: sendMsgType.sendRandom,
            uuid: randomResult.uuid
          }
        })
      } else {
        alertMsg(this.$t('app.errorInfo.sign'), function () {
          window.close()
        })
      }
    }
  },
  mounted () {
    document.title = this.$t('app.sign.signTitle')
    this.websiteInfo = this.$route.query
    this.getRandom()
    const that = this
    setTimeout(function () {
      that.getStoreForNext()
      that.getActiveAccount()
      that.loading = false
      that.setSignSendWeb({})
      that.setSignSendRandom({})
      that.setSignResult({})
    }, 1500)
  },
  create () {

  }

}
</script>

<style lang="scss" scoped>
  @import "../../../static/css/theme";
  .sign-user  {
    .account-def{
      margin: 0;
    }
    .app-pop-box{
      background-color: $app-bg-dark-color;

      .list-info{
        label{
          color:$app-font-title-gray-color;
        }
        p{
          color:$app-font-gray-color;
        }
      }
      .account-bg {
        background-color: $app-bg-light-color;
        padding: 12px;
        position: relative;
        margin-bottom: 10px;
        cursor: pointer;

        &:hover{background-color: $app-hover-light-blue;}
      }
      .account-active{
        width: 15px;
        position: absolute;
        right:23px;
        top:15px;
        font-size: 20px;
        color: rgba(12, 201, 88, 1);
      }
    }
  }
  .small-header{
    .header-slot{
      height:50px;
      line-height: 50px;
      position: absolute;
    }

  }

</style>
