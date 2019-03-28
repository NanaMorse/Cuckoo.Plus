<template>
  <div class="cuckoo-header-container">
    <mu-appbar class="header" :class="shouldUseSecondaryThemeHeader && 'dialog-theme-bg-color'" color="primary" ref="header">
      <mu-button v-if="isOAuthUser" icon @click.stop="onMenuBtnClick" slot="left">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      <div class="host-mastodon-url cuckoo-hub-logo" v-if="isCuckooHubTheme">
        <span>Cuck</span><span>Hub</span>
      </div>
      <span v-if="!isCuckooHubTheme" class="host-mastodon-url" @click="onHostMastodonUrlClick">{{parsedMastodonServerUri}}</span>
      <mu-button v-if="isOAuthUser" ref="notificationBtn" icon @click.stop="onOpenNotificationPanel" slot="right">
        <mu-icon v-if="appStatus.unreadNotificationCount === 0" value="notifications"></mu-icon>
        <mu-badge class="notification-badge" v-if="appStatus.unreadNotificationCount > 0" :content="String(appStatus.unreadNotificationCount)" circle color="primary" />
      </mu-button>

      <mu-popover v-if="isOAuthUser" v-show="showNotificationAsPopOver"
                  cover lazy placement="left-start" style="width: 420px"
                  :open="appStatus.isNotificationsPanelOpened && showNotificationAsPopOver"
                  @close="updateNotificationsPanelStatus(false)" :trigger="notificationBtnTrigger">
        <notifications />
      </mu-popover>

      <mu-dialog v-if="isOAuthUser" v-show="!showNotificationAsPopOver" :overlay="false"
                 :open="appStatus.isNotificationsPanelOpened && !showNotificationAsPopOver"
                 :fullscreen="true" transition="slide-bottom">
        <mu-appbar color="primary" title="Notifications" v-show="shouldShowNotificationDialogHeader">
          <mu-button slot="left" icon @click="updateNotificationsPanelStatus(false)">
            <mu-icon value="close" />
          </mu-button>
          <mu-button slot="right" icon @click="onFetchMoreNotifications">
            <mu-icon value="refresh" />
          </mu-button>
        </mu-appbar>
        <notifications :style="notificationContainerStyle" :hideHeader="true" @shouldShowTargetStatusChanged="onDialogNotificationShowStatusChanged"/>
      </mu-dialog>

      <span class="route-info" v-if="shouldShowRouteInfo">{{pathToRouteInfo[$route.path].name}}</span>
    </mu-appbar>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { State, Mutation, Action, Getter } from 'vuex-class'
  import { TimeLineTypes, RoutersInfo, UiWidthCheckConstants, ThemeNames } from '@/constant'
  import { cuckoostore } from '@/interface'
  import { animatedScrollTo } from '@/util'
  import Notifications from '@/components/Notifications/index'

  // todo 统一位置管理
  const pathToRouteInfo = {
    '/timelines/home': {
      name: 'Home'
    },
    '/timelines/public': {
      name: 'Public'
    },
    '/timelines/local': {
      name: 'Local'
    }
  }

  @Component({
    components: {
      'notifications': Notifications
    }
  })
  class Header extends Vue {

    $refs: {
      notificationBtn: any,
      header: any
    }

    $router

    $route

    $progress

    notificationBtnTrigger: HTMLButtonElement = null

    @State('appStatus') appStatus

    @State('mastodonServerUri') mastodonServerUri

    @Action('updateNotifications') updateNotifications

    @Getter('isOAuthUser') isOAuthUser

    @Mutation('updateDrawerOpenStatus') updateDrawerOpenStatus

    @Mutation('updateNotificationsPanelStatus') updateNotificationsPanelStatus

    @Mutation('updateUnreadNotificationCount') updateUnreadNotificationCount

    pathToRouteInfo = pathToRouteInfo

    shouldShowNotificationDialogHeader: boolean = true

    @Watch('$route')
    onRouteChanged () {
      if (!this.isOAuthUser) return

      this.updateNotificationsPanelStatus(false)
    }

    get shouldShowRouteInfo () {
      return this.isOAuthUser && (this.appStatus.documentWidth > 600) && this.pathToRouteInfo[this.$route.path]
    }

    get parsedMastodonServerUri () {
      if (!this.isOAuthUser) {
        return 'Cuckoo.Plus'
      }

      const url = new URL(this.mastodonServerUri)
      return url.host.replace(url.host[0], (c) => c.toUpperCase())
    }

    get showNotificationAsPopOver (): boolean {
      return this.appStatus.documentWidth > UiWidthCheckConstants.NOTIFICATION_DIALOG_TOGGLE_WIDTH
    }

    get notificationContainerStyle () {
      return {
        height: this.shouldShowNotificationDialogHeader ? 'auto' : '100%'
      }
    }

    get shouldUseSecondaryThemeHeader () {
      return this.isCuckooHubTheme
    }

    get isCuckooHubTheme () {
      return this.appStatus.settings.theme === ThemeNames.CUCKOO_HUB
    }

    mounted () {
      if (this.isOAuthUser) {
        this.notificationBtnTrigger = this.$refs.notificationBtn.$el
      }

      this.$refs.header.$el.addEventListener('click', () => this.onHeaderBarClick())
    }

    onMenuBtnClick () {
      this.updateDrawerOpenStatus(!this.appStatus.isDrawerOpened)
    }

    onHostMastodonUrlClick () {
      this.$router.push({ path: '/timelines/home' })
    }

    onHeaderBarClick () {
      animatedScrollTo(document.querySelector('html'), 0, 400)
    }

    onOpenNotificationPanel () {
      this.onFetchMoreNotifications()
      this.updateUnreadNotificationCount(0)
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

    .host-mastodon-url {
      cursor: pointer;
    }

    .cuckoo-hub-logo {

      span:first-child {
        padding: 5px 5px;
        font-weight: 600;
      }

      span:last-child {
        padding: 5px 10px;
        background-color: #FF9900;
        border-radius: 7px;
        font-weight: 700;
      }
    }

    .route-info {
      height: 32px;
      line-height: 32px;
      padding-left: 10px;
      margin-left: 20px;
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
      padding-left: 0;

      .search-input-area {
        .mu-text-field-input {
          height: 48px;
        }

        .mu-input-line, .mu-input-focus-line {
          display: none;
        }
      }
    }

    .notification-badge {
      .mu-badge {
        border: 2px solid;
      }
    }
  }
</style>
