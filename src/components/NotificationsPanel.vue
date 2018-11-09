<template>
  <mu-container>
    <mu-flex calign-items="center">
      <mu-flex justify-content="start" fill>
        <mu-sub-header>Notifications</mu-sub-header>
      </mu-flex>
      <mu-flex justify-content="end" fill>
        <mu-button icon @click="onRefreshNotifications">
          <mu-icon value="refresh"></mu-icon>
        </mu-button>
      </mu-flex>
    </mu-flex>
    <mu-container v-loading="!notifications">
      <notification-card v-for="(notification, index) in notifications" :key="index" :notification="notification" />
    </mu-container>
  </mu-container>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { State, Action } from 'vuex-class'
  import { mastodonentities } from '@/interface'
  import NotificationCard from '@/components/NotificationCard'

  @Component({
    components: {
      'notification-card': NotificationCard
    }
  })
  class NotificationsPanel extends Vue {

    $progress

    @Action('fetchNotifications') fetchNotifications

    @Action('refreshNotifications') refreshNotifications

    @State('notifications') notifications: Array<mastodonentities.Notification>

    async mounted() {
      this.$progress.start()
      await this.fetchNotifications()
      this.$progress.done()
    }

    async onRefreshNotifications() {
      this.$progress.start()
      await this.refreshNotifications()
      this.$progress.done()
    }
  }

  export default NotificationsPanel
</script>