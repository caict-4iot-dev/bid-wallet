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
          <div class="account-def clearfix">
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
          </div>
        </div>

        <div class="sub-btn-group clearfix" style="margin-top: 120px;">
          <van-button plain type="info" class="btn-info fl" @click="cancel">{{$t('app.btnText.cancel')}}</van-button>
          <van-button type="info" class="btn-info fr" @click="toSign">{{$t('app.btnText.next')}}</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
import targetBox from '../../../compontents/modules/targetBox'
import {shortenStr} from '../../../../lib/util'
import { mapState, mapMutations } from 'vuex'
import {alertMsg} from '../../../config/vanUtil'

export default {
  name: 'signUser',
  data () {
    return {
      pageAccountName: null,
      pageAddress: null,
      loading: true,
      websiteInfo: {
        icon: null,
        url: null,
        type: null,
        message: null,
        address: null
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
      'setSignResult'
    ]),
    ...mapMutations([
      'setActiveAccount'
    ]),
    shorten (address) {
      return shortenStr(address)
    },
    getKeystoreData () {
      if (this.websiteInfo.address === this.pageAddress) {
        return false
      }
      let keystoreData = this.$store.state.bweVault.keystoreData
      for (let i = 0; i < keystoreData.length; i++) {
        if (keystoreData[i].keystoreData.address === this.websiteInfo.address) {
          this.setActiveAccount({
            accountName: keystoreData[i].accountName,
            address: this.websiteInfo.address
          })
        }
      }
    },
    toSign () {
      this.$router.push({
        path: '/signConfirm',
        query: {
          icon: this.websiteInfo.icon,
          url: this.websiteInfo.url,
          accountName: this.pageAccountName,
          address: this.address,
          message: this.websiteInfo.message,
          type: this.websiteInfo.type
        }
      })
    },
    cancel () {
      this.sendMsg(1, '', function () {
        window.close()
      })
    },
    sendMsg (code, address, fn) {
      this.setSignResult({
        type: this.websiteInfo.type,
        code: code,
        timeStamp: new Date().getTime()
      })
      if (fn) fn()
    },
    getStoreForNext () {
      const keystore = this.$store.state.bweVault.keystoreData
      if (!keystore || keystore.length === 0) {
        alertMsg(this.$t('app.errorInfo.noAccount'), function () {
          window.close()
        })
      }
    },
    async beforeunloadHandler () {
      await this.awaitCancel()
    },
    awaitCancel () {
      const that = this
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          that.cancel()
        }, 500)
      })
    }
  },
  mounted () {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    document.title = this.$t('app.sign.signTitle')
    this.websiteInfo = this.$route.query
    const that = this
    setTimeout(function () {
      that.getStoreForNext()
      that.loading = false
      that.setSignResult({})
      that.getKeystoreData()
    }, 1500)
  },
  created () {

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
