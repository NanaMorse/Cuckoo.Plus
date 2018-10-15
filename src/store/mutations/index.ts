import Vue from 'vue'
import { cuckoostore, mastodonentities } from '@/interface'

const oAuthInfoMutations = {

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

const timelinesMutations = {
  setTimeLineStatuses (state: cuckoostore.stateInfo, { newStatuses, timeLineType, hashName }) {
    // clear all statuses
    state.timelines[timeLineType].splice(0, state.timelines[timeLineType].length)

    state.timelines[timeLineType].push(...newStatuses)
  },

  pushTimeLineStatuses (state: cuckoostore.stateInfo, { newStatuses, timeLineType, hashName }) {
    state.timelines[timeLineType].push(...newStatuses)
  },

  unShiftTimeLineStatuses (state: cuckoostore.stateInfo, { newStatuses, timeLineType, hashName }) {
    state.timelines[timeLineType].unshift(...newStatuses)
  }
}

const statusesMutations = {
  updateStatusInfo (state: cuckoostore.stateInfo, newStatus: mastodonentities.Status) {
    // get all status list
    Object.keys(state.timelines).forEach(timeLineType => {
      const currentTimeLine = state.timelines[timeLineType]
      const targetStatusIndex = currentTimeLine.findIndex(status => status.id === newStatus.id)
      if (targetStatusIndex !== -1) {
        Vue.set(currentTimeLine, targetStatusIndex, newStatus)
      }
    })
  },

  updateFavouriteStatusById (state: cuckoostore.stateInfo, { favourited, mainStatusId, targetStatusId }) {
    if (mainStatusId === targetStatusId) {
      Object.keys(state.timelines).forEach(timeLineType => {
        const currentTimeLine = state.timelines[timeLineType]
        const targetStatus = currentTimeLine.find(status => status.id === mainStatusId)
        if (targetStatus) {
          Vue.set(targetStatus, 'favourited', favourited)
          Vue.set(targetStatus, 'favourites_count', favourited ? targetStatus.favourites_count + 1 : targetStatus.favourites_count -1)
        }
      })
    } else {
      state.contexts[mainStatusId].descendants.forEach(status => {
        if (status.id === targetStatusId) {
          Vue.set(status, 'favourited', favourited)
          Vue.set(status, 'favourites_count', favourited ? status.favourites_count + 1 : status.favourites_count -1)
        }
      })
    }
  }
}

const appStatusMutations = {
  updateIsDrawerOpened (state: cuckoostore.stateInfo, isDrawerOpened: boolean) {
    state.appStatus.isDrawerOpened = isDrawerOpened
  }
}

const mutations = {
  updateMastodonServerUri (state: cuckoostore.stateInfo, mastodonServerUri: string) {
    state.mastodonServerUri = mastodonServerUri

    localStorage.setItem('mastodonServerUri', mastodonServerUri)
  },

  updateCurrentUserAccount (state: cuckoostore.stateInfo, currentUserAccount) {
    state.currentUserAccount = currentUserAccount
  },

  updateContextData (state: cuckoostore.stateInfo, { statusId, context }) {
    Vue.set(state.contexts, statusId, context)
  },

  ...oAuthInfoMutations,
  ...timelinesMutations,
  ...statusesMutations,
  ...appStatusMutations,
}

export default mutations
