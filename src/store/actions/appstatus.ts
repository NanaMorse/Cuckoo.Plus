import { getTargetStatusesList } from '@/util'
import * as Api from '@/api'
import { mastodonentities } from "@/interface"

const appStatus = {
  loadStreamStatusesPool ({ commit, state }, { timeLineType, hashName }) {
    const targetStreamPool = getTargetStatusesList(state.appStatus.streamStatusesPool, timeLineType, hashName)

    commit('unShiftTimeLineStatuses', {
      newStatusIdList: targetStreamPool.filter(id => state.statusMap[id]),
      timeLineType, hashName
    })

    commit('clearStreamStatusesPool', { timeLineType, hashName })
  },

  async updatePostPrivacy ({ commit }, newPrivacy: string) {
    try {
      await Api.accounts.updateUserAccountInfo({ source: { privacy: newPrivacy } })

      commit('updatePostPrivacy', newPrivacy)
    } catch (e) {
      // todo log error
      commit('updatePostPrivacy', newPrivacy)
    }
  },

  async updatePostMediaAsSensitiveMode ({ commit }, newSensitiveMode: boolean) {
    try {
      await Api.accounts.updateUserAccountInfo({ source: { sensitive: newSensitiveMode } })

      commit('updatePostMediaAsSensitiveMode', newSensitiveMode)
    } catch (e) {
      // todo log error
      commit('updatePostMediaAsSensitiveMode', newSensitiveMode)
    }
  }
}

export default appStatus