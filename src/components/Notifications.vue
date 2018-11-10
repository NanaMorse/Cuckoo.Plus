<template>
  <div class="notification-panel-container base-theme-bg-color">

    <keep-alive>
      <mu-load-more class="notification-list" v-show="!shouldShowTargetStatus" loading-text="" @load="loadNotifications(true)" :loading="isLoadingNotifications">
        <mu-flex v-if="!hideHeader" class="panel-header" calign-items="center">
          <mu-flex justify-content="start" fill>
            <mu-sub-header class="secondary-read-text-color">Notifications</mu-sub-header>
          </mu-flex>
          <mu-flex justify-content="end" fill>
            <mu-button icon @click="loadNotifications(false, true)">
              <mu-icon class="primary-read-text-color" value="refresh" />
            </mu-button>
          </mu-flex>
        </mu-flex>

        <div class="panel-content">
          <mu-card class="notification-card dialog-theme-bg-color" :style="notificationCardStyle"
                   @click="onNotificationCardClick(notification)"
                   v-for="(notification, index) in notifications" :key="index">
            <mu-card-header :title="getAccountDisplayName(notification.account)"
                            :sub-title="getNotificationSubTitle(notification)">
              <mu-avatar slot="avatar">
                <img :src="notification.account.avatar_static">
              </mu-avatar>
            </mu-card-header>
          </mu-card>
        </div>
      </mu-load-more>
    </keep-alive>

    <div v-if="shouldShowTargetStatus" class="notification-status-check-area">
      <mu-appbar color="primary">
        <mu-button slot="left" icon @click="shouldShowTargetStatus = false">
          <mu-icon value="arrow_back" />
        </mu-button>
      </mu-appbar>
      <div class="notification-status-card-container">
        <status-card v-if="currentCheckStatus" :status="currentCheckStatus" :forceShowFullReply="true"/>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import { State, Action, Getter } from 'vuex-class'
  import { NotificationTypes, ThemeNames } from '@/constant'
  import StatusCard from '@/components/StatusCard.vue'
  import { mastodonentities } from '@/interface'
  import { extractText } from "@/util"

  @Component({
    components: {
      'status-card': StatusCard,
    }
  })
  class Notifications extends Vue {

    $progress

    @Prop() hideHeader: boolean

    @Action('updateNotifications') updateNotifications

    @Action('updateContextMap') updateContextMap

    @State('appStatus') appStatus

    @State('contextMap') contextMap

    @State('notifications') notifications: Array<mastodonentities.Notification>

    @State('statusMap') statusMap

    @Getter('getAccountDisplayName') getAccountDisplayName

    isLoadingNotifications: boolean = false

    shouldShowTargetStatus: boolean = false

    currentCheckStatus: mastodonentities.Status = null

    @Watch('isLoadingNotifications')
    onLoadingNotificationStatusChanged (toValue) {
      toValue ? this.$progress.start() : this.$progress.done()
    }

    @Watch('shouldShowTargetStatus')
    onShouldShowTargetStatusChanged (val) {
      this.$emit('shouldShowTargetStatusChanged', val)
    }

    get notificationCardStyle () {
      const themeToStyle = {
        [ThemeNames.GOOGLE_PLUS]: {
          backgroundColor: '#fff'
        },
        [ThemeNames.DARK]: {

        }
      }

      return themeToStyle[this.appStatus.settings.theme]
    }

    getNotificationSubTitle (notification) {
      if (notification.type === NotificationTypes.FOLLOW) {
        return notification.type
      } else {
        return notification.type + ": " + extractText(notification.status.content)
      }
    }

    async loadNotifications (isLoadMore, isFetchMore) {
      if (this.shouldShowTargetStatus) return

      this.isLoadingNotifications = true
      await this.updateNotifications({
        isLoadMore,
        isFetchMore
      })
      this.isLoadingNotifications = false
    }

    async onNotificationCardClick (notification: mastodonentities.Notification) {
      if (!notification.status) {

      } else {
        this.$progress.start()

        if (!this.contextMap[notification.status.id]) {
          await this.updateContextMap(notification.status.id)
        }

        let targetStatus = notification.status

        const targetStatusContext = this.contextMap[notification.status.id]
        if (targetStatusContext.ancestors.length) {
          targetStatus = this.statusMap[targetStatusContext.ancestors[0]]

          if (!this.contextMap[targetStatus.id]) {
            await this.updateContextMap(targetStatus.id)
          }

        }

        this.$progress.done()

        this.currentCheckStatus = targetStatus

        this.shouldShowTargetStatus = true
      }
    }


  }

  export default Notifications
</script>

<style lang="less" scoped>
  .notification-panel-container {
    width: 100%;
    height: calc(100vh - 56px);
    overflow: auto;
    overflow-x: hidden;

    .notification-list {
      padding: 8px;

      .panel-content {

        .notification-card {
          margin: 2px 0;
          box-shadow: 0 1px 2px rgba(0,0,0,.2);
          border-radius: 3px;
          cursor: pointer;
        }
      }
    }

    .notification-status-check-area {
      .notification-status-card-container {
        padding-top: 8px;
      }
    }
  }
</style>
