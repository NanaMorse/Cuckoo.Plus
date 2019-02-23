<template>
  <div class="simple-action-bar">

    <div class="left-area">
      <mu-avatar v-if="isOAuthUser" class="current-user-avatar" slot="avatar" size="24">
        <img :src="currentUserAccount.avatar_static">
      </mu-avatar>

      <div v-if="isOAuthUser" :style="activeReplyEntryStyle"
           class="active-reply-entry secondary-read-text-color"
           @click="onReplyToStatus">
        {{$t($i18nTags.statusCard.reply_to_main_status)}}
      </div>
    </div>

    <div class="right-area">
      <div class="plus-one operate-btn-group">
        <mu-button :disabled="!isOAuthUser" class="status-card-circle-btn" icon @click="onFavoriteButtonClick"
                   :class="{ 'primary-theme-bg-color': status.favourited }">
          +1
        </mu-button>
        <span v-if="status.favourites_count > 0" class="count">{{status.favourites_count}}</span>
      </div>
      <div class="share operate-btn-group">
        <mu-button :disabled="!isOAuthUser" class="status-card-circle-btn unset-display" @click="onReBlogMainStatus"
                   :class="{ 'primary-theme-bg-color': status.reblogged }" icon>
          <mu-icon class="share-icon" value="share" />
        </mu-button>
        <span v-if="status.reblogs_count > 0" class="count">{{status.reblogs_count}}</span>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { State, Getter, Action } from 'vuex-class'
  import { I18nLocales } from '@/constant'
  import { mastodonentities, cuckoostore } from '@/interface'

  @Component({})
  class SimpleActionBar extends Vue {

    @Prop() status: mastodonentities.Status

    @State('currentUserAccount') currentUserAccount: mastodonentities.AuthenticatedAccount

    @State('appStatus') appStatus

    @Getter('isOAuthUser') isOAuthUser

    @Action('updateFavouriteStatusById') updateFavouriteStatusById

    get activeReplyEntryStyle () {
      if (this.appStatus.settings.locale === I18nLocales.JA) {
        return {
          fontSize: '12px'
        }
      }
    }

    onFavoriteButtonClick () {
      this.updateFavouriteStatusById({
        favourited: !this.status.favourited,
        targetStatusId: this.status.id
      })
    }

    onReBlogMainStatus () {

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

        .status-card-circle-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          -webkit-transition: background .3s;
          -moz-transition: background .3s;
          -ms-transition: background .3s;
          -o-transition: background .3s;
          transition: background .3s;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          margin: 0 8px;
          font-size: 15px;

          &.unset-display {
            display: unset;
          }

          &.hover:before {
            background-color: unset;
          }
        }

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
