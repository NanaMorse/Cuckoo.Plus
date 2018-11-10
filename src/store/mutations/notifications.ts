import { cuckoostore, mastodonentities } from '@/interface'

export default {
  unShiftNotification (state: cuckoostore.stateInfo, newNotifications: Array<mastodonentities.Notification>) {
    state.notifications = newNotifications.concat(state.notifications)
  },

  pushNotifications (state: cuckoostore.stateInfo, newNotifications: Array<mastodonentities.Notification>) {
    state.notifications = state.notifications.concat(newNotifications)
  }
}
