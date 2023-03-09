import KeyUtil from '../../lib/keyUtil'

const keyUtil = new KeyUtil()

export default {
  shortenStrFilter (address) {
    if (!address) {
      return '--'
    }
    let len = address.length
    return address.substr(0, 13) + '...' + address.substr(len - 6, len)
  },
  shortenIdFilter (address) {
    if (!address) {
      return '--'
    }
    let len = address.length
    return address.substr(0, 1) + '......' + address.substr(len - 1, len)
  },

  fmtTimeFromTimestamp (timestamp, type) {
    let result = ''
    const datetime = new Date()
    let datetimeLength = (timestamp + '').length
    if (datetimeLength > 10) {
      timestamp = (timestamp + '').substr(0, 10)
    }
    timestamp = (timestamp + '').length === 10 ? timestamp * 1000 : timestamp
    datetime.setTime(timestamp)
    let nYear = datetime.getFullYear()
    let nMonth = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
    let nDate = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
    let nHour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours()
    let nMinute = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes()
    let sSecond = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds()
    if (type === 'date') {
      result = nYear + '-' + nMonth + '-' + nDate
    } else {
      result = nYear + '-' + nMonth + '-' + nDate + ' ' + nHour + ':' + nMinute + ':' + sSecond
    }
    return result
  },
  fmtTimeEn (timestamp) {
    let date = new Date()
    let datetimeLength = (timestamp + '').length
    if (datetimeLength > 10) {
      timestamp = (timestamp + '').substr(0, 10)
    }
    timestamp = (timestamp + '').length === 10 ? timestamp * 1000 : timestamp
    date.setTime(timestamp)
    let monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Spt', 'Oct', 'Nov', 'Dec']
    let suffix = ['st', 'nd', 'rd', 'th']
    let year = date.getFullYear()
    let month = monthArr[date.getMonth()]
    let ddate = date.getDate()
    let nHour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    let nMinute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

    if (ddate % 10 < 1 || ddate % 10 > 3) {
      ddate = ddate + suffix[3]
    } else if (ddate % 10 === 1) {
      ddate = ddate + suffix[0]
    } else if (ddate % 10 === 2) {
      ddate = ddate + suffix[1]
    } else {
      ddate = ddate + suffix[2]
    }
    return month + ' ' + ddate + ' ' + year + ' ' + nHour + ':' + nMinute
  },
  uGas2Gas (uGas) {
    if (!uGas) {
      return '0'
    }
    return keyUtil.uGasToGasFn(uGas)
  }

}
