import store from '@/store'
import { StreamingEventTypes, TimeLineTypes, NotificationTypes, RoutersInfo } from '@/constant'
import { mastodonentities } from "@/interface"
import router from '@/router'
import { extractText, prepareRootStatus } from "@/util"

class NotificationHandler {
  public emit (newNotification: mastodonentities.Notification) {
    switch (newNotification.type) {
      case NotificationTypes.MENTION : {
        return this.emitStatusOperateNotification(newNotification, '提及你')
      }

      case NotificationTypes.REBLOG : {
        return this.emitStatusOperateNotification(newNotification, '转发了你的嘟文')
      }

      case NotificationTypes.FAVOURITE : {
        return this.emitStatusOperateNotification(newNotification, '喜欢了你的嘟文')
      }
    }
  }

  private emitStatusOperateNotification (newNotification: mastodonentities.Notification, operateTypeString) {
    const title = `${this.getFromName(newNotification)} ${operateTypeString}`
    const bodyText = extractText(newNotification.status.content)

    const nativeNotification = new Notification(title, { body: bodyText, icon: this.getImageUrl(newNotification) })

    nativeNotification.addEventListener('click', () => {
      if (store.state.appStatus.unreadNotificationCount > 0) {
        store.commit('updateUnreadNotificationCount', store.state.appStatus.unreadNotificationCount - 1)
      }

      this.routeToTargetStatus(newNotification)
    })
  }

  private getFromName (newNotification: mastodonentities.Notification): string {
    return store.getters['getAccountDisplayName'](newNotification.account)
  }

  private getImageUrl (newNotification: mastodonentities.Notification): string {
    return newNotification.account.avatar_static
  }

  private async routeToTargetStatus (newNotification: mastodonentities.Notification) {
    const targetStatus = await prepareRootStatus(newNotification.status)

    router.push({
      name: RoutersInfo.statuses.name,
      params: {
        statusId: targetStatus.id
      }
    })
  }

  private routeToTargetAccount () {

  }
}

const notificationHandler = new NotificationHandler()

class Streaming {

  private userStreamWs: WebSocket

  public openUserConnection () {
    const wsUrl = `wss://${new URL(store.state.mastodonServerUri).hostname}/api/v1/streaming/?stream=user&access_token=${store.state.OAuthInfo.accessToken}`

    this.userStreamWs = new WebSocket(wsUrl)

    this.initEventListener(this.userStreamWs, TimeLineTypes.HOME)
  }

  private initEventListener (targetWs: WebSocket, timeLineType, hashName?) {
    targetWs.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data)

      switch (parsedMessage.event) {
        case StreamingEventTypes.UPDATE : {
          return this.updateStatus(JSON.parse(parsedMessage.payload), timeLineType, hashName)
        }

        case StreamingEventTypes.DELETE : {
          return this.deleteStatus(JSON.parse(parsedMessage.payload), timeLineType, hashName)
        }

        case StreamingEventTypes.NOTIFICATION : {
          return this.emitNotification(JSON.parse(parsedMessage.payload))
        }
      }
    }
  }

  private updateStatus (newStatus: mastodonentities.Status, timeLineType, hashName?) {

    if (store.state.statusMap[newStatus.id]) return

    // update status map
    store.commit('updateStatusMap', { [newStatus.id]: newStatus })

    prepareRootStatus(newStatus)

    // update target timeline list
    store.commit('unShiftTimeLineStatuses', {
      newStatusIdList: [newStatus.id],
      timeLineType, hashName
    })

  }

  private deleteStatus (newStatus: mastodonentities.Status, timeLineType, hashName?) {

  }

  private emitNotification (newNotification: mastodonentities.Notification) {
    // update notification list
    store.commit('unShiftNotification', [newNotification])

    // set notification icon unread
    store.commit('updateUnreadNotificationCount', store.state.appStatus.unreadNotificationCount + 1)

    // send browser notification
    notificationHandler.emit(newNotification)
  }

}

export default new Streaming()