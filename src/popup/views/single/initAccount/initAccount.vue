<template>
  <div>

    <createWallet v-if="steps === 1" @setPw="setPw" ref="createWallet"></createWallet>

    <copyWord v-if="steps === 2" ref="copyWord" @toVerify="toVerify" @returnCreate="returnCreate"></copyWord>

    <verifyWord v-if="steps === 3"  ref="verifyWord" @submitVerify="submitVerify"></verifyWord>

  </div>
</template>

<script>
import createWallet from './createWallet'
import copyWord from './copyWord'
import verifyWord from './verifyWord'
import randombytes from 'randombytes'
import { mapMutations } from 'vuex'
import {hdPaths} from '../../../config/param'
import KeyUtil from '../../../../lib/keyUtil'
const keyUtil = new KeyUtil()

export default {
  name: 'initAccount',
  data () {
    return {
      steps: 1,
      pw: null,
      seed: null,
      crypto: 'TYPE_ED25519',
      language: 'english',
      mnemonic: '',
      mnemonicCodeList: []
    }
  },
  components: {
    createWallet,
    copyWord,
    verifyWord,
    randombytes
  },
  methods: {
    ...mapMutations([
      'setKeystoreData',
      'setActiveAccount'
    ]),
    ...mapMutations('wallet', [
      'setPassword'
    ]),
    setPw (pw) {
      if (pw) {
        this.pw = pw
        this.crypto = this.$refs.createWallet.crypto
        this.createWord()
      }
    },
    returnCreate () {
      this.steps = 1
    },
    checkRepeat (res) {
      let arr = res.split(' ')
      let isRepeat = false
      for (let i = arr.length - 1; i > 0; i--) {
        let item = arr.pop()
        if (arr.indexOf(item) !== -1) {
          isRepeat = true
        }
      }
      return isRepeat
    },
    createWord () {
      this.setLanguage()
      this.seed = randombytes(16).toString('hex')
      keyUtil.generateMnemonicWord(this.seed, this.language).then(res => {
        if (!this.checkRepeat(res)) {
          this.steps = 2
          this.mnemonic = res
          this.mnemonicCodeList = this.mnemonic.split(' ')
          this.$nextTick(function () {
            this.$refs.copyWord.setWord(this.mnemonic)
          })
        } else {
          this.createWord()
        }
        this.$refs.createWallet.isLoading = false
      }).catch(error => {
        this.$refs.createWallet.isLoading = false
      })
    },
    toVerify () {
      this.steps = 3
      this.$nextTick(function () {
        this.$refs.verifyWord.setCode(this.mnemonicCodeList)
      })
    },
    submitVerify () {
      keyUtil.privateKeyMnemonicCode(this.crypto, this.mnemonic, hdPaths).then(res => {
        if (res) {
          this.createAccount(res)
        }
      }).catch(error => {
      })
    },
    createAccount (key) {
      keyUtil.createNewAccount(this.pw, key).then(res => {
        if (res) {
          let param = {
            keystoreData: res.keystoreData,
            accountName: 'Account 1',
            permissions: 'create'
          }
          this.setKeystoreData(param)
          this.setPassword(this.pw)

          this.setActiveAccount({
            accountName: 'Account 1',
            address: res.keystoreData.address
          })
          this.$router.push({path: '/restoreResult'})
        } else {
          this.$refs.verifyWord.closeLoading()
        }
      }).catch(error => {
        this.$refs.verifyWord.closeLoading()
      })
    },
    setLanguage () {
      // this.language = window.localStorage.getItem('lang') === 'en' ? 'english' : 'chinese'
      this.language = 'cn'
    }

  },
  mounted () {
    this.setLanguage()
  }
}
</script>
