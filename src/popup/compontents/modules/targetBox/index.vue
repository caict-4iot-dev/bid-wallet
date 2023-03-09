<template>
  <div class="target-box">
    <!--     目标页icon     -->
    <div class="target-box-icon">
      <img :src="icon" width="100%" height="100%" />
    </div>
    <!--     目标页域名     -->
    <div class="target-box-url">
      {{url}}
    </div>

    <slot></slot>

  </div>
</template>

<script>
// 目标页信息展示组件
export default {
  name: 'targetBox',
  props: {
    url: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
