<template>
  <van-dialog
    v-model="showVerify"
    :show-confirm-button="false"
    :show-cancel-button="false"
    :close-on-click-overlay="false"
    width="280px">
    <div class="verify-img">
      <img src="../../../static/images/hardware-fingerprint-sign-img.png" width="100%"/>
    </div>
    <p class="verify-font">请签名!</p>
    <div class="verify-cancel" :class="showCancel ? 'active' : ''" @click="cancelHwVerify">确认</div>
  </van-dialog>
</template>

<script>
export default {
  data () {
    return {
      showVerify: false,
      showCancel: false,
      timeShowCancel: null
    }
  },
  methods: {
    openVerify () {
      this.showVerify = true
      this.timeShowCancel = setTimeout(() => {
        this.showCancel = true
      }, 5000)
    },
    cancelHwVerify () {
      if (this.showCancel) {
        clearTimeout(this.timeShowCancel)
        this.$emit('cancelVerify')
        this.showVerify = false
        this.showCancel = false
      }
    }
  },
  mounted () {
    this.showCancel = false
  }

}
</script>

<style scoped>

</style>





