<template>
  <div class="notice-box" :class="`notice-${noticeType}`">
    <slot></slot>
  </div>
</template>

<script>
// "说明"组件
export default {
  name: 'noticeSlot',
  props: {
    noticeType: {
      type: String,
      default: 'error'
    }
  }
}
</script>

<style scoped>
  .notice-box{ width: 100%;padding:12px 13px;font-size: 12px;line-height: 22px; text-align: left; }
  .notice-box.notice-error{ background-color:#ffece7;color:#d43030; }
  .notice-box.notice-succeed{ background-color: rgba(0, 186, 173, 0.1);color: rgba(0, 0, 0, 1); }
  .notice-box.notice-warning{ background-color: rgba(255, 141, 26, 0.1)}
  .notice-box.notice-info{ background-color: rgba(242, 243, 245, 1);color: rgba(51, 51, 51, 1); }
</style>
