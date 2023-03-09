import Vue from 'vue'
import { Icon, Checkbox, Button, List, Popup, Toast, Lazyload, Row, Col, Tab, Tabs, Divider, Dialog, Loading, Popover, RadioGroup, Radio, Uploader, Collapse, CollapseItem, Cascader, Field } from 'vant'
import App from './app.vue'
import store from './store'
import router from './router'
import './router/guards'

import filter from './filters'
import VueClipboard from 'vue-clipboard2'
import './static/css/reset.scss'
import './static/css/base.scss'
import { i18n, vantLocales } from './lang'

import './static/css/iconfont/iconfont.js'

Object.keys(filter).forEach(key => Vue.filter(key, filter[key]))
Vue.use(VueClipboard)
Vue.use(Icon).use(Checkbox).use(Button).use(List).use(Popup).use(Toast).use(Lazyload).use(Col).use(Row).use(Tab).use(Tabs).use(Divider).use(Dialog).use(Loading).use(Popover).use(RadioGroup).use(Radio).use(Uploader).use(Collapse).use(CollapseItem).use(Cascader).use(Field)
vantLocales(i18n.locale)

// eslint-disable-next-line no-new
new Vue({
  el: '#root',
  store,
  router,
  i18n,
  render: h => h(App)
})
