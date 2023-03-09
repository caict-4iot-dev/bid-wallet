<template>
  <div class="app-wrapper app-bg-light">
    <!--  header  -->
    <headerSlot
      :title-name="this.$t('app.createWallet.backupWordTitle')"
      :isShadow="true"
    >
    </headerSlot>

    <div class="main-container">

      <div class="main-container-wrapper">
        <noticeSlot
          notice-type="succeed">
          {{$t('app.createWallet.backupWordVerifyNotice')}}
        </noticeSlot>

        <div class="back-wrapper">

          <div class="review-word-box">
            <van-row gutter="13">
              <van-col span="6" v-for="(item,index) in arr" :key="index">
                <span>
                  {{ mnemonicCodeSureList[index]}}
                   <van-icon name="clear" class="del-icon"
                             v-if="mnemonicCodeSureList[index] && mnemonicCodeSureList[index] !== mnemonicCodeList[index]"
                             @click="deleteMnemonic(index)"/>
                </span>
              </van-col>
            </van-row>
          </div>

          <div class="review-notice">
            {{$t('app.createWallet.verifyNoticeLabel')}}
          </div>

          <div class="word-select-box">
            <van-row gutter="13">
              <van-col
                span="6"
                v-for="item in mnemonicCodeSelectList"
                :key="item"
                :class="{selected: mnemonicCodeSureList.includes(item)}"
                @click="selectCode(item)"
              >
                <span>{{item}}</span>
              </van-col>
            </van-row>
          </div>

        </div>

        <div class="wel-wrapper verify-word-btn">
          <van-button
            type="info"
            class="btn-info width-stretch"
            @click="submitCreate"
            :disabled="mnemonicCodeSureList.includes(undefined) || hasError"
            :loading="loadingCreate"
          >
            {{$t('app.btnText.finish')}}
          </van-button>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
import noticeSlot from '../../../compontents/slot/noticeSlot'
import {alertMsg} from '../../../config/vanUtil'

export default {
  name: 'verifyWord',
  data () {
    return {
      mnemonicCodeList: [],
      mnemonicCodeSelectList: [],
      mnemonicCodeSureList: new Array(12),
      arr: new Array(12),
      loadingCreate: false
    }
  },
  computed: {
    hasError () {
      return this.mnemonicCodeSureList.some((item, index) => {
        return item && item !== this.mnemonicCodeList[index]
      })
    }
  },
  components: {
    headerSlot,
    noticeSlot
  },
  methods: {
    setCode (data) {
      this.mnemonicCodeList = data
      this.mnemonicCodeSelectList = JSON.parse(JSON.stringify(data))
      this.mnemonicCodeSelectList.sort(() => {
        return Math.random() > 0.5 ? -1 : 1
      })
    },
    selectCode (item) {
      if (this.mnemonicCodeSureList.includes(item)) return
      for (let i = 0; i < this.mnemonicCodeSureList.length; i++) {
        if (!this.mnemonicCodeSureList[i]) {
          this.$set(this.mnemonicCodeSureList, i, item)
          break
        }
      }
    },
    deleteMnemonic (index) {
      this.$set(this.mnemonicCodeSureList, index, undefined)
    },
    submitCreate () {
      if (!this.mnemonicCodeSureList.includes(undefined)) {
        if (!this.hasError) {
          const that = this
          this.loadingCreate = true
          setTimeout(function () {
            that.$emit('submitVerify')
          }, 100)
        } else {
          alertMsg(this.$t('app.errorInfo.mCodeConfirm'))
        }
      } else {
        alertMsg(this.$t('app.errorInfo.mCode'))
      }
    },
    closeLoading () {
      this.loadingCreate = false
    }

  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
  @import "../../../static/css/theme";
  .notice-box {
    padding: 8px 15px;
    line-height: 21px;
  }
  .back-wrapper{
    width:100%;
    margin-top: 24px;
    line-height: 22px;
  }
  .review-notice{
    margin: 28px 0 12px 0;
    color: $app-font-title-gray-color;
  }
  .review-word-box{
    width: 100%;
    background-color: rgba(0, 0, 0, 0.08);
    border-radius: $app-radius-def;
    padding:2px 10px;
    padding-right: 2px;
    text-align: center;
  }
  .review-word-box span{
    font-size: 12px;
    display: block;
    width: 65px;
    background-color: #FFF;
    border-radius: $app-radius-def;
    line-height: 24px;
    height:24px;
    color:$app-font-title-gray-color;
    margin: 6px 0;
    position: relative;
  }
  .review-word-box .del-icon{
    position: absolute;
    top:-6px;
    right:-6px;
    color:rgba(212, 48, 48, 1);
    cursor: pointer;
  }
  .review-word-box .van-col{
    position: relative;
  }
  .word-select-box{
    width: 100%;
    text-align: center;
    background-color: #f0f4fd;
    padding:2px 10px;
    padding-right: 2px;
  }
  .word-select-box span{
    display: block;
    border-radius: $app-radius-def;
    font-size: 12px;
    line-height: 24px;
    color:$app-font-title-gray-color;
    margin: 6px 0;
    border: 1px solid #e8e8e8;
    cursor: pointer;
    background-color: #fcfcfc;
    width: 65px; height: 24px;
  }
  .word-select-box .selected span{
    // opacity: 0
    color: #ddd;
  }
  .verify-word-btn{
    margin-top: 82px;
  }

</style>
