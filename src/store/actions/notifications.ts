import * as api from '@/api'

const notifications = {
  async fetchNotifications ({ commit }) {
    try {
      const result = await api.notifications.fetchNotifications({})
      commit('appendNotifications', result.data)
    } catch (e) {
      throw new Error(e)
    }
  },

  async refreshNotifications ({ commit, state }) {
    const sinceId = state.notifications[0].id
    try {
      const result = await api.notifications.fetchNotifications({ since_id: sinceId })
      commit('prependNotification', result.data)
    } catch (e) {
      throw new Error(e)
    }
  }
}

export default notifications