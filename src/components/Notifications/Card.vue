<template>
  <mu-list-item :style="notificationCardStyle" v-loading="isLoading"
                class="notification-card dialog-theme-bg-color" avatar>
    <mu-list-item-action>
      <mu-avatar class="user-avatar" @click="onCheckUserAccountPage(notification.account)">
        <img :src="notification.account.avatar_static" />
      </mu-avatar>
    </mu-list-item-action>
    <mu-list-item-content>
      <mu-list-item-title class="user-display-name primary-read-text-color"
                          v-html="getAccountDisplayName(notification.account)"
                          @click="onCheckUserAccountPage(notification.account)" />
      <mu-list-item-sub-title class="notification-content primary-read-text-color"
                              v-html="getNotificationSubTitle(notification)"
                              @click="onNotificationCardClick(notification)" />
    </mu-list-item-content>
    <mu-list-item-action v-if="shouldShowFollowOperateBtn(notification, followOperateBtnTypes.FOLLOW)">
      <mu-icon @click="onFollowingAccount(notification.account.id)" class="follow-action" value="person_add" />
    </mu-list-item-action>
    <mu-list-item-action v-if="shouldShowFollowOperateBtn(notification, followOperateBtnTypes.UN_FOLLOW)">
      <mu-icon @click="onUnFollowingAccount(notification.account.id)" class="follow-action secondary-theme-text-color" value="person_add_disabled" />
    </mu-list-item-action>
  </mu-list-item>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { State, Getter, Action } from 'vuex-class'
  import { NotificationTypes, ThemeNames } from '@/constant'
  import { mastodonentities } from '@/interface'
  import { prepareRootStatus, formatHtml } from "@/util"

  @Component({})
  class Card extends Vue {

    $t

    $i18nTags

    isLoadingSingleCard: boolean = false

    isLoading: boolean = false

    followOperateBtnTypes = {
      FOLLOW: 'FOLLOW',
      UN_FOLLOW: 'UN_FOLLOW'
    }

    @Prop() notification: mastodonentities.Notification

    @Action('followAccountById') followAccountById
    @Action('unFollowAccountById') unFollowAccountById

    @State('appStatus') appStatus

    @State('relationships') relationships: {
      [id: string]: mastodonentities.Relationship
    }

    @Getter('getAccountDisplayName') getAccountDisplayName

    get notificationCardStyle () {
      const themeToStyle: any = {
        [ThemeNames.GOOGLE_PLUS]: {
          backgroundColor: '#fff'
        },
        [ThemeNames.DARK]: {

        }
      }

      themeToStyle[this.appStatus.settings.theme].position = this.isLoadingSingleCard ? 'relative' : ''

      return themeToStyle[this.appStatus.settings.theme]
    }

    onCheckUserAccountPage (account: mastodonentities.Account) {
      window.open(account.url, "_blank")
    }

    getNotificationSubTitle (notification) {
      switch (notification.type) {
        case NotificationTypes.FOLLOW: {
          return this.$t(this.$i18nTags.notifications.someone_followed_you, {
            displayName: this.getAccountDisplayName(notification.account)
          })
        }

        case NotificationTypes.FAVOURITE:
        case NotificationTypes.REBLOG: {
          return notification.type + ": " + formatHtml(notification.status.content)
        }

        case NotificationTypes.MENTION: {
          return formatHtml(notification.status.content)
        }
      }
    }


    async onNotificationCardClick (notification: mastodonentities.Notification) {
      if (!notification.status) {
        if (notification.type === NotificationTypes.FOLLOW) {
          window.open(notification.account.url, "_blank")
        }
      } else {
        this.isLoadingSingleCard = false

        this.isLoading = true
        const targetStatus = await prepareRootStatus(notification.status)
        this.isLoading = false

        this.$emit('updateCurrentCheckStatus', targetStatus)
      }
    }

    shouldShowFollowOperateBtn (notification: mastodonentities.Notification, operateType: string) {
      const isFollowingNotification = notification.type === NotificationTypes.FOLLOW
      let typeCheckOK = false
      if (operateType === this.followOperateBtnTypes.FOLLOW) {
        typeCheckOK = this.relationships[notification.account.id] && !this.relationships[notification.account.id].following
      } else if (operateType === this.followOperateBtnTypes.UN_FOLLOW) {
        typeCheckOK = this.relationships[notification.account.id] && this.relationships[notification.account.id].following
      }
      return isFollowingNotification && typeCheckOK
    }

    async onFollowingAccount (id: string) {
      this.isLoadingSingleCard = true

      this.isLoading = true
      await this.followAccountById(id)
      this.isLoading = false
    }

    async onUnFollowingAccount (id: string) {
      this.isLoadingSingleCard = true

      this.isLoading = true
      await this.unFollowAccountById(id)
      this.isLoading = false
    }
  }

  export default Card
</script>

<style lang="less" scoped>
  .notification-card {
    margin: 2px 0;
    box-shadow: 0 1px 2px rgba(0,0,0,.2);
    border-radius: 3px;

    .user-avatar {
      cursor: pointer;
    }

    .user-display-name {
      display: inline;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }

    .notification-content {
      cursor: pointer;
    }

    .follow-action {
      cursor: pointer;
    }
  }
</style>
