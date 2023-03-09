<template>
  <div class="app-wrapper app-bg-dark">

    <!--  顶部组件  -->
    <headerSlot
      title-name="添加凭证"
      :isShadow="true"
    >
      <span slot="right" class="create-header-right" @click="toDetailList">
        进度查询
      </span>
    </headerSlot>

    <div class="create-list-box">
      <div class="create-nav">
        <h2 class="create-h2">
          {{$t('app.certificates.addCredentialsTitle')}}
        </h2>

        <div class="home-tabs clearfix">
          <div class="tabs-box">
<!--            <span :class="navState == '0' ? 'active' : ''" @click="changeNav('0')">{{$t('app.certificates.commonly')}}</span>-->
<!--            <span :class="navState == '1' ? 'active' : ''" @click="changeNav('1')">{{$t('app.certificates.bidWallet')}}</span>-->
            <span class="active">{{$t('app.certificates.comprehensive')}}</span>
          </div>
        </div>

      </div>
    </div>

    <div class="main-container main-small-top">
      <div class="main-container-wrapper">

        <div class="create-list-view">
          <div class="home-loading" v-show="loading">
            <van-loading type="spinner" size="40"/>
          </div>
          <noData v-if="createListData.length === 0"/>
          <div class="create-list" v-for="(item,index) in createListData" :key="index" @click="filterTemplateToLink(item)">
            <i class="create-list-icon">
              <img :src="item.icon ? item.icon : require('../../static/images/logo-icon.svg')" width="100%" @error="imgError"/>
            </i>
            <span class="create-list-name">{{item.certName}}</span>
            <span class="create-link-tag">
              <van-icon name="arrow"/>
            </span>
          </div>
        </div>

        <p
          class="page-handle"
          v-if="createListData.length > 0"
          :class="pageFinish ? 'over' : ''"
          @click="pageLoad"
        >{{pageFinish ? pageOverName : pageChangeName}}</p>

      </div>
    </div>
  </div>
</template>

<script>
import headerSlot from '../../compontents/slot/headerSlot'
import walletApi from '../../service/api/walletApi'
import noData from '../../compontents/modules/noData'

export default {
  name: 'createList',
  data () {
    return {
      navState: '2',
      createListData: [],
      loading: false,
      pageChangeName: '加载下页',
      pageOverName: '已到底部',
      pageFinish: false,
      pageParam: {
        pageStart: 1,
        pageSize: 20
      }
    }
  },
  components: {
    headerSlot,
    noData
  },
  mounted () {
    this.changeNav()
  },
  methods: {
    imgError (e) {
      e.target.src = require('../../static/images/logo-icon.svg')
    },
    pageLoad () {
      if (!this.pageFinish) {
        this.pageParam.pageStart += 1
        this.getCreateList()
      }
    },
    toDetailList () {
      this.$router.push({path: '/certificatesDetailList'})
    },
    changeNav () {
      this.pageParam.type = this.navState
      this.pageFinish = false
      this.pageParam.pageStart = 1
      this.createListData = []
      this.getCreateList()
    },
    getCreateList () {
      this.loading = true
      walletApi.getRecommendList(this.pageParam).then(res => {
        this.loading = false
        if (res.data.recommendList.length < this.pageParam.pageSize || res.data.page.pageTotal === this.pageParam.pageSize) {
          this.pageFinish = true
        }
        this.createListData.push(...res.data.recommendList)
      }).catch(error => {
        this.loading = false
      })
    },
    filterTemplateToLink (item) {
      this.$router.push({path: '/createCustomTrust', query: {templateId: item.templateId}})
    }
  }
}
</script>

<style lang="scss" scoped>

@import "../../static/css/theme";

.main-small-top {
  height: calc(100vh - 192px);
  .main-container-wrapper {
    padding: 0 15px;
  }

  margin-top: 12px;
}

.create-list-box {
  width: 100%;
  margin-top: 60px;
  padding-bottom: 22px;
  background-color: #FFF;

  .create-nav {
    width: 100%;
    padding: 25px 15px 0 15px;
  }

  .create-h2 {
    font-weight: 400;
    font-size: 16px;
    color: #333333;
    margin-bottom: 18px;
  }
}

.create-list-view {
  width: 100%;
  margin-bottom: 30px;
  position: relative;
}

.create-list {
  width: 100%;
  height: 48px;
  line-height: 48px;
  background-color: #FFF;
  border-radius: 4px;
  margin-bottom: 8px;
  padding: 0 12px;
  font-size: 14px;
  overflow: hidden;
  cursor: pointer;

  .create-list-icon {
    display: block;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    float: left;
    margin-right: 8px;
    box-shadow: 0px 0px 4px #dedddd;
    margin-top: 10px;
    overflow: hidden;
  }

  .create-list-name {
    float: left;
    color: $app-font-title-ligth-gray-color;
  }

  .create-link-tag {
    float: right;
  }
}
.create-header-right{
  color: rgba(59, 116, 221, 1);
  font-size: 12px;
}
</style>
