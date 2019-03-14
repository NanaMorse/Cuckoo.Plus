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
        // update status info
        store.dispatch('fetchStatusById', newNotification.status.id)

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
    // account's display name have been formatted
    return store.getters['getAccountDisplayName'](newNotification.account)
      .replace('<span>', '').replace('</span>', '')
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

  private localStreamWs: WebSocket

  private publicStreamWs: WebSocket

  private createWsUrl (streamName: string) {
    return `wss://${new URL(store.state.mastodonServerUri).hostname}/api/v1/streaming/?stream=${streamName}&access_token=${store.state.OAuthInfo.accessToken}`
  }

  public openUserConnection () {
    const wsUrl = this.createWsUrl('user')

    this.userStreamWs = new WebSocket(wsUrl)

    this.initEventListener(this.userStreamWs, TimeLineTypes.HOME)
  }

  public openLocalConnection () {
    const wsUrl = this.createWsUrl('public:local')

    this.localStreamWs = new WebSocket(wsUrl)

    this.initEventListener(this.localStreamWs, TimeLineTypes.LOCAL)
  }

  public openPublicConnection () {
    const wsUrl = this.createWsUrl('public')

    this.publicStreamWs = new WebSocket(wsUrl)

    this.initEventListener(this.publicStreamWs, TimeLineTypes.PUBLIC)
  }

  public closeConnection (timeLineType: string) {
    const typeToWsMap = {
      [TimeLineTypes.HOME]: this.userStreamWs,
      [TimeLineTypes.LOCAL]: this.localStreamWs,
      [TimeLineTypes.PUBLIC]: this.publicStreamWs
    }

    typeToWsMap[timeLineType].close()
  }

  private initEventListener (targetWs: WebSocket, timeLineType, hashName?) {
    targetWs.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data)

      switch (parsedMessage.event) {
        case StreamingEventTypes.UPDATE : {
          return this.updateStatus(JSON.parse(parsedMessage.payload), timeLineType, hashName)
        }

        case StreamingEventTypes.DELETE : {
          return this.deleteStatus(parsedMessage.payload)
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
    if (timeLineType === TimeLineTypes.HOME) {
      prepareRootStatus(newStatus)
    }

    // update target timeline list
    const targetMutationName = store.state.appStatus.settings.realTimeLoadStatusMode ? 'unShiftTimeLineStatuses' : 'unShiftStreamStatusesPool'
    store.commit(targetMutationName, {
      newStatusIdList: [newStatus.id],
      timeLineType, hashName
    })

  }

  private deleteStatus (statusId: string) {
    if (!store.state.statusMap[statusId]) return

    // remove from time line
    store.commit('deleteStatusFromTimeLine', statusId)

    // remove from status map
    store.commit('removeStatusFromStatusMapById', statusId)
  }

  private emitNotification (newNotification: mastodonentities.Notification) {
    // update notification list
    store.commit('unShiftNotification', [newNotification])

    if (newNotification.type === NotificationTypes.FOLLOW) {
      store.dispatch('updateRelationships', { idList: [newNotification.account.id] })
    }

    // set notification icon unread
    store.commit('updateUnreadNotificationCount', store.state.appStatus.unreadNotificationCount + 1)

    // send browser notification
    // @ts-ignore
    if (window.Notification) {
      notificationHandler.emit(newNotification)
    }
  }

}

export default new Streaming()
