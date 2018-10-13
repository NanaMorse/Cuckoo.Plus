import * as api from '@/api'

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

const statuses = {
  async updateFavouriteStatusById ({ commit }, { favourited, mainStatusId, targetStatusId }) {
    try {

      if (favourited) {
        api.statuses.favouriteStatusById(targetStatusId)
      } else {
        api.statuses.unFavouriteStatusById(targetStatusId)
      }

      commit('updateFavouriteStatusById', { favourited, mainStatusId, targetStatusId })
    } catch (e) {
      throw new Error(e)
    }
  },

  async updateContextData ({ commit }, statusId) {
    if (!statusId) throw new Error('unknown status id!')

    try {
      const result = await api.statuses.getStatusContextById(statusId)
      commit('updateContextData', { statusId, context: result.data })
    } catch (e) {

    }
  }
}

const actions = {
  ...timelines,
  ...statuses
}

export default actions