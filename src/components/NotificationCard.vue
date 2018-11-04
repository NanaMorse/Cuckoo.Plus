<template>
  <mu-container>
    <mu-card style="width: 100%; max-width: 375px; margin: 0 auto;">
      <mu-card-header :title="title" :sub-title="subTitle">
        <mu-avatar slot="avatar">
        </mu-avatar>
      </mu-card-header>
    </mu-card>
  </mu-container>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { mastodonentities } from '@/interface'

  @Component({})
  class NotificationCard extends Vue {

    @Prop() notification: mastodonentities.Notification

    get title() {
      return this.notification.account.username
    }

    get subTitle() {
      return this.notification.type
    }

  }

  export default NotificationCard
</script>