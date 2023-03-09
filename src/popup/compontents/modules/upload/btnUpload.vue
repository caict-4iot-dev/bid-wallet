<template>
  <div>
    <van-uploader :before-read="beforeRead" :after-read="onRead">
      <van-button icon="plus" type="info" style="height:36px">上传</van-button>
    </van-uploader>
  </div>
</template>

<script>
export default {
  name: 'btnUpload',
  methods: {
    beforeRead (file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
        this.$toast('只能选择 JPG、JPEG 和 PNG 图片格式')
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        this.$toast('文件大小不能超过 5M')
        return false
      }
      return true
    },
    onRead (file) {
      this.$emit('setFile', file)
    }
  }
}
</script>

<style scoped>

</style>
