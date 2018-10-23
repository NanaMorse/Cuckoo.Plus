<template>
  <div class="header-container">
    <mu-appbar class="header" color="primary">
      <mu-button icon @click="onMenuBtnClick" slot="left">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      <span>{{parsedMastodonServerUri}}</span>
      <mu-button ref="notificationBtn" icon @click="onNotificationsBtnClick" slot="right">
        <mu-icon value="notifications"></mu-icon>
      </mu-button>
      <mu-popover cover lazy placement="right" :open.sync="appStatus.isNotificationsPanelOpened" :trigger="notificationBtnTrigger">
        <notification-panel/>
      </mu-popover>
    </mu-appbar>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { State, Mutation } from 'vuex-class'
  import { cuckoostore } from '@/interface'
  import NotificationsPanel from './NotificationsPanel'

  @Component({
    components: {
      'notification-panel': NotificationsPanel
    }
  })
  class Header extends Vue {

    notificationBtnTrigger

    @State('appStatus') appStatus

    @State('mastodonServerUri') mastodonServerUri

    @Mutation('updateDrawerOpenStatus') updateDrawerOpenStatus

    @Mutation('updateNotificationsPanelStatus') updateNotificationsPanelStatus

    get parsedMastodonServerUri () {
      const url = new URL(this.mastodonServerUri)
      return url.host
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
  }
</style>
