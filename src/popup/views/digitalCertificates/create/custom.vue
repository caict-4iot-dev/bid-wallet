<template>
  <div class="app-wrapper app-bg-dark pb50">
    <!--  顶部组件  -->
    <headerSlot
      :title-name="`添加${titleName}`"
      :isShadow="true"
    >
    </headerSlot>

    <div class="main-container">

      <div class="main-container-wrapper">

        <div class="create-wrapper-padding ">
          <h2>信息登记</h2>
          <appForm :rules="rulesUserForm" :model="modelUserForm" ref="modelUserForm">
            <appFormItem :label="item.label"  v-for="(item,index) in customModel" :key="index">
              <app-input
                v-model="modelUserForm[item.key]"
                :placeholder="`请输入${item.label}`"
              ></app-input>
            </appFormItem>

          </appForm>

        </div>

      </div>

    </div>

    <div class="bottom-btn-group">
      <van-button type="info" class="handle-info-btn btn-info" @click="cleanData" plain>重置</van-button>
      <van-button type="info" class="handle-info-btn btn-info" @click="submitForm" :loading="btnLoading">提交</van-button>
    </div>

  </div>
</template>

<script>
import headerSlot from '../../../compontents/slot/headerSlot'
import appForm from '../../../compontents/slot/formSlot/appForm'
import appFormItem from '../../../compontents/slot/formSlot/appFormItem'
import appInput from '../../../compontents/modules/appInput'
import walletApi from '../../../service/api/walletApi'
import {alertMsg} from '../../../config/vanUtil'

export default {
  name: 'createCustomTrust',
  data () {
    return {
      titleName: null,
      btnLoading: false,
      customModel: [],
      templateId: null,
      modelUserForm: {
      },
      rulesUserForm: {

      }
    }
  },
  components: {
    headerSlot,
    appForm,
    appFormItem,
    appInput
  },
  methods: {
    getCustomDetail () {
      const param = {
        templateId: this.templateId
      }
      this.customModel = []
      walletApi.getCustomDetailData(param).then(res => {
        if (!res.data.applyFormat) {
          return false
        }
        let attributes = JSON.parse(res.data.applyFormat)
        let attributesArr = attributes
        this.titleName = res.data.templateName
        for (let i = 0; i < attributesArr.length; i++) {
          this.modelUserForm[attributesArr[i].key] = ''
          this.customModel.push(attributesArr[i])
        }
      })
    },
    submitForm () {
      for (let i = 0; i < this.customModel.length; i++) {
        for (let key in this.modelUserForm) {
          if (this.customModel[i].key === key) {
            this.customModel[i].value = this.modelUserForm[key]
          }
        }
      }
      for (let i = 0; i < this.customModel.length; i++) {
        if (!this.customModel[i].value) {
          alertMsg(this.customModel[i].label + '不能为空！')
          return false
        }
      }
      this.btnLoading = true
      let param = {
        attributes: this.customModel
      }
      param.content = JSON.stringify(param)
      param.templateId = this.templateId
      walletApi.applicationCredential(param).then(res => {
        this.$router.push({
          path: '/createResult',
          query: {type: 'web'}
        })
      }).catch(error => {
        console.log(error)
        this.btnLoading = false
      })
    },
    cleanData () {
      this.getCustomDetail()
    }
  },
  mounted () {
    this.templateId = this.$route.query.templateId
    this.getCustomDetail()
  }
}
</script>

<style scoped>

</style>
