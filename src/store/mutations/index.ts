import Vue from 'vue'
import timelinesMutations from './timelines'
import { isBaseTimeLine } from '@/util'
import { TimeLineTypes } from '@/constant'
import { cuckoostore, mastodonentities } from '@/interface'

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

function getAllTimeLineList (state: cuckoostore.stateInfo): Array<Array<mastodonentities.Status>> {
  const result = [];

  // get base timeline
  [TimeLineTypes.PUBLIC, TimeLineTypes.HOME].forEach(timeLineType => {
    result.push(state.timelines[timeLineType])
  });

  // get sub timeline
  [TimeLineTypes.TAG, TimeLineTypes.LIST].forEach(timeLineType => {
    const currentSubTimeLineMap = state.timelines[timeLineType]
    Object.keys(currentSubTimeLineMap).forEach(hashName => {
      result.push(currentSubTimeLineMap[hashName] || [])
    })
  });

  return result
}

const statusesMutations = {
  // updateStatusInfo (state: cuckoostore.stateInfo, newStatus: mastodonentities.Status) {
  //   getAllTimeLineList(state).forEach(timeLine => {
  //     const targetStatusIndex = timeLine.findIndex(status => status.id === newStatus.id)
  //     if (targetStatusIndex !== -1) {
  //       Vue.set(timeLine, targetStatusIndex, newStatus)
  //     }
  //   })
  // },

  updateFavouriteStatusById (state: cuckoostore.stateInfo, { favourited, mainStatusId, targetStatusId }) {
    if (mainStatusId === targetStatusId) {
      getAllTimeLineList(state).forEach(timeLine => {
        const targetStatus = timeLine.find(status => status.id === mainStatusId)
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
  updateDrawerOpenStatus (state: cuckoostore.stateInfo, isDrawerOpened: boolean) {
    state.appStatus.isDrawerOpened = isDrawerOpened
  },

  updateDocumentWidth (state: cuckoostore.stateInfo) {
    state.appStatus.documentWidth = document.body.clientWidth
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
