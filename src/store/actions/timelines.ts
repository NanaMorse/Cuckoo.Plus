import * as api from '@/api'
import { mastodonentities } from '@/interface'
import { isBaseTimeLine, isContentStatusForExperimentalReBlog } from '@/util'
import { TimeLineTypes, VisibilityTypes } from '@/constant'

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

      const reblogMainStatusIdList = []

      const statusIdListToShow = result.data.filter((status: mastodonentities.Status) => {
        // remove for some instance's replies_count has bug
        if (isContentStatusForExperimentalReBlog(state.currentUserAccount, status)) {
          reblogMainStatusIdList.push(status.in_reply_to_id)
          return true
        }

        return !status.in_reply_to_id
      }).map(status => status.id)

      const resultToFetchContext = [...statusIdListToShow, ...reblogMainStatusIdList]

      // update context map
      // optimize only home time line's result should check context
      if (timeLineType === TimeLineTypes.HOME) {
        Promise.all(resultToFetchContext.map((statusId) => {
          return api.statuses.getStatusContextById(statusId)
        })).then(results => {
          const newContextMap = {}
          const newStatusMap = {}
          results.forEach((contextResult, index) => {
            const descendantIdList = contextResult.data.descendants.map(status => status.id)

            // only record descendant here
            if (descendantIdList.length) {
              newContextMap[resultToFetchContext[index]] = {
                ancestors: contextResult.data.ancestors.map(status => status.id),
                descendants: descendantIdList
              }
            }

            contextResult.data.ancestors.forEach(status => newStatusMap[status.id] = status)
            contextResult.data.descendants.forEach(status => newStatusMap[status.id] = status)
          })

          Object.keys(newContextMap).length && commit('updateContextMap', newContextMap)
          // also update status map
          Object.keys(newStatusMap).length && commit('updateStatusMap', newStatusMap)
        })
      }

      // update status map
      const newStatusMap = {}
      result.data.forEach(status => newStatusMap[status.id] = status)
      Promise.all(reblogMainStatusIdList.map(statusId => {
        return api.statuses.getStatusById(statusId)
      })).then(results => {
        results.forEach(result => newStatusMap[result.data.id] = result.data)
        commit('updateStatusMap', newStatusMap)
        commit(mutationName, { newStatusIdList: [...statusIdListToShow], timeLineType, hashName })
      })

      return result
    } catch (e) {
      throw e
    }
  }
}
