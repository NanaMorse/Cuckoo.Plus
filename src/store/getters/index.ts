import { cuckoostore, mastodonentities } from '@/interface'
import { isBaseTimeLine } from '@/util'
import { UiWidthCheckConstants } from '@/constant'

const accounts = {
  getAccountDisplayName () {
    return (account: mastodonentities.Account) => account.display_name || account.username || account.acct
  },

  getAccountAtName () {
    return (account: mastodonentities.Account) => account.username || account.acct
  }
}

const timelines = {
  getRootStatuses (state: cuckoostore.stateInfo) {
    return (timeLineType: string, hashName?: string): Array<mastodonentities.Status> => {
      const targetStatusIdList = isBaseTimeLine(timeLineType) ? state.timelines[timeLineType] :
        state.timelines[timeLineType][hashName]

      // todo avoid this situation
      if (!targetStatusIdList) return []

      return targetStatusIdList
        .map(statusId => state.statusMap[statusId]).filter(status => status)
        .filter((status: mastodonentities.Status) => !status.in_reply_to_id)
        .filter(status => {
          const muteStatusList = state.appStatus.settings.muteMap.statusList
          return muteStatusList.indexOf(status.id) === -1
        })
    }
  }
}

const getters = {
  ...accounts,
  ...timelines,

  isOAuthUser (state: cuckoostore.stateInfo) {
    return state.OAuthInfo.accessToken
  },

  isMobileMode (state: cuckoostore.stateInfo) {
    return state.appStatus.documentWidth < UiWidthCheckConstants.DRAWER_DOCKING_BOUNDARY
  },

  shouldDialogFullScreen (state: cuckoostore.stateInfo) {
    return state.appStatus.documentWidth <= UiWidthCheckConstants.POST_STATUS_DIALOG_TOGGLE_WIDTH
  }
}

export default getters
