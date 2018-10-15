import * as api from '@/api'
import statuses from './statuses'

const timelines = {
  async updateTimeLineStatuses ({ commit, state }, { timeLineType, hashName, isLoadMore, isFetchMore }: {
    timeLineType: string
    hashName?: string
    isLoadMore?: boolean
    isFetchMore?: boolean
  }) {
    if (!timeLineType) throw new Error('set time line type!')

    try {
      // ensure target timeline array exists


      const targetTimeLineStatuses = state.timelines[timeLineType]

      let maxId, sinceId
      if (isLoadMore) {
        maxId = targetTimeLineStatuses[targetTimeLineStatuses.length - 1].id
      } else if (isFetchMore) {
        sinceId = targetTimeLineStatuses[0].id
      }

      const result = await api.timelines.getTimeLineStatuses({ timeLineType, maxId, sinceId })

      let mutationName = ''

      if (!isLoadMore && !isFetchMore) mutationName = 'setTimeLineStatuses'
      if (isLoadMore && !isFetchMore) mutationName = 'pushTimeLineStatuses'
      if (!isLoadMore && isFetchMore) mutationName = 'unShiftTimeLineStatuses'

      commit(mutationName, { newStatuses: result.data, timeLineType })

      return result
    } catch (e) {
      throw new Error(e)
    }
  }
}

const actions = {
  ...timelines,
  ...statuses
}

export default actions
