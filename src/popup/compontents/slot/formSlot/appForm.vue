<template>
  <form>
    <slot></slot>
  </form>
</template>

<script>
import Schema from 'async-validator'
export default {
  name: 'appForm',
  provide () {
    return {
      form: this,
      errorItem: false
    }
  },
  props: {
    model: {
      type: Object
    },
    rules: {
      type: Object
    }
  },
  methods: {
    validate (cb) {
      let v = true
      Object.keys(this.model).every(item => {
        const val = this.model[item]
        const rule = this.rules[item]
        if (rule) {
          const descriptor = {[item]: rule}
          const schema = new Schema(descriptor)
          const source = {[item]: val}
          schema.validate(source, error => {
            if (error) {
              this.alertMsg(error[0].message)
              v = false
            } else {
              v = true
            }
          })
          return v
        } else {
          return true
        }
      })
      cb(v)
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

<style scoped>

</style>
