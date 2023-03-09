<template>
  <!--  home layer  -->
  <div class="layout-wrapper">
    <!--  header  -->
    <layoutHeader />
    <!--  left nav  -->
    <layoutNav />

    <slot></slot>

  </div>

</template>

<script>
import layoutHeader from './header'
import layoutNav from './nav'

export default {
  name: 'layout',
  components: {
    layoutHeader,
    layoutNav
  }
}
</script>

<style scoped>

</style>
