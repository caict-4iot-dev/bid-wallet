<template>
  <div class="app-form-item">
    <label class="input-label" v-if="label" :class="error ? 'app-form-error' : ''">{{label}}</label>
    <slot></slot>
  </div>
</template>

<script>
import Schema from 'async-validator'

export default {
  name: 'formItem',
  inject: ['form'],
  props: {
    label: {
      type: String,
      default: ''
    },
    prop: {
      type: String
    }
  },
  data () {
    return {
      error: ''
    }
  },
  mounted () {
    this.$on('validate', this.validate)
  },
  methods: {
    // 备用方法
    validate () {
      if (!this.prop) {
        return false
      }
      const val = this.form.model[this.prop]
      const rule = this.form.rules[this.prop]
      const descriptor = {[this.prop]: rule}
      const schema = new Schema(descriptor)
      const source = {[this.prop]: val}
      schema.validate(source, error => {
        if (error) {
          this.error = error[0].message
          this.alertMsg(this.error)
          this.form.rules[this.prop].error = true
          return false
        } else {
          this.error = ''
          this.form.rules[this.prop].error = false
        }
      })
    },
    alertMsg (msg) {
      this.$dialog.alert({
        message: msg,
        confirmButtonText: 'OK'
      }).then(() => {
      })
    }

  }
}
</script>

<style lang="scss" scoped>

@import "../../../static/css/theme";

.app-form-item{ position: relative;margin-bottom: 10px; }
.app-form-error.input-label{ color:red; }
.input-label{ display: block;color: $app-font-gray-color;letter-spacing: 0.27px;line-height: 14px;margin-bottom: 8px;font-size: 14px; }
</style>

