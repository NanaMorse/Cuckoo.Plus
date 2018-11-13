import { getTargetStatusesList } from '@/util'

const appStatus = {
  loadStreamStatusesPool ({ commit, state }, { timeLineType, hashName }) {
    const targetStreamPool = getTargetStatusesList(state.appStatus.streamStatusesPool, timeLineType, hashName)

    commit('unShiftTimeLineStatuses', {
      newStatusIdList: targetStreamPool.filter(id => state.statusMap[id]),
      timeLineType, hashName
    })

    commit('clearStreamStatusesPool', { timeLineType, hashName })
  }
}

export default appStatus