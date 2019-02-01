<template>
  <div class="notification-panel-container base-theme-bg-color" :style="isLoadingTargetStatus ? { overflow: 'hidden' } : null">

    <keep-alive>
      <div class="notification-list" v-show="!shouldShowTargetStatus">
        <mu-load-more loading-text="" @load="loadNotifications(true)" :loading="isLoadingNotifications" v-loading="isLoadingTargetStatus">
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

          <mu-list textline="three-line">
            <mu-list-item :style="notificationCardStyle" class="notification-card dialog-theme-bg-color"
                          v-for="(notification, index) in notifications" :key="index" avatar>
              <mu-list-item-action>
                <mu-avatar class="user-avatar" @click="onCheckUserAccountPage(notification.account)">
                  <img :src="notification.account.avatar_static" />
                </mu-avatar>
              </mu-list-item-action>
              <mu-list-item-content>
                <mu-list-item-title class="user-display-name primary-read-text-color"
                                    v-html="getAccountDisplayName(notification.account)"
                                    @click="onCheckUserAccountPage(notification.account)" />
                <mu-list-item-sub-title class="notification-content primary-read-text-color"
                                        v-html="getNotificationSubTitle(notification)"
                                        @click="onNotificationCardClick(notification)" />
              </mu-list-item-content>
              <mu-list-item-action v-if="shouldShowFollowingBtn(notification)">
                <mu-icon @click="onFollowingAccount(notification.account.id)" class="follow-action" value="person_add" />
              </mu-list-item-action>
            </mu-list-item>
          </mu-list>

        </mu-load-more>
      </div>
    </keep-alive>

    <div v-if="shouldShowTargetStatus" class="notification-status-check-area">
      <mu-appbar color="secondary">
        <mu-button slot="left" icon @click="shouldShowTargetStatus = false">
          <mu-icon value="arrow_back" />
        </mu-button>
      </mu-appbar>
      <div class="notification-status-card-container">
        <status-card class="status-card-container" v-if="currentCheckStatus" :status="currentCheckStatus"/>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import { State, Action, Getter } from 'vuex-class'
  import { NotificationTypes, ThemeNames } from '@/constant'
  import StatusCard from '@/components/StatusCard'
  import { mastodonentities } from '@/interface'
  import { prepareRootStatus, formatHtml } from "@/util"

  @Component({
    components: {
      'status-card': StatusCard,
    }
  })
  class Notifications extends Vue {

    $progress

    $t

    $i18nTags

    @Prop() hideHeader: boolean

    @Action('followAccountById') followAccountById

    @Action('updateNotifications') updateNotifications

    @State('appStatus') appStatus

    @State('notifications') notifications: Array<mastodonentities.Notification>

    @State('relationships') relationships: {
      [id: string]: mastodonentities.Relationship
    }

    @Getter('getAccountDisplayName') getAccountDisplayName

    isLoadingNotifications: boolean = false

    isLoadingTargetStatus: boolean = false

    shouldShowTargetStatus: boolean = false

    NotificationTypes = NotificationTypes

    currentCheckStatus: mastodonentities.Status = null

    @Watch('isLoadingNotifications')
    onLoadingNotificationStatusChanged (toValue) {
      toValue ? this.$progress.start() : this.$progress.done()
    }

    @Watch('shouldShowTargetStatus')
    onShouldShowTargetStatusChanged (val) {
      this.$emit('shouldShowTargetStatusChanged', val)
    }

    onCheckUserAccountPage (account: mastodonentities.Account) {
      window.open(account.url, "_blank")
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
      switch (notification.type) {
        case NotificationTypes.FOLLOW: {
          return this.$t(this.$i18nTags.notifications.someone_followed_you, {
            displayName: this.getAccountDisplayName(notification.account)
          })
        }

        case NotificationTypes.FAVOURITE:
        case NotificationTypes.REBLOG: {
          return notification.type + ": " + formatHtml(notification.status.content)
        }

        case NotificationTypes.MENTION: {
          return formatHtml(notification.status.content)
        }
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
        if (notification.type === NotificationTypes.FOLLOW) {
          window.open(notification.account.url, "_blank")
        }
      } else {
        this.isLoadingTargetStatus = true

        const targetStatus = await prepareRootStatus(notification.status)

        this.isLoadingTargetStatus = false

        this.currentCheckStatus = targetStatus

        this.shouldShowTargetStatus = true
      }
    }

    shouldShowFollowingBtn (notification: mastodonentities.Notification) {
      const isFollowingNotification = notification.type === NotificationTypes.FOLLOW
      const isAccountStatusUnFollow = this.relationships[notification.account.id] && !this.relationships[notification.account.id].following
      return isFollowingNotification && isAccountStatusUnFollow
    }

    async onFollowingAccount (id: string) {
      this.followAccountById(id)
    }

    async onUnFollowingAccount () {

    }

  }

  export default Notifications
</script>

<style lang="less" scoped>
  .notification-panel-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    position: relative;

    .notification-list {
      padding: 8px;
      height: calc(100vh - 56px);

      .notification-card {
        margin: 2px 0;
        box-shadow: 0 1px 2px rgba(0,0,0,.2);
        border-radius: 3px;

        .user-avatar {
          cursor: pointer;
        }

        .user-display-name {
          display: inline;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }

        .notification-content {
          cursor: pointer;
        }

        .follow-action {
          cursor: pointer;
        }
      }
    }

    .notification-status-check-area {
      height: 100%;

      .notification-status-card-container {
        height: calc(100% - 56px);
        padding-top: 8px;

        .status-card-container {
          height: 100%;
        }
      }
    }
  }
</style>

<style lang="less">
  .notification-panel-container {
    .notification-list {

      .mu-item-wrapper.hover {
        background-color: inherit !important;
        cursor: default;
      }

      .notification-content {
        > p { display: inline }
        .h-card:hover { text-decoration: underline }
      }

      .mu-item-sub-title {
        p { margin: 0 }
      }

      .mu-avatar {
        margin: 0;
      }
    }
  }
</style>
