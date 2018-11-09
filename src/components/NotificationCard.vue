<template>
  <mu-card style="width: 100%; max-width: 530px; margin: 0 auto; cursor: pointer;" @click="onClickCard">
    <mu-card-header :title="title" :sub-title="subTitle">
      <mu-avatar slot="avatar">
        <img :src="avatarLink">
      </mu-avatar>
    </mu-card-header>
  </mu-card>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { Getter, Mutation } from 'vuex-class'
  import { mastodonentities } from '@/interface'
  import { extractText } from "../util";

  @Component({})
  class NotificationCard extends Vue {

    $router

    $routersInfo

    @Prop() notification: mastodonentities.Notification

    @Getter('getAccountDisplayName') getAccountDisplayName

    @Mutation('updateNotificationsPanelStatus') updateNotificationsPanelStatus

    get title() {
      return this.getAccountDisplayName(this.notification.account)
    }

    get subTitle() {
      return this.notification.type + ": " + extractText(this.notification.status.content)
    }

    get avatarLink() {
      return this.notification.account.avatar_static
    }

    onClickCard() {
      this.updateNotificationsPanelStatus(false)
      this.$router.push({
        name: this.$routersInfo.statuses.name,
        params: {
          statusId: this.notification.status.id
        }
      })
    }
  }

  export default NotificationCard
</script>