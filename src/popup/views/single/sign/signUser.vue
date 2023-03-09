<template>
  <!--  sign  -->
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
          <van-button type="info" class="btn-info fr" @click="toSign">{{$t('app.btnText.next')}}</van-button>
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
import {alertMsg} from '../../../config/vanUtil'
import {msgType} from '../../../config/param'
import BewExtension from '../../../../lib/extension'
import ResponseParam from '../../../../lib/responseParam'

const bewExtension = new BewExtension()
const responseParam = new ResponseParam()

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
      changeUser: false
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
      'setSignInfo'
    ]),
    ...mapMutations([
      'setActiveAccount'
    ]),
    shorten (address) {
      return shortenStr(address)
    },
    toSign () {
      this.$router.push({
        path: '/signRequest',
        query: {icon: this.websiteInfo.icon, url: this.websiteInfo.url, accountName: this.pageAccountName, address: this.pageAddress, message: this.websiteInfo.message, messageView: this.websiteInfo.messageView, tabId: this.websiteInfo.tabId}})
    },
    cancel () {
      this.sendMsg(1, function () {
        window.close()
      })
    },
    sendMsg (code, fn) {
      const resultMsg = responseParam.resultParam({
        code: code,
        uuid: this.websiteInfo.uuid
      })
      bewExtension.sendTabMessage(this.websiteInfo.tabId, {type: msgType.sign, ...resultMsg})
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
      if (this.pageAddress !== this.websiteInfo.address) {
        return false
      }
      return true
    },
    findKeyStoreArray () {
      const KeyStoreArray = this.$store.state.bweVault.keystoreData
      let obj = KeyStoreArray.find(e => e.keystoreData.address === this.websiteInfo.address)
      return obj
    },
    getStoreForNext () {
      const self = this
      const keystore = this.$store.state.bweVault.keystoreData
      if (!keystore || keystore.length === 0) {
        alertMsg(this.$t('app.errorInfo.noAccount'), function () {
          self.sendMsg(1, self.websiteInfo.address, function () {
            window.close()
          })
        })
      }
    },
    hasAccount () {
      const self = this
      if (this.websiteInfo.address) {
        const keystore = this.findKeyStoreArray()
        if (!keystore) {
          alertMsg(this.$t('app.errorInfo.noAccount'), function () {
            self.sendMsg(1, self.websiteInfo.address, function () {
              window.close()
            })
          })
        } else {
          if (!this.getActiveAccount()) {
            this.changeAccount(keystore)
          }
        }
      } else {

      }
    }
  },
  mounted () {
    document.title = this.$t('app.sign.signTitle')
    this.websiteInfo = this.$route.query
    const that = this
    setTimeout(function () {
      that.getStoreForNext()
      that.hasAccount()
      that.loading = false
      that.setSignInfo({})
    }, 1500)
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
