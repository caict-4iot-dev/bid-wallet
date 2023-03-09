<template>
  <div class="app-wrapper app-bg-dark">
    <div class="app-absolute app-loading-full" v-if="loading">
      <van-loading type="spinner" size="40"/>
    </div>

    <div class="main-container container-no-header show-cf">
      <div class="main-container-wrapper">

        <h2 class="h2-block">授权账户</h2>
        <div class="account-def cf-box-bg clearfix">
          <div class="user-photo">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhanghu"></use>
            </svg>
          </div>
          <div class="list-info">
            <label>
              {{ activeAccount.accountName }}
            </label>
            <p>({{ shorten(activeAccount.address) }})</p>
          </div>
        </div>

        <h2 class="h2-block">授权对象</h2>
        <div class="account-def cf-box-bg clearfix">
          <div class="user-photo">
            <img :src="websiteInfo.icon" width="100%" height="100%"/>
          </div>
          <div class="sign-url">
            {{ websiteInfo.url }}
          </div>
        </div>

        <h2 class="h2-block">授权出示信息</h2>
        <div class="card-list-box">

          <cardCertificates
            v-if="showCard"
            :cardData="cardData"
            key="certificate"
            typeName="certificate"
            :isDetail="false"
          ></cardCertificates>

          <h3>获取{{cardData.name}}以下内容:</h3>
          <div class="card-list-view">
            <div class="card-list-item" v-for="(item,index) in cfList">
              <label class="icon">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-duigou"></use>
                </svg>
              </label>
              <label>{{ item.label }}</label>
            </div>
          </div>
        </div>


        <div class="btn-notice">点击“签名”将以上信息授权给获取方</div>
      </div>
    </div>

    <div class="bottom-btn-group">
      <van-button type="info" class="handle-info-btn btn-info" @click="cancel" plain>取消</van-button>
      <van-button type="info" class="handle-info-btn btn-info" @click="setSubmitData">签名</van-button>
    </div>
  </div>
</template>

<script>
import {shortenStr} from '../../../../lib/util'
import headerSlot from '../../../compontents/slot/headerSlot'
import walletApi from '../../../service/api/walletApi'
import KeyUtil from '../../../../lib/keyUtil'
import ResponseParam from '../../../../lib/responseParam'
import * as MessageTypes from '../../../../message/MessageTypes'
import {alertMsg} from '../../../config/vanUtil'
import cardCertificates from '../../../compontents/modules/cardCertificates'
import { mapMutations } from 'vuex'

let Base64 = require('js-base64').Base64
const responseParam = new ResponseParam()

