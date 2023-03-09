<template>
  <div class="fullScreen-layer index-10">
    <img src="../../../static/images/hardware-top-img.png" class="top-left-img"/>
    <img src="../../../static/images/hardware-footer-img.png" class="footer-right-img"/>

    <div class="full-screen-wrapper flex-wrapper main-container-wrapper app-bg-light">
      <div class="restore-kind-layer">
        <h1>恢复账户</h1>
        <div class="blue-title-view">
          设置解锁密码
        </div>

        <appForm :rules="rulesForm" :model="modelForm" ref="passForm">

          <appFormItem label="创建账户密码" prop="password">
            <passWordInput v-model.trim="modelForm.password"></passWordInput>
          </appFormItem>

          <appFormItem label="确认账户密码">
            <passWordInput v-model.trim="modelForm.rePassword"></passWordInput>
          </appFormItem>
        </appForm>

        <van-button
          type="info"
          class="btn-info fr"
          style="width: 100%; height: 42px;margin-top: 70px"
          @click="submitForm('passForm')"
          :disabled="isDisabled"
        >{{$t('app.btnText.next')}}</van-button>

      </div>
    </div>
  </div>
</template>

<script>

import appForm from '../../../compontents/slot/formSlot/appForm'
import appFormItem from '../../../compontents/slot/formSlot/appFormItem'
import passWordInput from '../../../compontents/modules/passWordInput'
import {alertMsg} from '../../../config/vanUtil'
import {pwPattern} from '../../../config/param'

export default {
  name: 'PasswordVerify',
  data () {
    return {
      rulesForm: {
        password: [{required: true, message: this.$t('app.errorInfo.pw')}]
      },
      isLoading: false,
      modelForm: {
        password: '',
        rePassword: ''
      },
      isDisabled: true
    }
  },
  watch: {
    'modelForm.password' () {
      if (this.modelForm.password && this.modelForm.rePassword) {
        this.isDisabled = false
      }
    },
    'modelForm.rePassword' () {
      if (this.modelForm.password && this.modelForm.rePassword) {
        this.isDisabled = false
      }
    }
  },
  components: {
    appForm,
    appFormItem,
    passWordInput
  },
  methods: {
    submitForm (form) {
      if (!this.modelForm.password) {
        alertMsg(this.$t('app.errorInfo.pw'))
        return false
      } else {
        if (!this.modelForm.password.match(pwPattern)) {
          alertMsg(this.$t('app.errorInfo.pwFormatRequest'))
          return false
        }
      }
      this.$refs[form].validate(r => {
        if (r) {
          if (this.modelForm.password === this.modelForm.rePassword) {
            this.$emit('setPassword', this.modelForm.password)
          } else {
            alertMsg(this.$t('app.errorInfo.pwConfirm'))
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.blue-title-view{ width: 100%;height:56px;background: #F0F4FD;line-height: 56px;text-align: center;font-size: 16px;color: #3B74DD;margin-bottom: 66px; }
.index-10{ z-index: 10; }
</style>
