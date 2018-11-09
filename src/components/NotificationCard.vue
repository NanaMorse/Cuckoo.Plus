<template>
  <mu-container>
    <mu-card style="width: 100%; max-width: 375px; margin: 0 auto;">
      <mu-card-header :title="title" :sub-title="subTitle">
        <mu-avatar slot="avatar">
          <img :src="avatarLink">
        </mu-avatar>
      </mu-card-header>
    </mu-card>
  </mu-container>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { Getter } from 'vuex-class'
  import { mastodonentities } from '@/interface'
  import { extractText } from "../util";

  @Component({})
  class NotificationCard extends Vue {

    @Prop() notification: mastodonentities.Notification

    @Getter('getAccountDisplayName') getAccountDisplayName

    get title() {
      return this.getAccountDisplayName(this.notification.account)
    }

    get subTitle() {
      return this.notification.type + ": " + extractText(this.notification.status.content)
    }

    get avatarLink() {
      return this.notification.account.avatar_static
    }
  }

  export default NotificationCard
</script>