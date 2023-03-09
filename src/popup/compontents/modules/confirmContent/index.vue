<template>
  <div class="app-content-item">
    <div class="content-label">
      <slot></slot>
    </div>
    <div class="content-item-box" :style="{height:heightStyle,lineHeight:lineHeightStyle}">
      <div class="text-label" :style="fontStyle">
        {{textLabel}}
        <div class="text-tag" v-if="textTag">{{textTag}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    label: {
      type: String,
      default: ''
    },
    textLabel: {
      type: String,
      default: ''
    },
    textTag: {
      type: String,
      default: ''
    },
    heightStyle: {
      type: String,
      default: '38px'
    },
    lineHeightStyle: {
      type: String,
      default: '38px'
    },
    fontStyle: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../static/css/theme";

  .app-content-item{
    position: relative;margin-bottom: 16px;width: 100%;line-height: 14px;

    .content-label{display: block;color: $app-font-gray-color;letter-spacing: 0.27px;line-height: 22px;margin-bottom: 8px;font-size: 14px;}
    .content-item-box{
      width: 100%;
      line-height: 42px;
      height:42px;
      background-color: rgba(242, 243, 245, 1);
      padding: 0px 12px;
      cursor: $app-font-title-gray-color;
      border-radius: $app-radius-def;
      overflow-y: auto;

      .text-label{
        float: left;
        width: 100%;
        text-align: left;

        .text-tag{
          float: right;
          font-size: 14px;
          font-weight: initial;
        }
      }

    }
  }

</style>
