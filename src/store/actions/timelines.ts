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

    let targetStatusIdList: Array<string>

    if (isBaseTimeLine(timeLineType)) {
      targetStatusIdList = state.timelines[timeLineType]
    } else {
      targetStatusIdList = state.timelines[timeLineType][hashName] || []
    }

    let maxId, sinceId
    if (isLoadMore) {
      maxId = targetStatusIdList[targetStatusIdList.length - 1]
    } else if (isFetchMore) {
      sinceId = targetStatusIdList[0]
    }

    let mutationName = ''
    if (!isLoadMore && !isFetchMore) mutationName = 'setTimeLineStatuses'
    if (isLoadMore && !isFetchMore) mutationName = 'pushTimeLineStatuses'
    if (!isLoadMore && isFetchMore) mutationName = 'unShiftTimeLineStatuses'

    try {
      const result = await api.timelines.getTimeLineStatuses({ timeLineType, hashName, maxId, sinceId })

      // update context map
      Promise.all(result.data.map((status: mastodonentities.Status) => {
        return api.statuses.getStatusContextById(status.id)
      })).then(results => {
        const newContextMap = {}
        results.forEach((contextResult, index) => {
          newContextMap[result.data[index].id] = contextResult.data
        })
        commit('updateContextMap', newContextMap)
      })

      // update status map
      const newStatusMap = {}
      result.data.forEach(status => newStatusMap[status.id] = status)
      commit('updateStatusMap', newStatusMap)

      commit(mutationName, { newStatusIdList: result.data.map(status => status.id), timeLineType, hashName })

      return result
    } catch (e) {
      throw new Error(e)
    }
  }
}
