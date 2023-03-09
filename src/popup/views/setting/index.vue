<template>
  <div class="app-wrapper app-bg-light">

    <headerSlot
      :title-name="this.$t('app.setting.settingTitle')"
      :isShadow="false"
    ></headerSlot>

    <div class="main-container">
      <div class="main-container-wrapper">

        <div class="option-box">
          <div class="option-item" @click="toLang">
            <div class="option-item-icon">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-language-icon"></use>
              </svg>
            </div>
            <div class="option-item-name">
              {{$t('app.setting.language')}}
            </div>
            <div class="option-item-link">
              <van-icon name="arrow" />
            </div>
          </div>

          <div class="option-item" >
            <div class="option-item-icon">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-banbenhao"></use>
              </svg>
            </div>
            <div class="option-item-name">
              {{$t('app.setting.version')}}
            </div>
            <div class="option-item-link">
              <i class="option-info">V{{version}}</i>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headerSlot from '../../compontents/slot/headerSlot'
import {version} from '../../../manifest'
export default {
  name: 'setting',
  data () {
    return {
      version: version
    }
  },
  components: {
    headerSlot
  },
  methods: {
    toLang () {
      this.$router.push({path: '/languages'})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../static/css/theme";

.option-box{
  width: 100%;
  .option-item{
    width: 100%;
    margin-bottom: 15px;
    background-color: $app-box-msg-bg;
    border-radius: $app-radius-def;
    padding: 0px 15px 0px 8px;
    height:60px;
    line-height: 60px;
    cursor: pointer;

    .option-item-icon{
      font-size: 16px;
      vertical-align: sub;
      display: inline-block;
    }
    .option-item-name{
      display: inline-block;
      margin-left: 10px;
    }
    .option-item-link{
      display: inline-block;
      float: right;
      color: rgba(196, 196, 196, 1.00);
    }
  }
  .option-info{
    color: $app-font-color;
  }
}


</style>
