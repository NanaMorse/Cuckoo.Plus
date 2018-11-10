<template>
  <div class="notification-panel-container base-theme-bg-color">

    <mu-load-more loading-text="">
      <mu-flex v-if="!hideHeader" class="panel-header" calign-items="center">
        <mu-flex justify-content="start" fill>
          <mu-sub-header>Notifications</mu-sub-header>
        </mu-flex>
        <mu-flex justify-content="end" fill>
          <mu-button icon @click="onFetchMoreNotifications">
            <mu-icon value="refresh" />
          </mu-button>
        </mu-flex>
      </mu-flex>

      <div class="panel-content">
        <mu-card class="notification-card dialog-theme-bg-color" :style="notificationCardStyle"
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

  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { State, Action, Getter } from 'vuex-class'
  import { NotificationTypes, ThemeNames } from '@/constant'
  import { mastodonentities } from '@/interface'
  import { extractText } from "@/util"

  @Component({})
  class Notifications extends Vue {

    $progress

    @Prop() hideHeader: boolean

    @Action('updateNotifications') updateNotifications

    @State('appStatus') appStatus

    @State('notifications') notifications: Array<mastodonentities.Notification>

    @Getter('getAccountDisplayName') getAccountDisplayName

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

    async onFetchMoreNotifications() {
      this.$progress.start()
      await this.updateNotifications({
        isFetchMore: true
      })
      this.$progress.done()
    }
  }

  export default Notifications
</script>

<style lang="less" scoped>
  .notification-panel-container {
    width: 376px;
    height: calc(100vh - 56px);
    padding: 8px;
    overflow: auto;
    overflow-x: hidden;

    .notification-card {
      margin: 2px 0;
      box-shadow: 0 1px 2px rgba(0,0,0,.2);
      border-radius: 3px;
      cursor: pointer;
    }
  }
</style>
