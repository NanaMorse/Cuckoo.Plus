import { cuckoostore, mastodonentities } from '@/interface'
import { formatAccountDisplayName, formatHtml } from '@/util'

export default {
  unShiftNotification (state: cuckoostore.stateInfo, newNotifications: Array<mastodonentities.Notification>) {
    newNotifications.forEach(notification => {
      if (notification.account) {
        notification.account.display_name = formatAccountDisplayName(notification.account)
      }
      if (notification.status) {
        notification.status.content = formatHtml(notification.status.content, { externalEmojis: notification.status.emojis })
      }
    })
    state.notifications = newNotifications.concat(state.notifications)
  },

  pushNotifications (state: cuckoostore.stateInfo, newNotifications: Array<mastodonentities.Notification>) {
    state.notifications = state.notifications.concat(newNotifications)
  }
}
