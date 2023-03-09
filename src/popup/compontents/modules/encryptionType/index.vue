<template>
  <div class="encryption-type-box">
    <span :class="{active: crypto === encryption.ED.type, noDrop: isHardware}" @click="selectType(encryption.ED.type)">{{encryption.ED.name}}</span>
    <span :class="{active: crypto === encryption.SM.type}" @click="selectType(encryption.SM.type)">{{encryption.SM.name}}</span>
  </div>
</template>

<script>

import {encryption} from '../../../config/param'
export default {
  name: 'encryption',
  props: {},
  data () {
    return {
      crypto: encryption.ED.type,
      isHardware: false,
      encryption: encryption
    }
  },
  methods: {
    selectType (type) {
      if (this.isHardware) {
        return false
      }
      this.crypto = type
    },
    setHardwareState () {
      this.isHardware = true
      this.crypto = encryption.SM.type
    },
    setDefConfig () {
      this.isHardware = false
      this.crypto = encryption.ED.type
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.kind-input-content{
  .encryption-type-box span{ width: 50%; }
}
.encryption-type-box {
  display: flex;
  border-radius: 3px;
  span {
    width: 172px;
    height: 42px;
    font-size: 14px;
    text-align: center;
    line-height: 42px;
    color: #7a7a7a;
    background: #f2f3f5;
    cursor: pointer;
  }
  span:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  span:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  .active {
    color: #fff;
    background: #3b74dd;
  }
  .noDrop{
    cursor: no-drop
  }
}
</style>
