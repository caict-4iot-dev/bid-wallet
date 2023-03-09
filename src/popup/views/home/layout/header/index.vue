<template>

  <div class="layer-header header-fixed">
    <div class="header-fixed-l" @click="openNav">
      <van-icon name="wap-nav" />
    </div>
  </div>

</template>

<script>
import $event, { EVENT_NAME } from '../../../../evenBus'

export default {
  name: 'layoutHeader',
  methods: {
    openNav () {
      $event.$emit(EVENT_NAME.CHANGE_COLLAPSE)
    }
  }
}
</script>

<style scoped>

  .home-assets-view .header-fixed-l{ color:#FFF; }
  .layer-header .header-fixed-l{ font-size: 23px; }
  .wallet-home .header-fixed{
    background-color: initial;
  }

</style>
