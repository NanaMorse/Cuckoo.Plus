import * as api from '@/api'
import { mastodonentities } from '@/interface'
import { isBaseTimeLine } from '@/util'
const Toast = require('muse-ui-toast').default

export default {
  async updateTimeLineStatuses ({ commit, dispatch, state }, { timeLineType, hashName, isLoadMore, isFetchMore }: {
    timeLineType: string
    hashName?: string
    isLoadMore?: boolean
    isFetchMore?: boolean
  }) {
    if (!timeLineType) throw new Error('set time line type!')

    let targetTimeLineStatuses: Array<mastodonentities.Status>

    if (isBaseTimeLine(timeLineType)) {
      targetTimeLineStatuses = state.timelines[timeLineType]
    } else {
      targetTimeLineStatuses = state.timelines[timeLineType][hashName] || []
    }

    let maxId, sinceId
    if (isLoadMore) {
      maxId = targetTimeLineStatuses[targetTimeLineStatuses.length - 1].id
    } else if (isFetchMore) {
      sinceId = targetTimeLineStatuses[0].id
    }

    let mutationName = ''
    if (!isLoadMore && !isFetchMore) mutationName = 'setTimeLineStatuses'
    if (isLoadMore && !isFetchMore) mutationName = 'pushTimeLineStatuses'
    if (!isLoadMore && isFetchMore) mutationName = 'unShiftTimeLineStatuses'

    try {
      const result = await api.timelines.getTimeLineStatuses({ timeLineType, hashName, maxId, sinceId })

      Promise.all(result.data.map((status: mastodonentities.Status) => {
        return api.statuses.getStatusContextById(status.id)
      })).then(results => {
        const newContextMap = {}
        results.forEach((contextResult, index) => {
          newContextMap[result.data[index].id] = contextResult.data
        })
        commit('updateContextData', newContextMap)
      })

      commit(mutationName, { newStatuses: result.data, timeLineType, hashName })

      return result
    } catch (e) {
      throw new Error(e)
    }
  }
}
