<template>
  <div v-loading="!notifications">
    <p v-for="notification in notifications">{{ notification }}</p>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { State, Action } from 'vuex-class'
  import { mastodonentities } from '@/interface'

  @Component({})
  class NotificationsPanel extends Vue {

    $progress

    @Action('fetchNotifications') fetchNotifications

    @State('notifications') notifications

    async mounted() {
      this.$progress.start()
      await this.fetchNotifications()
      this.$progress.done()
    }
  }

  export default NotificationsPanel
</script>