import { cuckoostore, mastodonentities } from '@/interface'

const accounts = {
  getAccountDisplayName () {
    return (account: mastodonentities.Account) => account.display_name || account.username || account.acct
  }
}

const timelines = {
  getRootStatuses (state: cuckoostore.stateInfo) {
    return (timeLineType: string): Array<mastodonentities.Status> => state.timelines[timeLineType].filter((status: mastodonentities.Status) => !status.in_reply_to_id)

  }
}

const getters = {
  ...accounts,
  ...timelines
}

export default getters
