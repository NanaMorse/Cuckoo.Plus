import * as Api from '@/api'
import statuses from './statuses'
import timelines from './timelines'
import notifications from './notifications'
import appstatus from './appstatus'
import relationships from './relationships'
import accounts from './accounts'
import { mastodonentities } from "@/interface"

const actions = {
  ...timelines,
  ...statuses,
  ...notifications,
  ...appstatus,
  ...relationships,
  ...accounts,

  async updateCurrentUserAccount ({ commit }) {
    try {
      const result = await Api.accounts.fetchCurrentUserAccountInfo()

      const accountInfo: mastodonentities.AuthenticatedAccount = result.data

      commit('updateCurrentUserAccount', accountInfo)
      commit('updateAccountMap', { [accountInfo.id]: accountInfo })

      // sync settings
      commit('updatePostPrivacy', accountInfo.source.privacy)
      commit('updatePostMediaAsSensitiveMode', accountInfo.source.sensitive)
    } catch (e) {

    }
  },

  async updateCustomEmojis ({ commit }) {
    try {
      const result = await Api.instances.getCustomEmojis()
      commit('updateCustomEmojis', result.data)
    } catch (e) {

    }
  }
}

export default actions
