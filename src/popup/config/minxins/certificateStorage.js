import walletApi from '../../service/api/walletApi'
import { mapMutations } from 'vuex'
let Base64 = require('js-base64').Base64

let certificateStorage = {
  data () {
    return {
    }
  },

  methods: {
    ...mapMutations('certificate', [
      'setCertificate',
      'setCertificateData'
    ]),
    filterCertificate (downBidArr) {
      if (downBidArr.length > 0) {
        this.filterDataForDown(downBidArr)
      }
    },
    async filterDataForDown (data) {
      for (let i = 0; i < data.length; i++) {
        this.downloadCertificate(data[i]).then(res => {
          if (!res.data || !res.data.jws) {
            return false
          }
          let vcData = null
          if (res.data.vc) {
            vcData = JSON.parse(res.data.vc)
          } else {
            vcData = this.filterDownJws(res.data).vc
          }
          const param = {
            accountAddress: this.$store.state.bweVault.activeAccount.address,
            credentialId: data[i],
            templateId: vcData.templateId,
            networkUrl: this.$store.state.bweVault.currentNetwork.rpcUrl,
            content: res.data
          }
          param.content.vc = null
          if (param.accountAddress === vcData.credentialSubject.id) {
            this.setCertificate(param)
            this.setCredentialData(data[i])
          }
        })
      }
    },
    formatDecode (str) {
      let s = str.replaceAll('-', '+')
      s = s.replaceAll('_', '/')
      switch (s.length % 4) {
        case 0:
          break
        case 1:
        default:
          return null
        case 2:
          s = s + '=='
          break
        case 3:
          s = s + '='
      }
      return s
    },
    async downloadCertificate (id) {
      const param = {
        credentialId: id
      }
      // eslint-disable-next-line no-return-await
      return await walletApi.downCredentialData(param)
    },
    filterNoneDown (certificateData) {
      const storageData = this.$store.state.certificate.certificateList
      let downGroupId = []
      for (let i = 0; i < certificateData.length; i++) {
        let isHasData = false
        for (let j = 0; j < storageData.length; j++) {
          if (certificateData[i].credentialBid === storageData[j].credentialId) {
            isHasData = true
          }
        }
        if (!isHasData) {
          downGroupId.push(certificateData[i].credentialBid)
        }
      }
      return downGroupId
    },
    deleteCertificates (id) {
      const storageData = this.$store.state.certificate.certificateList
      for (let i = 0; i < storageData.length; i++) {
        if (id === storageData[i].credentialId) {
          storageData[i].isDelete = true
          storageData[i].content = ''
        }
      }
      this.setCertificateData(storageData)
      this.$router.push({path: '/'})
    },
    findActiveCertificates (id) {
      let cfData = this.$store.state.certificate.certificateList
      let detailData = null
      for (let i = 0; i < cfData.length; i++) {
        if (id === cfData[i].credentialId) {
          detailData = cfData[i]
        }
      }
      if (!detailData.content.vc) {
        detailData.content = this.filterDownJws(detailData.content)
      }
      return detailData
    },
    filterDownJws (storageData) {
      if (storageData && storageData.jws) {
        let jws = storageData.jws.split('.')
        let formatJws = this.formatDecode(jws[1])
        let parsedWordArray = Base64.decode(formatJws)
        let vcData = JSON.parse(parsedWordArray)
        storageData.vc = vcData
      }
      return storageData
    },
    filterJws (storageData) {
      for (let i = 0; i < storageData.length; i++) {
        if (!storageData[i].isDelete && !storageData[i].content.vc) {
          let jws = storageData[i].content.jws.split('.')
          let formatJws = this.formatDecode(jws[1])
          let parsedWordArray = Base64.decode(formatJws)
          let vcData = JSON.parse(parsedWordArray)
          storageData[i].content.vc = vcData
        }
      }
      return storageData
    },
    checkPlaintextData () {
      this.$nextTick(() => {
        let storageData = this.$store.state.certificate.certificateList
        for (let i = 0; i < storageData.length; i++) {
          if (storageData[i].content && storageData[i].content.vc) {
            storageData[i].content.vc = null
          }
        }
        this.setCertificateData(storageData)
      })
    }
  }
}

export default certificateStorage
