<template>
  <div class="result-state" :class="state">
    <div class="result-state-icon">
      <svg class="icon" aria-hidden="true" v-if="state === 'Success'">
        <use xlink:href="#icon-Success_ruo"></use>
      </svg>
      <svg class="icon" aria-hidden="true" v-else-if="state === 'Failed'">
        <use xlink:href="#icon-Error_ruo"></use>
      </svg>
    </div>
    <p>{{state}}</p>
    <div class="result-state-tag">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    state: {
      type: String,
      default: 'success'
    }
  }
}
</script>

<style lang="scss" scoped>
  .result-state{
    text-align: center;
    width: 100%;

    &-icon{
      width: 43px;
      height:43px;
      border-radius: 50%;
      margin: 0 auto;
      font-size: 42px;
      line-height: 43px;
    }
    &.success .result-state-icon {
      background-color: #d1f9d5;
      color:rgba(0, 180, 42, 1);
    }
    &.fail .result-state-icon{
      background-color: tomato;
      color:#FFF;
    }
    p{ line-height: 22px;margin-top: 9px; }

    &-tag{
      color: rgba(51, 51, 51, 0.45);
      line-height: 22px;
      font-size: 12px;
    }
  }
</style>
