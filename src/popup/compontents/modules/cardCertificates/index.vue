<template>
  <div class="card-cf-box" :class="[isBottom ? 'mb12' : '',!cardData.backUrl ? `${typeName}-bg` : '']" @click="toDetail">
    <img :src="cardData.backUrl" width="100%" class="card-bg" v-if="cardData.backUrl" @error="bgError"/>
    <div class="card-cf-body">
      <div class="cf-status already-passed" v-if="!isDetail && cardData.status == '2'">
        已通过
      </div>
      <div class="cf-status revoked" v-if="!isDetail && cardData.status == '4'">
        已吊销
      </div>
      <div class="card-cf-main">
        <div class="card-main-icon">
          <img :src="cardData.icon ? cardData.icon : require('../../../static/images/logo-icon.svg')" width="100%"  @error="imgError"/>
        </div>
        <div class="card-main-info">
          <h2>{{cardData.name}}</h2>
          <p v-if="cardData.credentialBid && cardData.credentialBid.indexOf('did:bid') > -1">{{cardData.credentialBid | shortenStrFilter}}</p>
          <p v-else>{{cardData.credentialBid | shortenIdFilter}}</p>
        </div>
      </div>
      <div class="card-cf-foot">由 {{cardData.auditName}} 颁发</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'cardCertificates',
  data () {
    return {
      isBid: true
    }
  },
  props: {
    // applying 申请中   done 审核完成
    stateName: {
      type: String,
      default: 'applying'
    },
    typeName: {
      type: String,
      default: ''
    },
    cardData: {
      type: Object,
      default: () => {}
    },
    isBottom: {
      type: Boolean,
      default: true
    },
    isDetail: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    imgError (e) {
      e.target.src = require('../../../static/images/logo-icon.svg')
    },
    bgError (e) {
      e.target.src = require('../../../static/images/temp-def-blue.png')
    },
    toDetail () {
      if (!this.isDetail) {
        return false
      }
      this.$router.push({path: '/certificatesDetail', query: {param: JSON.stringify(this.cardData)}})
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-cf-box.mb12{  margin-bottom:12px; }
  .card-cf-box.certificate-bg{background-image: linear-gradient(135deg, #3672E2 0%, #4F8AF8 100%);}
  .card-cf-box{
    width: 100%;
    height:108px;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .card-bg{
      width: 100%;
      height:100%;
      position: absolute;
      left:0;top:0;
    }

    .card-cf-body{
      width: 100%;height:100%;border-radius: 4px;position: relative;
      .cf-status{
        padding: 2px 7px;
        position: absolute;
        right:-2px;
        top:15px;
        color:#FFF;
        border-radius: 2px 0px 0px 2px;
        font-size: 12px;
      }
      .cf-status.already-passed{
        background: #37D88A;
      }
      .cf-status.revoked{
        background: #F28824;
      }
    }
    .card-cf-main{ width: 100%;height:72px;padding: 16px; }
    .card-cf-foot{ width: 100%;height:36px;line-height: 36px;background: rgba(255,255,255,.2);color: #FFF;font-size: 12px;padding: 0 16px; }
    .card-main-icon{ width: 40px;height:40px;border-radius: 50%;background: #3b74dd;float: left;overflow: hidden; }
    .card-main-info{
      float: left;margin-left: 12px;font-size: 12px;
      h2 {
        font-weight: 400;
        font-size: 14px;
        color: #FFF;
        margin-bottom: 8px;
      }
      p{
        color:#FFF;
      }
    }

  }
</style>