export default {
  name: 'showCertificates',
  data () {
    return {
      loading: true,
      websiteInfo: {},
      activeAccount: {},
      cfList: [],
      submitData: {},
      certificatesData: null,
      keyUtil: new KeyUtil(),
      customModel: [],
      cardData: {},
      showCard: false
    }
  },
  components: {
    headerSlot,
    cardCertificates
  },
  methods: {
    ...mapMutations('certificate', [
      'setCertificate'
    ]),
    ...mapMutations([
      'setActiveAccount'
    ]),
    shorten (address) {
      return shortenStr(address)
    },
    getCustomDetail () {
      const param = {
        templateId: this.websiteInfo.ctid
      }
      this.customModel = []
      walletApi.getCustomDetailData(param).then(res => {
        if (!res.data.applyFormat) {
          return false
        }
        this.cardData.backUrl = res.data.backUrl
        this.cardData.icon = res.data.icon
        this.cardData.name = res.data.templateName
        this.cardData.auditName = res.data.issuerName
        let attributes = JSON.parse(res.data.applyFormat)
        let attributesArr = attributes

        for (let i = 0; i < attributesArr.length; i++) {
          this.customModel.push(attributesArr[i])
        }
        this.filterData(this.customModel)
        this.getActiveCertificatesData()
      })
    },
    initData () {
      let storageData = this.$store.state.certificate.certificateList
      storageData = this.filterCfJws(storageData)
      if (storageData.length === 0) {
        this.certificatesNone()
        return false
      }
      this.getCustomDetail()
    },
    filterData (fData) {
      let param = []
      for (let i = 0; i < this.websiteInfo.vpList.length; i++) {
        let detail = ''
        detail = fData.filter(item => item.key === this.websiteInfo.vpList[i])
        if (detail.length > 0) {
          param.push({
            key: this.websiteInfo.vpList[i],
            label: detail[0].label
          })
        }
      }
      this.cfList = param
    },
    setSubmitData () {
      this.setJwsData()
      this.setContentAssert()
      this.setVcData()
      this.submitDataService()
    },
    submitDataService () {
      const that = this
      walletApi.showCredentialData(this.submitData).then(res => {
        let callData = null
        if (res.errorCode === 0 && res.data.result) {
          callData = {
            result: true
          }
          alertMsg('操作成功', function () {
            that.setTransferResult({code: 0, data: callData}, function () {
              window.close()
            })
          })
        } else {
          callData = {
            result: false,
            errorMessage: res.message
          }
          this.setTransferResult({code: 0, data: callData})
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getActiveCertificatesData () {
      const param = {
        status: ['2'],
        pageStart: 1,
        pageSize: 1000
      }
      walletApi.getCredentialOwnerList(param).then(res => {
        if (!res.data.dataList && res.data.dataList.length === 0) {
          this.certificatesNone()
          return false
        }

        let storageData = this.$store.state.certificate.certificateList
        storageData = this.filterCfJws(storageData)
        const accountAddress = this.$store.state.bweVault.activeAccount.address
        const networkUrl = this.$store.state.bweVault.currentNetwork.rpcUrl
        for (let i = 0; i < storageData.length; i++) {
          if (accountAddress === storageData[i].accountAddress &&
            this.websiteInfo.ctid === storageData[i].templateId &&
            networkUrl === storageData[i].networkUrl &&
            !storageData[i].isDelete
          ) {
            this.certificatesData = storageData[i]
            this.cardData.credentialBid = this.certificatesData.credentialId
            this.showCard = true
          }
        }
        this.$forceUpdate()
        if (!this.certificatesData) {
          this.certificatesNone()
          return false
        }
      })
    },
    setJwsData () {
      let jws = this.certificatesData.content.jws.split('.')
      this.submitData.jwsHeader = jws[0]
      this.submitData.jwsSignature = jws[jws.length - 1]
    },
    setContentAssert () {
      let credentialSubject = this.certificatesData.content.vc.credentialSubject
      let param = {}
      for (let i = 0; i < this.cfList.length; i++) {
        for (let key in credentialSubject) {
          if (this.cfList[i].key === key) {
            if (this.cfList[i].key === 'id') {
              param.id = credentialSubject[key]
            } else {
              param[`${key}`] = credentialSubject[key].value
            }
          }
        }
      }
      this.submitData.vcContent = JSON.stringify(param)
    },
    setVcData () {
      for (let key in this.certificatesData.content.vc.credentialSubject) {
        if (key !== 'id') {
          let isHas = this.websiteInfo.vpList.indexOf(key)
          if (isHas < 0) {
            delete this.certificatesData.content.vc.credentialSubject[key].value
            delete this.certificatesData.content.vc.credentialSubject[key].salt
          }
        }
      }
      this.submitData.vc = JSON.stringify(this.certificatesData.content.vc)
    },
    setTransferResult (param, fn) {
      const resultMsg = responseParam.resultObj({
        code: param.code,
        data: param.data,
        uuid: this.websiteInfo.uuid
      })
      chrome.tabs.sendMessage(Number(this.websiteInfo.tabId), {type: MessageTypes.GETPV, ...resultMsg}, () => {
      })
      if (fn) fn()
    },
    cancel () {
      this.setTransferResult({code: 1}, function () {
        window.close()
      })
    },
    certificatesNone () {
      this.$dialog.confirm({
        title: '提示',
        message: '暂无可用的数字凭证，请申请后再授权',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          // on confirm
          this.setTransferResult({code: 1, data: {}}, function () {
            window.close()
          })
        })
        .catch(() => {
          // on cancel
          this.setTransferResult({code: 1, data: {}}, function () {
            window.close()
          })
        })
    },
    findKeyStoreArray () {
      const KeyStoreArray = this.$store.state.bweVault.keystoreData
      let obj = KeyStoreArray.find(e => e.keystoreData.address === this.websiteInfo.address)
      return obj
    },
    hasAccount () {
      const self = this
      if (this.websiteInfo.address) {
        const keystore = this.findKeyStoreArray()
        if (!keystore) {
          alertMsg(this.$t('app.errorInfo.noAccount'), function () {
            self.sendMsg({code: 1}, function () {
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
    },
    changeAccount (item) {
      this.setActiveAccount({
        accountName: item.accountName,
        address: item.keystoreData.address
      })
    },
    getActiveAccount () {
      let pageAddress = this.$store.state.bweVault.activeAccount.address
      if (pageAddress !== this.websiteInfo.address) {
        return false
      }
      return true
    },
    filterCfJws (storageData) {
      for (let i = 0; i < storageData.length; i++) {
        if (!storageData[i].isDelete && !storageData[i].content.vc) {
          let jws = storageData[i].content.jws.split('.')
          let formatJws = this.formatDecode(jws[1])
          let parsedWordArray = Base64.decode(formatJws)
          let vcData = JSON.parse(parsedWordArray)
          storageData[i].content.vc = vcData
        }
      }
      return storageData
    },
    formatDecode (str) {
      let s = str.replaceAll('-', '+')
      s = s.replaceAll('_', '/')
      switch (s.length % 4) {
        case 0:
          break
        case 1:
        default:
          return null
        case 2:
          s = s + '=='
          break
        case 3:
          s = s + '='
      }
      return s
    }
  },
  mounted () {
    document.title = '出示凭证'
    this.websiteInfo = this.$route.query
    setTimeout(() => {
      this.loading = false
      this.hasAccount()
      this.activeAccount = this.$store.state.bweVault.activeAccount
      this.initData()
    }, 2000)
  }
}
</script>

<style lang="scss" scoped>
.show-cf .account-def {
  margin-bottom: 15px;
}

.account-def.cf-box-bg {
  background-color: #FFF;
  padding: 15px;
}

.account-def .sign-url {
  line-height: 40px;
}

.h2-block {
  font-size: 14px;
  color: #333333;
  margin-bottom: 3px;
}

.card-list-box {
  width: 100%;
  padding: 16px;
  background: #FFF;
  border-radius: 3px;
  margin-bottom: 15px;

  h3 {
    font-size: 14px;
    color: #999999;
    margin-bottom: 8px;
    font-weight: 400;
  }

  .card-list-item {
    margin-bottom: 5px;
  }

  .card-list-view, .card-list-item {
    width: 100%;
    overflow: hidden;

    label.icon {
      font-size: 12px;
      margin-top: 4px;
    }

    label {
      display: block;
      float: left;
      font-size: 14px;
      color: #333333;
      margin-right: 8px;
    }
  }
}

.btn-notice {
  font-size: 12px;
  color: #999999;
  margin-top: 28px;
}


</style>
