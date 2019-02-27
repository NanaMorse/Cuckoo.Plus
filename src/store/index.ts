import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import { cuckoostore } from '@/interface'
import { UiWidthCheckConstants, ThemeNames, I18nLocales } from '@/constant'

Vue.use(Vuex)

function getLocalSetting (tag, defaultValue) {
  return localStorage.getItem(tag) ? JSON.parse(localStorage.getItem(tag)) : defaultValue
}

const state: cuckoostore.stateInfo = {

  OAuthInfo: {
    // todo encode
    clientId: localStorage.getItem('clientId') || '',
    clientSecret: localStorage.getItem('clientSecret') || '',
    accessToken: localStorage.getItem('accessToken') || '',
    code: localStorage.getItem('code') || ''
  },

  mastodonServerUri: localStorage.getItem('mastodonServerUri') || '',

  currentUserAccount: getLocalSetting('currentUserAccount', null),

  timelines: {
    home: [],
    public: [],
    direct: [],
    local: [],
    tag: {},
    list: {}
  },

  contextMap: {},

  statusMap: {},

  customEmojis: getLocalSetting('customEmojis', []),

  notifications: [],

  relationships: {},

  appStatus: {
    documentWidth: document.body.clientWidth,

    isDrawerOpened: document.body.clientWidth > UiWidthCheckConstants.DRAWER_DOCKING_BOUNDARY,

    isNotificationsPanelOpened: false,

    unreadNotificationCount: 0,

    streamStatusesPool: {
      home: [],
      public: [],
      direct: [],
      local: [],
      tag: {},
      list: {}
    },

    settings: {
      multiLineMode: getLocalSetting('multiLineMode', true),
      showSensitiveContentMode: getLocalSetting('showSensitiveContentMode', false),
      realTimeLoadStatusMode: getLocalSetting('realTimeLoadStatusMode', false),
      theme: localStorage.getItem('theme') || ThemeNames.GOOGLE_PLUS,
      tags: getLocalSetting('tags', ['kimermark']),
      locale: localStorage.getItem('locale') || I18nLocales.EN
    },

  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
