import Vue from 'vue'
import VueI18n from 'vue-i18n'
import {Locale} from 'vant'

import enUS from 'vant/lib/locale/lang/en-US'
import zhCN from 'vant/lib/locale/lang/zh-CN'
import enLocale from './en_us'
import zhLocale from './zh_cn'
import {getLanguage} from '../../lib/util'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enUS,
    ...enLocale
  },
  zh: {
    ...zhCN,
    ...zhLocale
  }
}

const langTag = window.localStorage.getItem('lang') ? window.localStorage.getItem('lang') : getLanguage()
window.localStorage.setItem('lang', langTag)

const i18n = new VueI18n({
  locale: langTag, // 设置默认语言
  messages: messages // 设置资源文件对象
})

// 更新vant组件库本身的语言变化，支持国际化
function vantLocales (lang) {
  if (lang === 'en') {
    Locale.use(lang, enUS)
  } else if (lang === 'zh') {
    Locale.use(lang, zhCN)
  }
}

export {i18n, vantLocales}
