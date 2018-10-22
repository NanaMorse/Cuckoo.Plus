import * as api from '@/api'

const notifications = {
  async fetchNotifications ({ commit }) {
    try {
      const result = await api.notifications.fetchNotifications({})
      commit('appendNotifications', result.data)
    } catch (e) {
      throw new Error(e)
    }
  }
}

export default notifications