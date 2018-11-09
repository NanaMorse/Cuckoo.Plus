import * as api from '@/api'

const notifications = {
  async refreshNotifications ({ commit, state }) {
    try {
      let result
      if (state.notifications.length === 0) {
        result = await api.notifications.fetchNotifications({})
      } else {
        const sinceId = state.notifications[0].id
        result = await api.notifications.fetchNotifications({ since_id: sinceId })
      }
      commit('prependNotification', result.data)
    } catch (e) {
      throw new Error(e)
    }
  }
}

export default notifications