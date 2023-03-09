<template>
  <div class="fullScreen-layer restore-result">
    <img src="../../static/images/hardware-top-img.png" class="top-left-img"/>
    <img src="../../static/images/hardware-footer-img.png" class="footer-right-img"/>

    <div class="full-screen-wrapper flex-wrapper main-container-wrapper app-bg-light">
      <div class="restore-kind-layer">
        <h1>{{$t('app.createWallet.readyBidWallet')}}</h1>
        <p>{{$t('app.createWallet.extensionAccessed')}}</p>
        <div class="img-group">
          <h3>{{$t('app.createWallet.restoreResultText1')}}</h3>
          <img src="../../static/images/restoreResult-img1.png" width="100%" />
        </div>
        <div class="img-group">
          <h3>{{$t('app.createWallet.restoreResultText2')}}</h3>
          <img src="../../static/images/restoreResult-img2.png" width="100%" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'result'
}
</script>

<style scoped>
.restore-result .restore-kind-layer h1{ margin-bottom: 16px; }
.restore-result .restore-kind-layer p{ text-align: center;color: #666666; }
.restore-result .img-group{ width: 318px;margin:50px auto 0 auto; }
.restore-result .img-group h3{ font-size: 16px;color: #333333;margin-bottom: 0px;font-weight: 400; }
</style>
