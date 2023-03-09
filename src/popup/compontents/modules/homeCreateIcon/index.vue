<template>
  <div class="home-create-icon" @click="toSelectCreate">
    <van-icon name="plus" />
  </div>
</template>

<script>
export default {
  name: 'homeCreateIcon',
  methods: {
    toSelectCreate () {
      this.$router.push({path: '/createList'})
    }
  }
}
</script>

<style scoped>
.home-create-icon{
  width: 62px;
  height: 62px;
  position: fixed;
  right:15px;
  bottom:51px;
  border-radius: 50%;
  background-color: rgba(255,255,255,.8);
  box-shadow:0px 2px 12px #dbdbdb;
  color: #3b74dd;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  line-height: 62px;
  cursor: pointer;
  z-index: 100;
}
</style>
