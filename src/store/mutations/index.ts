import Vue from 'vue'
import timelinesMutations from './timelines'
import notificationsMutations from './notifications'
import appStatusMutations from './appstatus'
import { cuckoostore } from '@/interface'

const oAuthInfoMutations = {

  clearAllOAuthInfo (state: cuckoostore.stateInfo) {
    state.OAuthInfo.clientId = ''
    state.OAuthInfo.clientSecret = ''
    state.OAuthInfo.code = ''
    state.OAuthInfo.accessToken = ''

    localStorage.clear()
  },

  updateClientInfo (state: cuckoostore.stateInfo, { clientId, clientSecret }) {
    state.OAuthInfo.clientId = clientId
    state.OAuthInfo.clientSecret = clientSecret

    localStorage.setItem('clientId', clientId)
    localStorage.setItem('clientSecret', clientSecret)
  },

  updateOAuthCode (state: cuckoostore.stateInfo, code: string) {
    state.OAuthInfo.code = code

    localStorage.setItem('code', code)
  },

  updateOAuthAccessToken (state: cuckoostore.stateInfo, accessToken: string) {
    state.OAuthInfo.accessToken = accessToken

    localStorage.setItem('accessToken', accessToken)
  }
}

const statusesMutations = {
  updateStatusMap (state: cuckoostore.stateInfo, newStatusMap) {
    Object.keys(newStatusMap).forEach(statusId => {
      Vue.set(state.statusMap, statusId, newStatusMap[statusId])
    })
  },

  removeStatusFromStatusMapById (state: cuckoostore.stateInfo, statusId: string) {
    Vue.set(state.statusMap, statusId, undefined)
  },

  updateFavouriteStatusById (state: cuckoostore.stateInfo, { favourited, targetStatusId, notSelfOperate }) {
    const targetStatus = state.statusMap[targetStatusId]

    if (!targetStatus) return

    if (!notSelfOperate) {
      Vue.set(targetStatus, 'favourited', favourited)
    }

    Vue.set(targetStatus, 'favourites_count', favourited ?
      targetStatus.favourites_count + 1 : targetStatus.favourites_count - 1)
  }
}

const mutations = {
  updateMastodonServerUri (state: cuckoostore.stateInfo, mastodonServerUri: string) {
    state.mastodonServerUri = mastodonServerUri

    localStorage.setItem('mastodonServerUri', mastodonServerUri)
  },

  updateCurrentUserAccount (state: cuckoostore.stateInfo, currentUserAccount) {
    state.currentUserAccount = currentUserAccount

    localStorage.setItem('currentUserAccount', JSON.stringify(currentUserAccount))
  },

  updateContextMap (state: cuckoostore.stateInfo, newContextMap) {
    Object.keys(newContextMap).forEach(statusId => {
      Vue.set(state.contextMap, statusId, newContextMap[statusId])
    })
  },

  ...oAuthInfoMutations,
  ...timelinesMutations,
  ...statusesMutations,
  ...appStatusMutations,
  ...notificationsMutations
}

export default mutations
