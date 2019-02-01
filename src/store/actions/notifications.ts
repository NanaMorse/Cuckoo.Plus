import * as api from '@/api'
import { NotificationTypes } from '@/constant'
import { mastodonentities } from "@/interface"

const notifications = {

  async updateNotifications ({ commit, state, dispatch }, { isLoadMore, isFetchMore } = {
    isLoadMore: false,
    isFetchMore: false
  }) {

    const notifications: Array<mastodonentities.Notification> = state.notifications

    let maxId, sinceId
    if (isLoadMore) {
      maxId = notifications[notifications.length - 1].id
    } else if (isFetchMore) {
      sinceId = notifications[0] ? notifications[0].id : null
    }

    let mutationName = ''
    if (!isLoadMore && !isFetchMore) mutationName = 'pushNotifications'
    if (isLoadMore && !isFetchMore) mutationName = 'pushNotifications'
    if (!isLoadMore && isFetchMore) mutationName = 'unShiftNotification'

    try {
      const result = await api.notifications.getNotifications({ max_id: maxId, since_id: sinceId })

      commit(mutationName, result.data)

      const followNotifications: Array<mastodonentities.Notification> = result.data.filter(notification => notification.type === NotificationTypes.FOLLOW)

      if (followNotifications.length) {
        dispatch('updateRelationships', { idList: followNotifications.map(notification => notification.account.id) })
      }

    } catch (e) {

    }
  }
}

export default notifications
