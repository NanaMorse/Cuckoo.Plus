import Vue from 'vue'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import VueResource from 'vue-resource'
import VueI18n from 'vue-i18n'
const Toast = require('muse-ui-toast').default
import store from './store'
import router from './router'
import App from './App.vue'
import * as moment from 'moment'

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
Vue.use(Toast)

const currentLocale = I18nLocales.ZH_CN

const i18n = new VueI18n({
  locale: currentLocale,
  messages: i18nMessages
});

moment.locale(currentLocale)

const httpInterceptor: any = (request) => {
  request.headers.set('Authorization', `Bearer ${store.state.OAuthInfo.accessToken}`);
}

Vue.http.interceptors.push(httpInterceptor)

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render(h) {
    return h(App)
  }
});
