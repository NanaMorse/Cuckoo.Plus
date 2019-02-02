<template>
  <div class="notification-panel-container base-theme-bg-color" :style="isLoadingTargetStatus ? { overflow: 'hidden' } : null">

    <keep-alive>
      <div class="notification-list" v-show="!shouldShowTargetStatus">
        <mu-load-more loading-text="" @load="loadNotifications(true)" :loading="isLoadingNotifications">
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
            <notification-card :notification="notification" @updateCurrentCheckStatus="onUpdateCurrentCheckStatus"
                               v-for="(notification, index) in notifications" :key="index"/>
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
  import { State, Action } from 'vuex-class'
  import { NotificationTypes, ThemeNames } from '@/constant'
  import StatusCard from '@/components/StatusCard'
  import NotificationCard from './Card'
  import { mastodonentities } from '@/interface'
  import { prepareRootStatus, formatHtml } from "@/util"

  @Component({
    components: {
      'status-card': StatusCard,
      'notification-card': NotificationCard
    }
  })
  class Notifications extends Vue {

    $progress

    @Prop() hideHeader: boolean

    @Action('updateNotifications') updateNotifications

    @State('notifications') notifications: Array<mastodonentities.Notification>

    isLoadingNotifications: boolean = false

    // todo
    isLoadingTargetStatus: boolean = false

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

    async loadNotifications (isLoadMore, isFetchMore) {
      if (this.shouldShowTargetStatus) return

      this.isLoadingNotifications = true
      await this.updateNotifications({
        isLoadMore,
        isFetchMore
      })
      this.isLoadingNotifications = false
    }

    onUpdateCurrentCheckStatus (targetStatus: mastodonentities.Status) {
      this.currentCheckStatus = targetStatus
      this.shouldShowTargetStatus = true
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
