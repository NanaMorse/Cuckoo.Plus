import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

const state: cuckoostore.state = {

  OAuthInfo: {
    clientId: localStorage.getItem('clientId') || '',
    clientSecret: localStorage.getItem('clientSecret') || '',
    accessToken: localStorage.getItem('accessToken') || ''
  },

  mastodonServerUri: ''
}

export default new Vuex.Store({
  state,
  mutations
})
