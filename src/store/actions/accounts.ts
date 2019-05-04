import * as Api from '@/api'
import { mastodonentities } from "@/interface"

const accounts = {
  async fetchAccountInfoById ({ commit }, id: string) {
    try {
      const result = await Api.accounts.fetchAccountInfoById(id)
      commit('updateAccountMap', { [result.data.id]: result.data })
    } catch (e) {

    }
  },

  async followAccountById ({ commit }, id: string) {
    try {
      const result = await Api.accounts.followAccountById(id)
      commit('updateRelationships', { [result.data.id]: result.data })
    } catch (e) {

    }
  },

  async unFollowAccountById ({ commit }, id: string) {
    try {
      const result = await Api.accounts.unFollowAccountById(id)
      commit('updateRelationships', { [result.data.id]: result.data })
    } catch (e) {

    }
  }
}

export default accounts
