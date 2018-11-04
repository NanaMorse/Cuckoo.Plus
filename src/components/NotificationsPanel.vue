<template>
  <div v-loading="!notifications">
    <notification-card v-for="(notification, index) in notifications" :key="index" :notification="notification" />
  </div>
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

    @State('notifications') notifications: Array<mastodonentities.Notification>

    async mounted() {
      this.$progress.start()
      await this.fetchNotifications()
      this.$progress.done()
    }
  }

  export default NotificationsPanel
</script>