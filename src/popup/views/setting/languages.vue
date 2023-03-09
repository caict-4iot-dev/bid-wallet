<template>
  <div class="app-wrapper app-bg-light">

    <headerSlot
      :title-name="this.$t('app.setting.langTitle')"
      :isShadow="false"
    ></headerSlot>

    <div class="main-container">
      <div class="main-container-wrapper">

        <div class="sel-option-box">
          <p @click="changeLang('en')">
            <span>English</span>
            <span class="sel-icon" v-if="lang === 'en'">
               <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-duihao"></use>
              </svg>
            </span>
          </p>
          <p @click="changeLang('zh')">
            <span>简体中文</span>
            <span class="sel-icon" v-if="lang === 'zh'" >
               <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-duihao"></use>
              </svg>
            </span>
          </p>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import headerSlot from '../../compontents/slot/headerSlot'
export default {
  name: 'languages',
  data () {
    return {
      lang: null
    }
  },
  components: {
    headerSlot
  },
  methods: {
    changeLang (state) {
      try {
        this.$i18n.locale = state
        window.localStorage.setItem('lang', state)
        this.lang = state
      } catch (e) {
        console.info(e)
      }
    }
  },
  mounted () {
    this.lang = window.localStorage.getItem('lang')
  }
}
</script>

<style lang="scss" scoped>
@import "../../static/css/theme";
.sel-option-box{
  width: 100%;
  background-color: $app-box-msg-bg;
  border-radius: $app-radius-def;

  p{
    width: 100%;
    height:45px;
    line-height: 45px;
    padding: 0 12px;
    border-bottom: 1px solid rgba(219, 217, 217, 1);
    cursor: pointer;

    &:last-child{
      border: 0;
    }
    .sel-icon{
      display: inline-block;
      float: right;
      font-size: 12px;
    }
  }
}


</style>
