import Vue from 'vue'
import timelinesMutations from './timelines'
import notificationsMutations from './notifications'
import appStatusMutations from './appstatus'
import { cuckoostore, mastodonentities } from '@/interface'
import { formatHtml, formatAccountDisplayName } from '@/util'

function formatStatusContent (status: mastodonentities.Status) {
  return formatHtml(status.content, { externalEmojis: status.emojis })
}

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
      // format content
      const newStatus: mastodonentities.Status = newStatusMap[statusId]
      newStatus.content = formatStatusContent(newStatus)

      // format reblog content
      if (newStatus.reblog) newStatus.reblog.content = formatStatusContent(newStatus.reblog)

      // format spoiler text
      if (newStatus.spoiler_text) newStatus.spoiler_text = formatHtml(newStatus.spoiler_text, { externalEmojis: newStatus.emojis })

      // format account display name
      newStatus.account.display_name = formatAccountDisplayName(newStatus.account)

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

  updateCurrentUserAccount (state: cuckoostore.stateInfo, currentUserAccount: mastodonentities.Account) {
    currentUserAccount.display_name = formatAccountDisplayName(currentUserAccount)

    state.currentUserAccount = currentUserAccount

    localStorage.setItem('currentUserAccount', JSON.stringify(currentUserAccount))
  },

  updateCustomEmojis (state: cuckoostore.stateInfo, customEmojis: Array<mastodonentities.Emoji>) {
    state.customEmojis = customEmojis

    localStorage.setItem('customEmojis', JSON.stringify(customEmojis))
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
