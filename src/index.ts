const Toast = require('muse-ui-toast').default
const Message = require('muse-ui-message').default
const Loading = require('muse-ui-loading').default
const NProgress = require('muse-ui-progress').default
import Vue from 'vue'
import MuseUI from 'muse-ui'
import 'muse-ui-loading/dist/muse-ui-loading.css'
import 'muse-ui-progress/dist/muse-ui-progress.css'
import VueResource from 'vue-resource'
import VueI18n from 'vue-i18n'
import store from './store'
import router from './router'
import App from './App.vue'
import * as moment from 'moment'
import i18nMessages from './i18n'
import { I18nTags, RoutersInfo, I18nLocales } from '@/constant'
import ThemeManager from '@/themes'
import './directives'

Vue.use({
  install (Vue) {
    Vue.prototype.$i18nTags = I18nTags;
    Vue.prototype.$routersInfo = RoutersInfo;
  }
})

Vue.use(MuseUI)
Vue.use(VueResource)
Vue.use(VueI18n)
Vue.use(Toast, {
  position: 'bottom-start'
})
Vue.use(Message)
Vue.use(NProgress, {
  color: 'primary',
  zIndex: 9999999999,
})
Vue.use(Loading, {
  overlayColor: 'hsla(0,0%,100%,.9)',
  size: 48,
  color: 'primary',
})

const currentLocale = store.state.appStatus.settings.locale

const i18n = new VueI18n({
  locale: currentLocale,
  messages: i18nMessages,
  fallbackLocale: I18nLocales.EN
});

moment.locale(currentLocale)

const httpInterceptor: any = (request) => {
  request.headers.set('Authorization', `Bearer ${store.state.OAuthInfo.accessToken}`);
}

Vue.http.interceptors.push(httpInterceptor)

// @ts-ignore
if (window.Notification) {
  Notification.requestPermission()
}

ThemeManager.setTheme(store.state.appStatus.settings.theme)

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js')
// }

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render(h) {
    return h(App)
  }
});
