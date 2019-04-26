import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { I18nLocales } from '@/constant'
import store from '@/store'

import EN from './en'
import DE from './de'
import JA from './ja'
import ZH_CN from './zh-cn'
import ZH_HK from './zh-hk'
import ZH_TW from './zh-tw'

Vue.use(VueI18n)

const currentLocale = store.state.appStatus.settings.locale

const i18nMessages = {
  [I18nLocales.EN]: EN,
  [I18nLocales.DE]: de,
  [I18nLocales.JA]: JA,
  [I18nLocales.ZH_CN]: ZH_CN,
  [I18nLocales.ZH_HK]: ZH_HK,
  [I18nLocales.ZH_TW]: ZH_TW
}

export default new VueI18n({
  locale: currentLocale,
  messages: i18nMessages,
  fallbackLocale: I18nLocales.EN
})
