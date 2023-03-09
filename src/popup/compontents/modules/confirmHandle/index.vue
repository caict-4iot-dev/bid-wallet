<template>
  <div class="confirm-handle-style">
    <div class="confirm-box">
      <h2>{{title}}</h2>
      <div class="confirm-content-view">
        <slot></slot>
      </div>
      <div class="confirm-handle-view">
        <div class="cancel-btn" :style="{width: btnWidth[0]}" @click="confirmCancel">{{cancelText}}</div>
        <div class="submit-btn" :style="{width: btnWidth[1]}" @click="confirmSubmit">
          <span v-if="btnLoading"><van-loading type="spinner" /></span>
          <span v-else>{{submitText}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'confirmHandle',
  props: {
    title: {
      type: String,
      default: ''
    },
    btnWidth: {
      type: Array,
      default: ['45%', '45%']
    },
    cancelText: {
      type: String,
      default: ''
    },
    submitText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      btnLoading: false
    }
  },
  methods: {
    confirmCancel () {
      this.$emit('confirmCancel')
    },
    confirmSubmit () {
      this.$emit('confirmSubmit')
    },
    startLoading () {
      this.btnLoading = true
    },
    stopLoading () {
      this.btnLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm-handle-style{
  background: rgba(0,0,0,0.50);
  width: 100%;
  height:100%;
  position: fixed;
  top:0;
  left:0;
  h2 {
    text-align: center;
    font-size: 18px;
    color: #333333;
    margin-top: 12px;
  }
  .confirm-box{
    width: 80%;
    background: #FFFFFF;
    border-radius: 5px;
    font-size: 14px;
    padding: 16px;
    position: absolute;
    top:50%;
    left:10%;
    transform: translateY(-50%);
  }
  .confirm-content-view{
    width: 100%;
    margin-bottom: 8px;
  }
  .confirm-handle-view{
    width: 100%;
    overflow: hidden;
    .cancel-btn{
      background: #F7F9FC;
      border-radius: 3px;
      color: #3B74DD;
      text-align: center;
      font-weight: 400;
      height:36px;
      line-height: 36px;
      float: left;
      cursor: pointer;
    }
    .submit-btn{
      height:36px;
      line-height: 36px;
      text-align: center;
      float: right;
      color: #FFFFFF;
      font-weight: 400;
      background: #3B74DD;
      border-radius: 3px;
      cursor: pointer;
    }
  }
}
</style>
