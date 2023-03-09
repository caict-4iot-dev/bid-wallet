<template>
  <div class="file-upload-box">
    <van-uploader :before-read="beforeRead" :after-read="onRead">
      <div class="file-upload">
        <div class="file-create-box">
          <i>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tianjia1"></use>
            </svg>
          </i>
          <p v-if="!uploadFileName">上传文件</p>
          <p v-else>{{uploadFileName}}</p>
        </div>
      </div>
    </van-uploader>
  </div>
</template>

<script>
export default {
  name: 'fileUpload',
  data () {
    return {
      uploadFileName: ''
    }
  },
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
      this.setUploadOverFont(file)
      this.$emit('setFile', file)
    },
    setUploadOverFont (file) {
      this.uploadFileName = '文件：' + file.file.name
    },
    cleanFile () {
      this.uploadFileName = ''
    }
  }
}
</script>

<style lang="scss" scoped>

  .file-upload{
    display: flex;
    align-items: center;
    width: 100%;
    height:92px;
    background: #F2F3F5;
    border: 1px dashed rgba(153,153,153,1);
    border-radius: 4px;
  }
  .file-create-box{
    height:47px;
    margin: 0 auto;
    font-size: 12px;
    color: #999999;
    width: 100%;
    text-align: center;

    i{
      display: block;
      width: 20px;
      height:20px;
      margin: 0 auto 10px auto;
      font-size: 20px;
    }
  }


</style>
