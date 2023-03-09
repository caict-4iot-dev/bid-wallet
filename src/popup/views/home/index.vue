<template>
  <!--  home  -->
  <div class="wallet-home home-certificates-view">

    <layout>

      <div class="full-header-account">
        <div class="full-header-bg"></div>
        <div class="home-account">
          <div class="account-def">
            <div class="user-photo">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhanghu1"></use>
              </svg>
            </div>

            <div class="list-info">
              <label>
                {{accountName}}
              </label>
              <p
                class="pointer"
                v-clipboard:copy="address"
                v-clipboard:success="onCopy"
                v-clipboard:error="onCopyError"
              >{{shortenStr(address)}}</p>
            </div>

            <div class="account-setting" @click="toAccountDetail">
              <van-icon name="weapp-nav" />
            </div>
          </div>
        </div>
      </div>

        <div class="main-container">

          <div class="main-container-wrapper">

            <div class="home-assets clearfix">

              <div class="home-tabs clearfix">

                <div class="tabs-box">
                  <span class="active">{{$t('app.certificates.digitalCertificates')}}</span>
                </div>
              </div>

              <div class="assets-list-box">

                <div class="home-loading opacity-layer" v-if="cfLoading">
                  <van-loading type="spinner" size="40"/>
                </div>

                <homeCreateIcon></homeCreateIcon>
                <div class="" v-for="(item, index) in progressData">
                  <cardCertificates :cardData="item" :key="index + 1" typeName="certificate"></cardCertificates>
                </div>
                <noData v-if="progressData.length === 0"/>
              </div>

            </div>

          </div>

        </div>

    </layout>

    <createAccount />

    <importAccount />

  </div>

</template>

<script>
import layout from './layout'
import importAccount from './importAccount/index.vue'
import createAccount from './createAccount/index.vue'
import { mapState } from 'vuex'
import {shortenStr} from '../../../lib/util'
import TokenService from '../../config/tokenService'
import certificateStorage from '../../config/minxins/certificateStorage'

import cardCertificates from '../../compontents/modules/cardCertificates'
import homeCreateIcon from '../../compontents/modules/homeCreateIcon'
import noData from '../../compontents/modules/noData'
// api
import walletApi from '../../service/api/walletApi'
import KeyUtil from '../../../lib/keyUtil'

export default {
  name: 'home',
  data () {
    return {
      show: true,
      shortenStr: null,
      param: {
        pageStart: 1,
        pageSize: 100,
        tokenType: ['0']
      },
      keyUtil: new KeyUtil(),
      tokenService: new TokenService(),
      progressData: [],
      assetsLoading: true,
      cfLoading: false,
      credentialList: []
    }
  },
  mixins: [certificateStorage],
  components: {
    layout,
    importAccount,
    createAccount,
    cardCertificates,
    homeCreateIcon,
    noData
  },
  computed: {
    ...mapState({
      accountName: state => state.bweVault.activeAccount.accountName,
      address: state => state.bweVault.activeAccount.address,
      accessToken: state => state.wallet.accessToken
    })
  },
  watch: {
    address (newVal) {
      this.getProgressData()
    }
    // accessToken () {
    //   this.getProgressData()
    // }
  },
  methods: {
    toAccountDetail () {
      this.$router.push({path: '/accountDetail'})
    },
    onCopy () {
      this.$toast({message: this.$t('app.successInfo.copy'), position: 'top'})
    },
    onCopyError () {
      this.$toast({message: this.$t('app.errorInfo.copy'), position: 'top'})
    },
    async getTokenForCertificates () {
      await this.tokenService.getRandomService()
    },
    getProgressData () {
      const param = {
        status: ['2', '4']
      }
      this.cfLoading = true
      this.progressData = []
      let storage = this.$store.state.certificate.certificateList
      storage = JSON.parse(JSON.stringify(storage))
      let storageData = this.filterJws(storage)

      walletApi.getCredentialOwnerList(param).then(res => {
        if (res.errorCode !== 0) {
          this.cfLoading = false
          this.progressData = []
          return false
        }
        this.cfLoading = false
        this.credentialList = res.data.dataList
        let downBidArr = []

        if (this.credentialList && this.credentialList.length > 0) {
          for (let i = 0; i < this.credentialList.length; i++) {
            let isHasCredential = false
            for (let j = 0; j < storageData.length; j++) {
              if ((this.credentialList[i].credentialBid === storageData[j].credentialId) && !storageData[j].isDelete) {
                isHasCredential = true
                this.progressData.push(this.credentialList[i])
              }
            }
            if (!isHasCredential) {
              downBidArr.push(this.credentialList[i].credentialBid)
            }
          }
          this.filterCertificate(downBidArr)
          this.checkPlaintextData()
        } else {
          this.progressData = []
        }
      }).catch(error => {
        this.cfLoading = false
        this.progressData = []
      })
    },
    setCredentialData (bid) {
      for (let i = 0; i < this.credentialList.length; i++) {
        if (this.credentialList[i].credentialBid === bid) {
          this.progressData.push(this.credentialList[i])
        }
      }
    }
  },
  mounted () {
    this.getProgressData()
  },
  created () {
    this.shortenStr = shortenStr
  }
}
</script>

<style lang="scss" scoped>

  @import "../../static/css/theme.scss";


  .full-header-account {
    width: 100%;
    position: relative;
  }
  .full-header-bg{
    width: 100%;
    height:100%;
    position: absolute;
    z-index: -1;
  }
  .home-assets-view{
    .full-header-bg{
      background: url("../../static/images/home-head-assets-bg.png");
      background-size: 100% 100%;
    }
  }

  .home-certificates-view{
    .full-header-bg{
      background: url("../../static/images/home-head-bg.png");
      background-size: 100% 100%;
    }
    .home-account{
      .list-info label{
        color: $app-font-color;
      }
      .list-info p{
        color: $app-font-title-ligth-gray-color;
      }
    }
    .account-setting i{ color:#333; }

  }
  .wallet-home .main-container{ margin-top: 0px; }
  .wallet-home .main-container-wrapper{ padding: 0 15px; }

  .home-account{
    width:100%;
    height:90px;
    padding-top: 60px;
    box-sizing: content-box;

    .list-info{
      label{
        color:#FFF;
        line-height: 14px;
        margin-bottom: 8px;
      }
      p{
        color:rgba(143, 216, 255, 1);
        font-size: 12px;
        color: #8ab3ff;
        line-height: 12px;
      }
    }
  }

  .home-assets{
    width: 100%;
    margin-top: 18px;


    .assets-add-icon{
      float: right;
      color:$app-font-title-gray-color;
      font-size: 20px;
      margin-top: -16px;
      cursor: pointer;
    }
    .assets-list-box{
      height:375px;
      overflow-y: auto;
      margin: 20px 0;
      position: relative;
    }
    .assets-list{
      width: 100%;
      height:65px;
      line-height:65px;
      cursor: pointer;
      background-color: $app-def-dark-opt-color;
      margin-bottom: 12px;
      border-radius: $app-radius-def;

      .assets-icon{
        width: 36px;
        height:36px;
        border-radius: 50%;
        float: left;
        margin-top: 15px;
        margin-left: 10px;
        font-size: 36px;
      }
      .assets-info{
        width: calc(100% - 62px);
        margin-left: 16px;
        float: left;
        color:$app-font-title-gray-color;
        padding-right: 14px;

        &-name{
          float: left;
        }
        &-right{
          float: right;
          .van-icon{
            font-size: 14px;
            color: rgba(0, 0, 0, 0.3);
          }
        }
      }
    }


  }


</style>
