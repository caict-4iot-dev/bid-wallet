<template>
  <div class="app-wrapper app-bg-dark">
    <headerSlot
      title-name="进度查询"
      :isShadow="true"
    >
    </headerSlot>

    <div class="main-container">
      <div class="main-container-wrapper">

        <div class="card-tabs-box">
          <div class="home-tabs clearfix">
            <div class="tabs-box">
              <span :class="navState == '1' ? 'active' : ''" @click="changeState('1')">申请中</span>
              <span :class="navState == '2' ? 'active' : ''" @click="changeState('2')">已通过</span>
              <span :class="navState == '3' ? 'active' : ''" @click="changeState('3')">被拒绝</span>
            </div>
          </div>
        </div>

        <div class="cf-card-box">
          <div class="home-loading" v-show="loading">
            <van-loading type="spinner" size="40"/>
          </div>
          <noData v-if="progressData.length === 0"/>
          <div class="cf-card-list" v-for="(item,index) in progressData" :key="index">
            <div class="cf-list-item">
              <label>凭证名称</label>
              <span>{{item.name}}</span>
            </div>
            <div class="cf-list-item" v-if="navState == '1'">
              <label>申请时间</label>
              <span>{{item.createTime | fmtTimeFromTimestamp}}</span>
            </div>
            <div class="cf-list-item" v-if="navState == '2'">
              <label>颁发时间</label>
              <span>{{item.auditTime | fmtTimeFromTimestamp}}</span>
            </div>
            <div class="cf-list-item" v-if="navState == '3'">
              <label>审核时间</label>
              <span>{{item.auditTime | fmtTimeFromTimestamp}}</span>
            </div>

            <div class="fr" v-if="navState == '2'">
              <van-button type="info" class="handle-info-btn btn-info" plain @click="downCertificate(item)" v-if="item.isDownload === 0">待签收</van-button>
              <van-button type="info" class="handle-info-btn btn-info no-drop" plain v-else>已签收</van-button>
            </div>
            <div class="fr" v-if="navState == '3'">
              <van-button type="info" class="handle-info-btn btn-info" plain @click="toApply(item)">重新申请</van-button>
            </div>
          </div>
        </div>

        <p
          class="page-handle"
          v-if="progressData.length > 0"
          :class="pageFinish ? 'over' : ''"
          @click="pageLoad"
        >{{pageFinish ? pageOverName : pageChangeName}}</p>

      </div>
    </div>

  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
import walletApi from '../../../service/api/walletApi'
import certificateStorage from '../../../config/minxins/certificateStorage'
import { mapMutations } from 'vuex'
import noData from '../../../compontents/modules/noData'

export default {
  name: 'detailList',
  data () {
    return {
      loading: true,
      navState: '1',
      progressData: [],
      toBeDown: [],
      pageChangeName: '加载下页',
      pageOverName: '已到底部',
      pageFinish: false,
      pageParam: {
        pageStart: 1,
        pageSize: 20
      }
    }
  },
  mixins: [certificateStorage],
  components: {
    headerSlot,
    noData
  },
  mounted () {
    this.getProgressData()
  },
  methods: {
    ...mapMutations('certificate', [
      'setCertificate'
    ]),
    pageLoad () {
      if (!this.pageFinish) {
        this.pageParam.pageStart += 1
        this.getProgressData()
      }
    },
    changeState (state) {
      this.navState = state
      this.pageFinish = false
      this.pageParam.pageStart = 1
      this.progressData = []
      this.getProgressData()
    },
    getProgressData () {
      this.loading = true
      this.pageParam.status = [this.navState]
      walletApi.getCredentialOwnerList(this.pageParam).then(res => {
        this.loading = false
        if (res.data.dataList.length < this.pageParam.pageSize || res.data.page.pageTotal === this.pageParam.pageSize) {
          this.pageFinish = true
        }
        this.progressData.push(...res.data.dataList)
        this.setDownStatus()
      }).catch(error => {
        this.loading = false
      })
    },
    setDownStatus () {
      let storage = this.$store.state.certificate.certificateList
      storage = JSON.parse(JSON.stringify(storage))
      for (let i = 0; i < this.progressData.length; i++) {
        let isHasCredential = false
        for (let j = 0; j < storage.length; j++) {
          if ((this.progressData[i].credentialBid === storage[j].credentialId) && !storage[j].isDelete) {
            isHasCredential = true
          }
        }
        if (!isHasCredential) {
          this.progressData[i].isDownload = '0'
        }
      }
    },
    toApply (item) {
      this.$router.push({path: '/createCustomTrust', query: {templateId: item.templateBid}})
    },
    downCertificate (item) {
      const param = {
        credentialId: item.credentialBid
      }
      walletApi.downCredentialData(param).then(res => {
        let content = {
          jws: res.data.jws,
          vc: null,
          issueBid: res.data.issueBid,
          issueName: res.data.issueName
        }
        const param = {
          accountAddress: this.$store.state.bweVault.activeAccount.address,
          credentialId: item.credentialBid,
          networkUrl: this.$store.state.bweVault.currentNetwork.rpcUrl,
          templateId: item.templateBid,
          content: content
        }
        this.setCertificate(param)
        this.getProgressData()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.card-tabs-box{
  width: 100%;background: #FFF;border-radius: 3px;padding: 10px 0px;
  .home-tabs{
    width: 200px;
    margin: 0 auto;
  }
  .tabs-box span:last-child{
    margin-right: 0;
  }
}

.cf-card-box{
  width: 100%;
  margin: 15px 0 30px 0;
  position: relative;
  .cf-card-list{
    width: 100%;
    overflow: hidden;
    padding: 20px 12px;
    background: #FFF;
    font-size: 12px;
    border-radius: 3px;
    margin-bottom: 12px;
  }
  .cf-list-item{
    width: 100%;
    margin-bottom: 10px;
    overflow: hidden;
    label { float: left;color:#333; }
    span {float: right;color:#999 }
  }
  .handle-info-btn{
    width: initial;
    margin-right: 0!important;
    font-size: 12px;
    height:28px;
  }
  .no-drop.handle-info-btn.btn-info{cursor: no-drop;border: 1px solid #84a9ef!important;color: #84a9ef!important;}
}




</style>
