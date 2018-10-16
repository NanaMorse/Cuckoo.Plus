import { cuckoostore, mastodonentities } from '@/interface'
import { isBaseTimeLine } from '@/util'

const accounts = {
  getAccountDisplayName () {
    return (account: mastodonentities.Account) => account.display_name || account.username || account.acct
  }
}

const timelines = {
  getRootStatuses (state: cuckoostore.stateInfo) {
    return (timeLineType: string, hashName?: string): Array<mastodonentities.Status> => {
      const targetStatuses = isBaseTimeLine(timeLineType) ? state.timelines[timeLineType] :
        state.timelines[timeLineType][hashName]

      // todo avoid this situation
      if (!targetStatuses) return []

      return targetStatuses.filter((status: mastodonentities.Status) => !status.in_reply_to_id)
    }
  }
}

const getters = {
  ...accounts,
  ...timelines
}

export default getters
