<template>
  <!--  解锁  -->
  <div class="app-wrapper app-bg-light lock-layer">

    <div class="layer-header header-fixed"></div>

    <div class="main-container">
      <div class="main-container-wrapper">

        <div class="wel-title">
          <div class="wel-logo">
            <img src="../../static/images/logo-name.svg" width="100%" height="100%" alt="BidWallet Logo" />
          </div>
          <h1>{{$t('app.welcome.welBack')}}</h1>
        </div>

        <div class="form-mt-create">

          <appForm :rules="rulesform" :model="modelform" ref="passForm" class="form-mb">
            <appFormItem :label="this.$t('app.inputText.password')" prop="password">
              <passWordInput v-model="modelform.password"></passWordInput>
            </appFormItem>
          </appForm>


          <van-button type="info" class="btn-info width-stretch create-btn-mt" @click="submitForm('passForm')" :loading="loadingBtn" :disabled="formDisabled">
            {{$t('app.btnText.unlock')}}
          </van-button>

        </div>

        <div class="wel-footer">
          <p class="wel-footer-tag">{{$t('app.welcome.tag')}}</p>
          <span @click="toImport">{{$t('app.welcome.link')}}</span>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import appForm from '../../compontents/slot/formSlot/appForm'
import appFormItem from '../../compontents/slot/formSlot/appFormItem'
import passWordInput from '../../compontents/modules/passWordInput'
import { mapMutations } from 'vuex'
import BewExtension from '../../../lib/extension'
import {alertMsg} from '../../config/vanUtil'
import KeyUtil from '../../../lib/keyUtil'
const keyUtil = new KeyUtil()
const bewExtension = new BewExtension()

export default {
  name: 'lock',
  data () {
    return {
      rulesform: {
        password: [{required: true, message: this.$t('app.errorInfo.pw')}]
      },
      modelform: {
        password: ''
      },
      routerPath: '/',
      loadingBtn: false,
      formDisabled: true
    }
  },
  components: {
    appForm,
    appFormItem,
    passWordInput
  },
  watch: {
    modelform: {
      handler () {
        if (this.modelform.password) {
          this.formDisabled = false
        } else {
          this.formDisabled = true
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('wallet', [
      'setPassword'
    ]),
    ...mapMutations([
      'setMarkTime'
    ]),
    submitForm (form) {
      const that = this
      setTimeout(function () {
        that.$refs[form].validate(r => {
          if (r) {
            that.unlockFn()
          } else {
            that.loadingBtn = false
          }
        })
      }, 100)
    },

    unlockFn () {
      this.loadingBtn = true
      const keyStore = this.findKeyStoreArray()
      keyUtil.importAccountKeystoreFn(keyStore, this.modelform.password).then((res) => {
        if (res) {
          this.setPassword(this.modelform.password)
          this.setMarkTime(new Date().getTime())
          if (this.routerPath) {
            this.$router.push({path: `${this.routerPath}?${this.queryParams(this.$route.query)}`})
          } else {
            this.$router.push({path: '/'})
          }
        } else {
          this.loadingBtn = false
          alertMsg(this.$t('app.errorInfo.pwFormatRequest'))
        }
      }).catch(error => {
        this.loadingBtn = false
      })
    },
    findKeyStoreArray () {
      const address = this.$store.state.bweVault.activeAccount.address
      const KeyStoreArray = this.$store.state.bweVault.keystoreData
      let obj = KeyStoreArray.find(e => e.keystoreData.address === address)
      return obj.keystoreData
    },
    toImport () {
      bewExtension.openTabs('/pages/popup.html#/restoreAccount')
    },
    queryParams (data, isPrefix = false) {
      let prefix = isPrefix ? '?' : ''
      let _result = []
      for (let key in data) {
        let value = data[key]
        // 去掉为空的参数
        if (['', undefined, null].includes(value)) {
          continue
        }
        if (value.constructor === Array) {
          value.forEach(_value => {
            _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(_value))
          })
        } else {
          _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
        }
      }
      return _result.length ? prefix + _result.join('&') : ''
    }
  },
  destroyed () {
    document.onkeypress = function (e) {}
  },
  mounted () {
    let that = this
    document.onkeypress = function (e) {
      const keycode = document.all ? event.keyCode : e.which
      if (keycode === 13) {
        that.submitForm('passForm')
        return false
      }
    }
  },
  created () {
    this.routerPath = this.$route.query.toUrl
  }
}
</script>

<style lang="scss" scoped>
@import "../../static/css/theme";
  .lock-layer{
    .header-fixed .header-fixed-r {
      padding: 0 24px;
    }
    .main-container-wrapper {
      padding: 20px 24px;
    }
    .lock-logo{
      width: 111px;
      height:20px;
      background-color: #999999;
      margin-top: 20px;
    }
    .wel-title{
      margin-top: 36px;
      .wel-logo{
        width: 233px;
        height:42px;
        margin: 0px auto 40px auto;
      }
      h1{
        line-height: 28px;
      }
      // p{
      //   line-height: 22px;
      // }
    }
    .form-mt-create{
      margin-top: 64px;
      .form-mb{
        margin-bottom: 20px;
      }
    }
    .wel-footer{
      margin-top: 68px;
      .wel-footer-tag {
        margin-bottom: 12px;
      }
    }

  }



</style>
