<template>
  <div class="simple-action-bar">

    <div class="left-area">
      <mu-avatar v-if="isOAuthUser" class="current-user-avatar" slot="avatar" size="24">
        <img :src="currentUserAccount.avatar">
      </mu-avatar>

      <div v-if="isOAuthUser" :style="activeReplyEntryStyle"
           class="active-reply-entry placeholder-read-text-color"
           @click="onReplyToStatus">
        {{$t($i18nTags.statusCard.reply_to_main_status)}}
      </div>
    </div>

    <div class="right-area">
      <div class="plus-one operate-btn-group">
        <mu-button :disabled="!isOAuthUser" class="circle-btn" icon @click="onFavoriteButtonClick"
                   :class="{ 'primary-theme-bg-color': operateCheckTargetStatus.favourited }">
          +1
        </mu-button>
        <span v-if="operateCheckTargetStatus.favourites_count > 0" class="count">{{operateCheckTargetStatus.favourites_count}}</span>
      </div>
      <div class="share operate-btn-group" v-if="shouldShowReblogButton">
        <mu-button :disabled="!isOAuthUser" class="circle-btn unset-display" @click="onReBlogButtonClick"
                   :class="{ 'primary-theme-bg-color': operateCheckTargetStatus.reblogged }" icon>
          <mu-icon class="share-icon" value="share" />
        </mu-button>
        <span v-if="operateCheckTargetStatus.reblogs_count > 0" class="count">{{operateCheckTargetStatus.reblogs_count}}</span>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { State, Getter, Action } from 'vuex-class'
  import { I18nLocales, VisibilityTypes } from '@/constant'
  import { mastodonentities, cuckoostore } from '@/interface'

  @Component({})
  class SimpleActionBar extends Vue {

    @Prop() status: mastodonentities.Status

    @State('currentUserAccount') currentUserAccount: mastodonentities.AuthenticatedAccount

    @State('appStatus') appStatus

    @Getter('isOAuthUser') isOAuthUser

    @Action('updateFavouriteStatusById') updateFavouriteStatusById
    @Action('updateReblogStatusById') updateReblogStatusById

    get shouldShowReblogButton () {
      return this.status.visibility !== VisibilityTypes.DIRECT
    }

    get operateCheckTargetStatus () {
      return this.status.reblog || this.status
    }

    get activeReplyEntryStyle () {
      if (this.appStatus.settings.locale === I18nLocales.JA) {
        return {
          fontSize: '12px'
        }
      }
    }

    onFavoriteButtonClick () {
      const mainStatusId = this.status.id
      const targetStatusId = this.operateCheckTargetStatus.id

      this.updateFavouriteStatusById({
        favourited: !this.operateCheckTargetStatus.favourited,
        mainStatusId, targetStatusId
      })
    }

    onReBlogButtonClick () {
      const mainStatusId = this.status.id
      const targetStatusId = this.operateCheckTargetStatus.id

      this.updateReblogStatusById({
        reblogged: !this.operateCheckTargetStatus.reblogged,
        mainStatusId, targetStatusId
      })
    }

    onReplyToStatus () {
      this.$emit('reply', this.status)
    }

    get operateBtnStyle () {
      if (!this.isOAuthUser) {
        return {
          cursor: ''
        }
      }
    }

  }

  export default SimpleActionBar
</script>

<style lang="less" scoped>
  .simple-action-bar {
    min-height: 60px;
    display: flex;
    justify-content: space-between;

    .left-area {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      flex-grow: 1;

      .active-reply-entry {
        margin-left: 16px;
        height: 36px;
        font-size: 14px;
        line-height: 36px;
        font-weight: 300;
        flex-grow: 1;
      }
    }

    .right-area {
      margin: 12px 8px;
      display: flex;
      align-items: center;
      flex-shrink: 0;

      .operate-btn-group {
        display: flex;

        &.plus-one {
          font-size: 12px;
        }

        .share-icon {
          font-size: 18px;
        }

        .count {
          line-height: 36px;
          font-size: 13px;
          margin-right: 6px;
        }
      }
    }
  }
</style>
