import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import { cuckoostore } from '@/interface'
import { UiWidthCheckConstants, ThemeNames } from '@/constant'

Vue.use(Vuex)

const state: cuckoostore.stateInfo = {

  OAuthInfo: {
    // todo encode
    clientId: localStorage.getItem('clientId') || '',
    clientSecret: localStorage.getItem('clientSecret') || '',
    accessToken: localStorage.getItem('accessToken') || '',
    code: localStorage.getItem('code') || ''
  },

  mastodonServerUri: localStorage.getItem('mastodonServerUri') || '',

  currentUserAccount: null,

  timelines: {
    home: [],
    public: [],
    direct: [],
    // todo should save hash names to local
    tag: {},
    list: {}
  },

  contextMap: {},

  statusMap: {},

  appStatus: {
    documentWidth: document.body.clientWidth,
    isDrawerOpened: document.body.clientWidth > UiWidthCheckConstants.DRAWER_DOCKING_BOUNDARY,
    isNotificationsPanelOpened: false,
    settings: {
      multiWaterFallLayout: true
    }
  },

  notifications: [],
    
  theme: localStorage.getItem('theme') || ThemeNames.GOOGLE_PLUS
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
