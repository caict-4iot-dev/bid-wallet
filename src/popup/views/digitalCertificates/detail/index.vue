<template>
  <div class="app-wrapper app-bg-dark">
    <!--  顶部组件  -->
    <headerSlot
      :title-name="certificatesData.name"
      :isShadow="true"
    >
    </headerSlot>

    <div class="main-container">
      <div class="main-container-wrapper">

        <cardCertificates
          :is-bottom="false"
          :is-detail="false"
          :card-data="certificatesData"
          typeName="certificate"
        ></cardCertificates>

        <div class="detail-delete-btn">
          <van-button type="info" class="lang-info-btn btn-info" @click="delCertificates"
                      plain>删除
          </van-button>
        </div>

        <div class="collapse-view">
          <van-collapse v-model="collapseInfo">
            <van-collapse-item title="凭证基本信息" name="1">
              <div class="coll-info-item">
                <div class="item-key">凭证主体</div>
                <div class="item-value">{{this.vcData.credentialSubject.id}}</div>
              </div>
              <div class="coll-info-item">
                <div class="item-key">凭证持有者</div>
                <div class="item-value">{{this.vcData.credentialSubject.id}}</div>
              </div>
              <div class="coll-info-item">
                <div class="item-key">凭证发行方</div>
                <div class="item-value" v-if="detailData.issuerObj">{{detailData.issuerObj.issuerName}}</div>
                <div class="item-value" v-if="detailData.issuerObj">{{detailData.issuerObj.issuerBid}}</div>
              </div>
              <div class="coll-info-item">
                <div class="item-key">颁发时间</div>
                <div class="item-value">{{momentTime(this.vcData.issuanceDate)}}</div>
              </div>
              <div class="coll-info-item">
                <div class="item-key">凭证有效期</div>
                <div class="item-value">
                  {{momentTime(this.vcData.issuanceDate)}}<br>
                  至 <br>
                  {{momentTime(this.vcData.validBefore)}}
                </div>
              </div>
            </van-collapse-item>
            <van-collapse-item title="凭证内容" name="2">
              <div class="coll-info-item" v-for="(item, index) in infoData" :key="index">
                <div class="item-key">{{item.name}}</div>
                <div class="item-value">{{item.value}}</div>
              </div>
            </van-collapse-item>
          </van-collapse>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
import cardCertificates from '../../../compontents/modules/cardCertificates'
import certificateStorage from '../../../config/minxins/certificateStorage'
import moment from 'moment'
import walletApi from '../../../service/api/walletApi'

export default {
  name: 'personalDetail',
  data () {
    return {
      title: '',
      type: '',
      collapseInfo: ['1'],
      certificatesData: {},
      detailData: {},
      vcData: {
        id: ''
      },
      infoData: [],
      customModel: []
    }
  },
  mixins: [certificateStorage],
  components: {
    headerSlot,
    cardCertificates
  },
  mounted () {

  },
  created () {
    this.certificatesData = this.$route.query.param
    this.certificatesData = JSON.parse(this.certificatesData)
    this.type = 'custom'
    this.detailHandle()
  },
  methods: {
    detailHandle () {
      this.detailData = this.findActiveCertificates(this.certificatesData.credentialBid)
      this.vcData = this.detailData.content.vc
      this.getCustomDetail()
    },
    getCustomDetail () {
      const param = {
        templateId: this.certificatesData.templateBid
      }
      this.customModel = []
      walletApi.getCustomDetailData(param).then(res => {
        if (!res.data.applyFormat) {
          return false
        }
        this.detailData.issuerObj = {
          issuerBid: res.data.issuerBid,
          issuerName: res.data.issuerName
        }
        let attributes = JSON.parse(res.data.applyFormat)
        let attributesArr = attributes
        for (let i = 0; i < attributesArr.length; i++) {
          this.customModel.push(attributesArr[i])
        }
        let param = []
        for (let key in this.vcData.credentialSubject) {
          let typeParam = this.customModel.filter(item => item.key === key)
          if (typeParam.length > 0) {
            if (key !== 'id') {
              param.push({
                name: typeParam[0].label,
                value: this.vcData.credentialSubject[key].value
              })
            } else {
              param.push({
                name: typeParam[0].label,
                value: this.vcData.credentialSubject[key]
              })
            }
          }
        }

        this.infoData = param
      })
    },
    momentTime (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    delCertificates () {
      this.$dialog.confirm({
        title: '提示',
        message: '如未进行备份操作，删除后凭证将无法找回，您确认要删除该凭证吗？',
        confirmButtonText: '确认删除',
        cancelButtonText: '取消'
      }).then(() => {
        this.deleteCertificates(this.certificatesData.credentialBid)
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>
.collapse-view {
  margin-bottom: 16px;
}

.coll-info-item {
  width: 100%;
  margin-bottom: 11px;
  font-size: 14px;
}

.coll-info-item .item-key {
  color: #333333;
  font-family: PingFang-SC-Medium;
}

.coll-info-item .item-value {
  color: #999999;
  font-family: PingFangSC-Regular;
}

.detail-delete-btn {
  width: 100%;
  padding: 16px;
  background: #FFF;
  margin-bottom: 16px;
}

</style>
