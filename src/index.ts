import Vue from 'vue'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import VueResource from 'vue-resource'
import VueI18n from 'vue-i18n'
import store from './store'
import router from './router'
import App from './App.vue'

import i18nMessages from './i18n'
import { I18nTags, I18nLocales, RoutersInfo } from '@/constant/common'

Vue.use({
  install (Vue) {
    Vue.prototype.$i18nTags = I18nTags;
    Vue.prototype.$routersInfo = RoutersInfo;
  }
})

Vue.use(MuseUI)
Vue.use(VueResource)
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: I18nLocales.EN,
  messages: i18nMessages
});

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render(h) {
    return h(App)
  }
});
