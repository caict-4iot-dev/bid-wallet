<template>
  <div class="fullScreen-layer">
    <img src="../../static/images/hardware-top-img.png" class="top-left-img"/>
    <img src="../../static/images/hardware-footer-img.png" class="footer-right-img"/>

    <div class="full-screen-wrapper flex-wrapper main-container-wrapper app-bg-light">
      <div class="restore-layer">
        <h1>{{$t('app.welcome.restoreAccountTitle')}}</h1>
        <div class="restore-view clearfix">
          <div class="restore-list" @click="toLink('/kindPrivateKey')">
            <div class="restore-icon">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-siyuedaoru1"></use>
              </svg>
            </div>
            <div class="restore-content">
              <h2>使用私钥明文串恢复您的账户</h2>
              <p>通过输入明文私钥字符串进行导入，恢复Bid钱包账户</p>
            </div>
          </div>
          <div class="restore-list" @click="toLink('/kindKeystore')">
            <div class="restore-icon">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-Keystore"></use>
              </svg>
            </div>
            <div class="restore-content">
              <h2>使用 Keystore 文件恢复您的账户</h2>
              <p>通过输入 Keystore 字符串进行导入，恢复Bid钱包账户</p>
            </div>
          </div>
          <div class="restore-list" @click="toLink('/kindMnemonicWord')">
            <div class="restore-icon">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhujicidaoru1"></use>
              </svg>
            </div>
            <div class="restore-content">
              <h2>使用账户助记词恢复您的账户</h2>
              <p>只有这个Bid钱包上的主帐户将恢复，Bid钱包内导入的账户将不会被恢复</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'RestoreAccount',
  data () {
    return {

    }
  },
  methods: {
    toLink (url) {
      this.$router.push({path: url})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../static/css/theme";

.restore-layer{
  width: 1101px;
  height: 562px;

  h1{ font-size: 28px;color: $app-font-color;font-weight: $app-font-def-title-w;margin-bottom: 72px; text-align: center;}
  .restore-view{ width: 100%; }
  .restore-list{ float: left;width: 538px;height:125px;padding: 24px;background: #FFFFFF;border: 1px solid rgba(235,235,235,1);box-shadow: 0px 2px 8px -4px rgba(0,0,0,0.13);z-index: 10;margin-bottom: 25px;cursor: pointer;transition: .2s ease-in; }
  .restore-list:hover{ background: #F7FAFF;border: 1px solid rgba(59,116,221,1);box-shadow: 0px 4px 16px -4px rgba(0,0,0,0.13); }
  .restore-list:nth-child(odd){ margin-right: 25px; }
  .restore-content{
    float: right;width: calc(100% - 56px);
    h2{ font-size: 18px;color: $app-font-color;font-weight: $app-font-def-title-w;margin-bottom: 8px; }
    p{ font-size: 14px;color: #999999;line-height: 22px; }
  }
}
</style>
