<template>
  <header class="header-slot" :class="isShadow ? 'h-shadow' : ''">
    <div class="header-slot-l" v-if="isBack" @click="returnPage">
      <van-icon name="arrow-left" />
    </div>
    <div class="header-slot-l" v-else>
      <slot name="left"></slot>
    </div>
    <span class="header-slot-c">
      {{this.titleName}}
    </span>
    <div class="header-slot-r">
      <slot name="right"></slot>
    </div>
  </header>
</template>

<script>
// 顶部标题插槽
export default {
  name: 'headerSlot',
  props: {
    titleName: {
      type: String,
      default: ''
    },
    isShadow: {
      type: Boolean,
      default: false
    },
    isBack: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    returnPage () {
      history.go(-1)
    }
  }
}
</script>

<style scoped>
  .h-shadow{ box-shadow: 0px 2px 4px rgba(148, 148, 148, 0.5); }
</style>
