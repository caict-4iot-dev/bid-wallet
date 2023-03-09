<template>

  <div class="fullScreen-layer">
    <img src="../../static/images/hardware-top-img.png" class="top-left-img"/>
    <img src="../../static/images/hardware-footer-img.png" class="footer-right-img"/>
    <!--  欢迎页  -->
    <div class="full-screen-wrapper main-container-wrapper app-bg-light">

      <div class="wel-title">
        <div class="wel-logo">
          <img src="../../static/images/logo-name.svg" width="100%" height="100%" />
        </div>
        <h1>{{$t('app.welcome.welTitle')}}</h1>
      </div>

      <div class="wel-wrapper wel-box">

        <van-button type="info" class="btn-info width-stretch" @click="toCreate">{{$t('app.welcome.use')}}</van-button>

        <div class="wel-footer">
          <span @click="toImport">{{$t('app.welcome.restoreAccountLink')}}</span>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'welcome',
  methods: {
    ...mapActions([
      'setOpenWelcome'
    ]),
    toCreate () {
      this.$router.push({path: '/initAccount'})
    },
    toImport () {
      this.$router.push({path: '/restoreAccount'})
    }
  },
  mounted () {
    if (this.$route.query.type === 'openAfter') {
      document.getElementById('app').classList.add('window-pop')
      return false
    }
    this.setOpenWelcome()
  }
}
</script>

<style lang="scss" scoped>

.full-screen-wrapper{
  .wel-logo{
    width: 264px;
    height:auto;
    margin-bottom:100px;
  }
  .wel-title h1{ font-size: 36px; }
  .wel-box{ font-size: 50px;font-weight: 500; }
}

.wel-box{
  .wel-footer{
    margin-top:25px;
    .wel-footer-tag,span{
      line-height: 24px;
    }
  }
}
</style>
