import extension from 'extensionizer'

// 拦截error
function checkForError () {
  const {lastError} = extension.runtime
  if (!lastError) {
    return undefined
  }

  if (lastError.stack && lastError.message) {
    return lastError
  }

  return new Error(lastError.message)
}

// 获取系统语言
function getLanguage () {
  let lang = ''
  if (window.navigator.appName === 'Netscape') {
    lang = window.navigator.language
  } else {
    lang = window.navigator.browserLanguage
  }

  if (lang.indexOf('zh') > -1) {
    lang = 'zh'
  } else if (lang.indexOf('en') > -1) {
    lang = 'en'
  } else {
    lang = 'en'
  }
  return lang
}

// 地址插入用省略号
function shortenStr (address) {
  if (!address) {
    return '--'
  }
  let len = address.length
  return address.substr(0, 13) + '...' + address.substr(len - 6, len)
}

// 判断是否为json
function isJSON (str) {
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}

/**
 * 获取数据类型
 * @param {*} obj
 */
function getTypeByObj (obj) {
  return Object.prototype.toString.call(obj).match(/^\[object ([a-zA-Z]*)\]$/)[1]
}

/**
 * 判断是否是空对象
 * @param {*} obj
 */
function isEmptyObject (obj) {
  for (let key in obj) {
    return false
  }
  return true
}

/**
 * 比较两个json（新json与老json）的不同,并返回 不同时的旧值(old_val)和新值(new_val)
 * @param {*} json1 老json
 * @param {*} json2 新json
 */
function diffJson (json1, json2) {
  if (!json1 || isEmptyObject(json1) || !json2 || isEmptyObject(json2)) {
    return null
  }
  let diffRes = {
    old_val: {},
    new_val: {}
  }
  for (let k in json2) {
    // 判断数据类型是否一致
    if (getTypeByObj(json2[k]) === getTypeByObj(json1[k])) {
      // 比较 “Array”和“Object”类型
      if (getTypeByObj(json2[k]) === 'Array' || getTypeByObj(json2[k]) === 'Object') {
        const diffData = diffJson(json1[k], json2[k])
        if (!isEmptyObject(diffData)) {
          diffRes.old_val[k] = diffData.old_val
          diffRes.new_val[k] = diffData.new_val
        }
      } else if (json1[k] !== json2[k]) { // 比较其他类型数据
        diffRes.old_val[k] = json1[k]
        diffRes.new_val[k] = json2[k]
      }
    } else {
      diffRes.old_val[k] = json1[k]
      diffRes.new_val[k] = json2[k]
    }
  }
  // 若没有变化，返回null
  if (isEmptyObject(diffRes.old_val) || isEmptyObject(diffRes.new_val)) {
    return null
  }
  return diffRes
}

function isWindowsSystem () {
  let isWinSystem
  let isMac = /macintosh|mac os x/i.test(navigator.userAgent)
  if (isMac) {
    isWinSystem = false
  } else {
    isWinSystem = true
  }
  return isWinSystem
}

function jwsFormatDecode (str) {
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
}

export {checkForError, getLanguage, shortenStr, isJSON, diffJson, isWindowsSystem, jwsFormatDecode}
