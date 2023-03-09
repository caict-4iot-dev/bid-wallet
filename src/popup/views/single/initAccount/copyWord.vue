<template>
  <div class="app-wrapper app-bg-light">
    <!--  header  -->
    <headerSlot
      :title-name="this.$t('app.createWallet.backupWordTitle')"
      :isShadow="true"
      :isBack="false"
    >
      <span slot="left" @click="returnChildHide">
        <van-icon name="arrow-left" />
      </span>
    </headerSlot>

    <div class="main-container">

      <div class="main-container-wrapper">
        <!--   notice   -->
        <noticeSlot
          notice-type="error">
          {{$t('app.createWallet.backupWordCopyNotice')}}
        </noticeSlot>

          <div class="word-view clearfix">
            <div class="word-view-box">
              <span v-for="item in mnemonicCodeList" :key="item">{{item}}</span>
            </div>
            <div class="copy-word" v-clipboard:copy="mnemonic" v-clipboard:success="onCopy" v-clipboard:error="onCopyError">
              <svg class="icon pr" aria-hidden="true">
                <use xlink:href="#icon-fuzhi"></use>
              </svg>
              <span v-if="!isCopy">{{$t('app.createWallet.copy')}}</span>
              <span v-else>{{$t('app.createWallet.copyOver')}}</span>
            </div>
          </div>

          <p class="check-mb">
            <van-checkbox v-model="checked" shape="square">{{$t('app.createWallet.checkFont')}}</van-checkbox>
          </p>

          <van-button type="info" class="btn-info width-stretch" @click="toVerifyPage" :disabled="!checked">
            {{$t('app.btnText.continue')}}
          </van-button>

      </div>

    </div>

  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
import noticeSlot from '../../../compontents/slot/noticeSlot'

export default {
  name: 'copyWord',
  data () {
    return {
      checked: false,
      mnemonic: null,
      mnemonicCodeList: null,
      isCopy: false
    }
  },
  components: {
    headerSlot,
    noticeSlot
  },
  methods: {
    setWord (data) {
      this.mnemonic = data
      this.mnemonicCodeList = this.mnemonic.split(' ')
    },
    onCopy () {
      this.isCopy = true
      this.$toast.success(this.$t('app.successInfo.copy'))
    },
    onCopyError () {
      this.isCopy = false
      this.$toast.fail(this.$t('app.errorInfo.copy'))
    },
    toVerifyPage () {
      this.$emit('toVerify')
    },
    returnChildHide () {
      this.$emit('returnCreate')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../static/css/theme";

.check-mb{ margin-bottom: 28px; }

.word-view{
  width: 100%;
  margin-top: 40px;
  margin-bottom: 156px;
  color:$app-font-title-gray-color;

  &-box{
    width: 100%;
    height: 88px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: $app-radius-def;
    padding: 8px 15px;
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 13px;

    span{
        white-space:nowrap;
        margin-right: 13px;
    }
  }
  .copy-word{
    float: left;
    font-size: 12px;
    width: 100%;
    cursor: pointer;

    .pr{ margin-right: 5px;font-size: 16px;vertical-align: bottom; }
  }

}

</style>
