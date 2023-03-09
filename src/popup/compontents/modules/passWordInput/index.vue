<template>
  <div class="password-input input-layer">
    <div class="input-box">
      <input :type="type" :value="value" @input="handleInput" :placeholder="placeholder"/>
      <div class="password-icon" @click="changeType">
        <svg class="icon" aria-hidden="true" v-if="type === 'password'">
          <use xlink:href="#icon-eye-icon"></use>
        </svg>
        <svg class="icon" aria-hidden="true" v-else>
          <use xlink:href="#icon-AK-IN_biyan"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
// 密码输入框组件
export default {
  name: 'passWordInput',
  data () {
    return {
      type: 'password'
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  methods: {
    changeType () {
      this.type = this.type === 'password' ? 'text' : 'password'
    },
    handleInput (e) {
      this.$emit('input', e.target.value)
    },
    sendValidate (e) {
      this.$emit('input', e.target.value)
      this.$parent.$emit('validate')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../static/css/theme";

.password-input{ width: 100%; }
.input-box{ width: 100%;position: relative; }
.input-layer input{ 
  width: 100%; 
  height: 42px; 
  background-color: rgba(242, 243, 245, 1);
  border-radius: 3px;
  outline: none;
  font-size: 14px;
  font-weight: bold;
  color: rgba(4, 44, 92, 1);
  padding: 10px;
  border: 1px solid rgba(242, 243, 245, 1);
  letter-spacing: 0.4px;
}
.input-layer input::-webkit-input-placeholder {
  font-size: 12px;
  font-weight: 400;
}
.input-layer input:focus,
.input-layer input:active{
  background-color: #FFF;
  border: 1px solid $app-def-dark-color;
}
.password-input .password-icon{ width:42px;height:42px;position: absolute;top:3px;right:0px;font-size: 16px;text-align: center;line-height: 42px;cursor: pointer;  }

</style>
