<template>
  <div class="app-input input-layer">

    <div class="input-box" v-if="type==='textarea'" >
      <textarea @input="handleInput" :value="value" :rows="textRows" :disabled="isDisabled" :class="className" :placeholder="placeholder"></textarea>
    </div>

    <div class="input-box clearfix" v-else>
      <input :type="type" :value="value" @input="handleInput" :disabled="isDisabled" :placeholder="placeholder" :maxlength="maxLength"/>
      <div class="van-input-icon" @click="handleIcon" v-if="vanIcon">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="vanIcon"></use>
        </svg>
      </div>
      <div class="input-note" v-if="note">{{note}}</div>
    </div>

  </div>
</template>

<script>
// 密码输入框组件
export default {
  name: 'appInput',
  data () {
    return {
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    vanIcon: {
      type: String,
      default: ''
    },
    note: {
      type: String,
      default: ''
    },
    textRows: {
      type: String,
      default: '3'
    },
    className: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxLength: {
      default: ''
    }
  },
  methods: {
    // 点击icon
    handleIcon () {
      this.$emit('handleIcon')
    },
    handleInput (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../static/css/theme";

.app-input{
  width: 100%;
  .input-box{ width: 100%;position: relative; }
}

.app-input.input-layer{
  input,textarea{ width: 100%;background-color: #F7F7F7;border-radius: 3px;outline: none;font-size: 14px;color:$app-font-title-gray-color;padding: 10px;letter-spacing: 0.4px;border: 1px solid #FFF;box-sizing: border-box; }
  input::-webkit-input-placeholder {
    font-size: 12px;
  }
  input:focus,
  input:active,
  textarea:focus,
  textarea:active{
    background-color: #FFF;
    border: 1px solid $app-def-dark-color;
  }
  input{
    height: 42px;
  }
  textarea {
    border-radius: 0px;
  }
  .input-note{
    line-height: 18px;
    color:$app-font-gray-color;
    font-size: 12px;
    margin-top: 8px;
    text-align: right;
  }
}

.app-input .van-input-icon{ width:42px;height:42px;position: absolute;top:0px;right:0px;font-size: 16px;text-align: center;line-height: 42px;cursor: pointer;background:initial;  }

.address-input-icon.app-input{

  input {
    width: calc(100% - 42px);
    float: left;
  }
  .van-input-icon{
    background-color: #F7F7F7;
    float: right;
    height: 39px;
    top:1px;
  }
}

</style>
