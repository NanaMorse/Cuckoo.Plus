<template>
  <div class="cuckoo-header-container">
    <mu-appbar class="header" color="primary">
      <mu-button icon @click="onMenuBtnClick" slot="left">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      <span>{{parsedMastodonServerUri}}</span>
      <mu-button ref="notificationBtn" icon @click="onNotificationsBtnClick" slot="right">
        <mu-icon value="notifications"></mu-icon>
      </mu-button>

      <mu-popover v-show="showNotificationAsPopOver"
                  lazy placement="bottom-end" style="width: 420px"
                  :open="appStatus.isNotificationsPanelOpened && showNotificationAsPopOver"
                  @close="updateNotificationsPanelStatus(false)" :trigger="notificationBtnTrigger">
        <notifications />
      </mu-popover>

      <mu-dialog v-show="!showNotificationAsPopOver" :overlay="false"
                 :open="appStatus.isNotificationsPanelOpened && !showNotificationAsPopOver"
                 :fullscreen="true" transition="slide-bottom">
        <mu-appbar color="secondary" title="Notifications" v-show="shouldShowNotificationDialogHeader">
          <mu-button slot="left" icon @click="updateNotificationsPanelStatus(false)">
            <mu-icon value="close" />
          </mu-button>
          <mu-button slot="right" icon @click="onFetchMoreNotifications">
            <mu-icon value="refresh" />
          </mu-button>
        </mu-appbar>
        <notifications :hideHeader="true" @shouldShowTargetStatusChanged="onDialogNotificationShowStatusChanged"/>
      </mu-dialog>

      <span class="route-info" v-if="shouldShowRouteInfo">{{pathToRouteInfo[$route.path].name}}</span>
    </mu-appbar>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { State, Mutation, Action } from 'vuex-class'
  import { TimeLineTypes, RoutersInfo, UiWidthCheckConstants } from '@/constant'
  import { cuckoostore } from '@/interface'
  import Notifications from '@/components/Notifications'

  // todo 统一位置管理
  const pathToRouteInfo = {
    '/timelines/home': {
      name: 'Home'
    },
    '/timelines/public': {
      name: 'Public'
    }
  }

  @Component({
    components: {
      'notifications': Notifications
    }
  })
  class Header extends Vue {

    $refs: {
      notificationBtn: any
    }

    $route

    $progress

    notificationBtnTrigger: HTMLButtonElement = null

    @State('appStatus') appStatus

    @State('mastodonServerUri') mastodonServerUri

    @Action('updateNotifications') updateNotifications

    @Mutation('updateDrawerOpenStatus') updateDrawerOpenStatus

    @Mutation('updateNotificationsPanelStatus') updateNotificationsPanelStatus

    pathToRouteInfo = pathToRouteInfo

    shouldShowNotificationDialogHeader: boolean = true

    @Watch('$route')
    onRouteChanged () {
      this.updateNotificationsPanelStatus(false)
    }

    get shouldShowRouteInfo () {
      return (this.appStatus.documentWidth > 600) && this.pathToRouteInfo[this.$route.path]
    }

    get parsedMastodonServerUri () {
      const url = new URL(this.mastodonServerUri)
      return url.host.replace(url.host[0], (c) => c.toUpperCase())
    }

    get showNotificationAsPopOver (): boolean {
      return this.appStatus.documentWidth > UiWidthCheckConstants.NOTIFICATION_DIALOG_TOGGLE_WIDTH
    }

    mounted () {
      this.notificationBtnTrigger = this.$refs.notificationBtn.$el
    }

    onMenuBtnClick () {
      this.updateDrawerOpenStatus(!this.appStatus.isDrawerOpened)
    }

    onNotificationsBtnClick () {
      this.updateNotificationsPanelStatus(!this.appStatus.isNotificationsPanelOpened)
    }

    onDialogNotificationShowStatusChanged (val) {
      this.shouldShowNotificationDialogHeader = !val
    }

    async onFetchMoreNotifications() {
      this.$progress.start()
      await this.updateNotifications({
        isFetchMore: true
      })
      this.$progress.done()
    }
  }

  export default Header
</script>

<style lang="less" scoped>
  .header {
    padding-left: 8px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 20141223;

    .route-info {
      height: 32px;
      line-height: 32px;
      padding-left: 24px;
      margin-left: 24px;
      border-left: 1px solid;
    }

    .search-input-area {
      width: 720px;
      display: flex;
      margin-left: 28px;
      align-items: center;

      .pre-fix-icon {
        margin-left: 10px;
      }

      .search-input {
        margin: 0;
        padding: 0;
        padding-left: 10px;
      }
    }
  }
</style>

<style lang="less">
  .cuckoo-header-container {
    .mu-appbar-title {
      display: flex;
      align-items: center;

      .search-input-area {
        .mu-text-field-input {
          height: 48px;
        }

        .mu-input-line, .mu-input-focus-line {
          display: none;
        }
      }
    }
  }
</style>
