import {Dialog, Toast} from 'vant'

export const alertMsg = (msg, fn) => {
  Dialog.alert({
    message: msg
    // allowHtml: true
  }).then(() => {
    if (fn) fn()
  })
}

export const errorToast = (message) => {
  Toast.fail({ message: message, duration: 3000 })
}

export const verifyWord = (str) => {
  str = str.replace(/(^\s*)|(\s*$)/g, '')
  let wordLength = str.split(' ').length
  if (wordLength === 12) {
    return true
  } else {
    return false
  }
}

export default {alertMsg, verifyWord, errorToast}
