import * as api from '@/api'
import statuses from './statuses'

const timelines = {
  async updateTimeLineStatuses ({ commit }, { timeLineType, maxId, sinceId }) {
    maxId = ''; sinceId = ''

    if (!timeLineType) throw new Error('set time line type!')

    try {
      const result = await api.timelines.getTimeLineStatuses({ timeLineType, maxId, sinceId })

      if (!maxId && !sinceId) {
        return commit('setTimeLineStatuses', { newStatuses: result.data, timeLineType })
      }

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