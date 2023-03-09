<template>
  <van-dialog
    v-model:show="show"
    :title="obj.title"
    @confirm="close"
    :confirm-button-text="this.$t('app.btnText.confirm')"
    >
    <div class="dialog-info-layer">
      {{obj.content}}

      <van-popover v-model="showPopover" trigger="click">
        <div class="dialog-info-content">
          {{obj.errorInfo}}
        </div>
        <template #reference>
          <van-icon name="warning-o" />
        </template>
      </van-popover>

    </div>
  </van-dialog>
</template>

<script>
export default {
  name: 'InfoDialog',
  data () {
    return {
      show: false,
      obj: {
        title: '',
        content: '',
        errorInfo: ''
      },
      showPopover: false
    }
  },
  methods: {
    close () {
      this.$emit('closeDialog')
    },
    setInfoData (data) {
      this.show = true
      this.obj = data
    }
  }
}
</script>

<style scoped>
.dialog-info-layer{ padding: 15px;text-align: center; }
.dialog-info-content{ width: 180px;padding: 10px; }
</style>
