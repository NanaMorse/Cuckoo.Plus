import { cuckoostore, mastodonentities } from '@/interface'

export default {
  prependNotification (state: cuckoostore.stateInfo, newNotification: mastodonentities.Notification) {
    state.notifications = [newNotification].concat(state.notifications)
  },

  appendNotifications (state: cuckoostore.stateInfo, newNotifications: Array<mastodonentities.Notification>) {
    state.notifications = state.notifications.concat(newNotifications)
  }
}