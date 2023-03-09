<template>
  <div class="app-wrapper app-bg-light">
    <headerSlot
      title-name="结果页"
      :isShadow="false"
      :is-back="false"
      v-if="handleType === 'web'"
    >
    </headerSlot>
    <div class="main-container">
      <div class="main-container-wrapper">
        <div class="result-step">
          <div class="step-box over">
            <i>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-xinghuolianwanglogo"></use>
              </svg>
            </i>
            <h2>{{$t('app.certificates.resultTitle')}}</h2>
            <p>{{$t('app.certificates.resultTo')}}</p>
          </div>
          <div class="step-box running">
            <i>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jiaoyichulizhong"></use>
              </svg>
            </i>
            <h2>{{$t('app.certificates.waitCheck')}}</h2>
            <p>{{$t('app.certificates.waitCheckResult')}}</p>
          </div>
          <div class="step-box none">
            <i>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jiaoyichenggong"></use>
              </svg>
            </i>
            <h2>{{$t('app.certificates.applicationApproved')}}</h2>
          </div>
        </div>
        <div class="result-btn-box">
          <van-button
            type="info"
            class="btn-info small-handle-btn"
            @click="toHome"
            v-if="handleType === 'web'"
          >
            跳转首页
          </van-button>
          <van-button
            type="info"
            class="btn-info small-handle-btn"
            @click="closeWindow"
            v-if="handleType === 'window'"
          >
            关闭
          </van-button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
export default {
  name: 'Result',
  data () {
    return {
      handleType: ''
    }
  },
  components: {
    headerSlot
  },
  methods: {
    toHome () {
      this.$router.push({path: '/'})
    },
    closeWindow () {
      window.close()
    }
  },
  mounted () {
    if (this.handleType === 'window') {
      document.title = this.$t('app.certificates.createResultTitle')
    }
  },
  created () {
    this.handleType = this.$route.query.type
  }
}
</script>

<style lang="scss" scoped>
@import "../../../static/css/theme";
.result-step{width: 100%;overflow: hidden;position: relative;font-family: SourceHanSansCN-Bold;margin: 20px 0 40px 0; }
.result-step:before{content:'';width: 2px;height:170px;background: #b7b7b7;left: 35px;top: 20px;position: absolute;}
.result-step:after{content:'';width: 2px;height:138px;background: $app-def-dark-color;left: 35px;top: 10px;position: absolute;}
.step-box{ margin-bottom: 30px;width: 100%;padding-left: 80px;position: relative; }
.step-box h2{ font-size: 18px;font-weight: bold;margin-bottom: 5px; }
.step-box p{margin: 0;font-size: 12px;color: $app-font-gray-color;}
.step-box.over{ margin-bottom: 50px; }
.step-box i{ border-radius: 50%;position: absolute;top:3px;text-align: center;z-index: 99; }
.step-box.over i{ width: 51px;height:51px;background:$app-def-dark-color;left:11px;line-height: 59px;font-size: 45px;  }
.step-box.running i{ width: 22px;height:22px;background:#FFF;left:25px;line-height: 25px;font-size: 22px; }
.step-box.none i{ width: 20px;height:20px;background:#FFF;left:26px;line-height: 25px;font-size: 20px; }
.result-btn-box{width: 100%;text-align: center;}
.small-handle-btn{ height:40px!important;width: 70%; }
</style>
