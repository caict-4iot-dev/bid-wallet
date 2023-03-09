<template>
    <div id="app">
        <transition>
            <router-view :key="key"/>
        </transition>
    </div>
</template>
<script>
    import { mapMutations } from 'vuex'
    import ExtensionStore from '../lib/localStore'
    const extensionStore = new ExtensionStore()

    export default {
      name: 'app',
      data () {
        return {
          initData: null,
          temporaryPath: '/'
        }
      },
      computed: {
        key: function () {
          return this.$route.name !== undefined ? this.$route.name + '' + new Date() : this.$route + '' + new Date()
        }
      },
      methods: {
        ...mapMutations('wallet', [
          'setPassword'
        ]),
        ...mapMutations([
          'setMarkTime'
        ]),
        setLockState () {
          if (this.temporaryPath === '/restoreAccount') {
            this.$router.push({path: '/restoreAccount'})
            return false
          }
          extensionStore.get('data').then((res) => {
            let data = JSON.parse(res.data)
            const lockTime = data.bweVault.config.lockTime * 60 * 1000
            const markTime = data.bweVault.config.markTime ? data.bweVault.config.markTime : new Date().getTime()
            if (((new Date().getTime() - markTime) >= lockTime) && data.bweVault.keystoreData.length !== 0) {
              this.setPassword('')
              this.$router.push({path: '/lock', query: {toUrl: this.temporaryPath, ...this.$route.query}})
            } else {
              this.setMarkTime(new Date().getTime())
            }
          })
        }
      },
      mounted () {
        this.setLockState()
      },
      beforeDestroy () {
      },
      created () {
        // 中转path
        this.temporaryPath = this.$route.path
      }
    }
</script>
<style lang="scss" scoped>
    @import "~vant/lib/index.css";

    @-webkit-keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    @keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    .icon {
        display: inline-block;
        stroke-width: 0;
        stroke: currentColor;
        fill: currentColor;
        width: 1em;
        height: 1em;
    }

</style>
