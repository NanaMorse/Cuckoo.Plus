<template>
  <mu-list-item class="people-result-card" avatar :ripple="false" v-loading="isLoading" data-mu-loading-size="36">
    <mu-list-item-action>
      <mu-avatar class="people-result-card-avatar" @click="onCheckUserAccountPage(account)">
        <img :src="account.avatar_static" />
      </mu-avatar>
    </mu-list-item-action>
    <mu-list-item-content class="people-result-card-content ellipsis-text" @click="onCheckUserAccountPage(account)">
      <mu-list-item-title class="user-display-name primary-read-text-color"
                          v-html="getAccountDisplayName(account)" />
      <mu-list-item-sub-title class="user-at-name secondary-read-text-color"
                              v-html="`@${getAccountAtName(account)}`" />
    </mu-list-item-content>
    <mu-list-item-action v-if="currentUserAccount.id !== account.id && relationships[account.id] && !relationships[account.id].following">
      <mu-icon class="operate-btn" value="person_add" @click="onFollowingAccount"/>
    </mu-list-item-action>
    <mu-list-item-action v-if="currentUserAccount.id !== account.id && relationships[account.id] && relationships[account.id].following">
      <mu-icon class="operate-btn secondary-theme-text-color" value="person_add_disabled" @click="onUnFollowingAccount"/>
    </mu-list-item-action>
  </mu-list-item>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { State, Action, Getter } from 'vuex-class'
  import { mastodonentities } from '@/interface'

  @Component({})
  class PeopleResultCard extends Vue {

    isLoading: boolean = false

    @Prop() account: mastodonentities.Account

    @State('currentUserAccount') currentUserAccount: mastodonentities.AuthenticatedAccount

    @State('relationships') relationships: {
      [id: string]: mastodonentities.Relationship
    }

    @Getter('getAccountDisplayName') getAccountDisplayName
    @Getter('getAccountAtName') getAccountAtName

    @Action('followAccountById') followAccountById
    @Action('unFollowAccountById') unFollowAccountById

    onCheckUserAccountPage (account: mastodonentities.Account) {
      window.open(account.url, "_blank")
    }

    async onFollowingAccount () {
      this.isLoading = true
      await this.followAccountById(this.account.id)
      this.isLoading = false
    }

    async onUnFollowingAccount () {
      this.isLoading = true
      await this.unFollowAccountById(this.account.id)
      this.isLoading = false
    }
  }

  export default PeopleResultCard
</script>

<style lang="less" scoped>
  .ellipsis-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .operate-btn {
    cursor: pointer;
  }

  .people-result-card {
    position: relative;

    .people-result-card-avatar {
      cursor: pointer;
    }

    .people-result-card-content {
      cursor: pointer;

      .user-display-name {
        display: inline;
      }

      &:hover {
        .user-display-name, .user-at-name {
          text-decoration: underline;
        }
      }
    }
  }
</style>