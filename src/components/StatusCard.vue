<template>
  <div class="status-card-container">
    <mu-card class="status-card" @mouseover="onCardMouseOver" @mouseout="onCardMouseOut">
      <mu-card-header class="mu-card-header">
        <div class="left-area">
          <mu-avatar class="status-account-avatar" slot="avatar" size="34">
            <img :src="status.account.avatar_static">
          </mu-avatar>
          <div class="user-and-status-info">
            <a class="user-name">{{status.account.display_name}}</a>
            <div class="visibility-row">
              <div class="arrow-container">
                <svg viewBox="0 0 48 48" height="100%" width="100%"><path fill="rgba(0, 0, 0, 0.54)" d="M20 14l10 10-10 10z"></path></svg>
              </div>
              <div class="visibility-info">{{$t(status.visibility)}}</div>
            </div>
          </div>
        </div>

        <div class="right-area">
          <span v-show="!shouldShowHeaderActionButtonGroup" class="status-from-now">{{fromNowTime}}</span>

          <div v-show="shouldShowHeaderActionButtonGroup" class="card-header-action">
            <mu-icon class="header-icon" value="open_in_new" />
            <mu-icon class="header-icon" value="more_vert" />
          </div>
        </div>

      </mu-card-header>

      <mu-card-text class="status-content main-status-content" v-html="status.content" />

      <mu-divider />

      <div class="reply-area-simple" v-if="shouldShowSimpleReplyArea">
        <template v-if="context.descendants.length > 3">
          <mu-sub-header class="show-all-reply-btn" @click="onShowAllReplyButtonClick">显示所有评论（共 {{context.descendants.length}} 条）</mu-sub-header>
        </template>

        <div class="simple-reply-list" @click="onSimpleReplyListClick">
          <div class="simple-reply-list-item" v-for="replyStatus in lastedThreeReplyStatuses" :key="replyStatus.id">
            <span class="reply-account-display-name">{{replyStatus.account.display_name}}:</span>
            <span class="status-content simple-reply-status-content" v-html="replyStatus.content"></span>
          </div>
        </div>
      </div>

      <div class="reply-area-full" v-if="shouldShowFullReplyArea">
        <div class="full-reply-list">
          <div class="full-reply-list-item" v-for="replyStatus in lastedThreeReplyStatuses" :key="replyStatus.id">
            <div class="left-area">
              <mu-avatar class="status-replier-avatar" slot="avatar" size="34">
                <img :src="replyStatus.account.avatar_static">
              </mu-avatar>
            </div>
            <div class="center-area">
              <div class="reply-user-display-name">
                <p>{{replyStatus.account.display_name}}</p>
                <span v-if="replyStatus.favourites_count > 0" class="reply-favorites-count">+{{replyStatus.favourites_count}}</span>
              </div>
              <div class="status-content full-reply-status-content" v-html="replyStatus.content"></div>
              <div class="reply-action-list">
                <a class="reply-button">{{$t($i18nTags.statusCard.reply_to_replier)}}</a>
                <a class="plus-one-button">+1</a>
              </div>
            </div>
            <div class="right-area">
              <span class="reply-from-now">{{fromNowTime}}</span>
            </div>
          </div>
        </div>
      </div>

      <mu-card-actions>
        
      </mu-card-actions>
    </mu-card>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import * as moment from 'moment'
  import * as api from '@/api'
  import { mastodonentities } from '@/interface'

  @Component({})
  class StatusCard extends Vue {

    mounted () {
      this.getStatusContextInfo()
    }

    shouldShowHeaderActionButtonGroup: boolean = false

    hasTryToExtendSimpleReplyArea = false

    context: mastodonentities.Context = null

    @Prop() status: mastodonentities.Status

    @Watch('shouldShowFullReplyArea')
    async onShowCompleteReplyArea () {
      if (this.shouldShowFullReplyArea) {
        try {
          // todo loading
          await this.getStatusContextInfo()
          // todo loading end
        } catch (e) {

        }
      }
    }

    get lastedThreeReplyStatuses (): Array<mastodonentities.Status> {
      if (!this.context) return []

      return [...this.context.descendants].splice(this.context.descendants.length - 3, this.context.descendants.length)
    }

    get shouldShowSimpleReplyArea () {
      return this.context && this.context.descendants.length && !this.hasTryToExtendSimpleReplyArea
    }

    get shouldShowFullReplyArea () {
      return this.context && this.context.descendants.length && this.hasTryToExtendSimpleReplyArea
    }

    get fromNowTime () {
      return moment(this.status.created_at).fromNow(true)
    }

    onCardMouseOver () {
      this.shouldShowHeaderActionButtonGroup = true
    }

    onCardMouseOut () {
      this.shouldShowHeaderActionButtonGroup = false
    }

    onShowAllReplyButtonClick () {
      this.hasTryToExtendSimpleReplyArea = true
    }

    onSimpleReplyListClick () {
      if (window.getSelection().toString().length === 0) {
        this.hasTryToExtendSimpleReplyArea = true
      }
    }

    async getStatusContextInfo () {
      try {
        const result = await api.statuses.getStatusContextById(this.status.id)
        this.context = result.data
      } catch (e) {

      }
    }
  }

  export default StatusCard
</script>

<style lang="scss" scoped>

  $common_black_color: rgba(0,0,0,.87);

  $common_grey_color: rgba(0,0,0,0.54);

  .status-card-container {
    margin: 16px 0;
  }

  .status-card {
    width: 100%;
    max-width: 498px;
    margin: 0 auto;
  }

  .mu-card-header {
    line-height: 1;
    display: flex;
    justify-content: space-between;

    .left-area {
      display: flex;
      align-items: center;

      .status-account-avatar {
        margin-right: 8px;
        cursor: pointer;
      }

      .user-and-status-info {
        display: flex;
        align-items: center;

        .user-name {
          cursor: pointer;
          font-size: 15px;
          color: $common_black_color;
        }

        .visibility-row {
          display: flex;
          align-items: center;
          color: $common_grey_color;

          .arrow-container {
            width: 18px;
            height: 18px;
          }

          .visibility-info {
            cursor: pointer;
          }
        }

      }

    }

    .right-area {
      display: flex;
      align-items: center;

      .status-from-now {
        color: #9e9e9e;
        font-size: 13px;
        font-weight: 400;
      }

      .card-header-action {
        .header-icon {
          cursor: pointer;
          color: #757575;
          font-size: 18px;
          margin-left: 10px;
        }
      }
    }
  }

  .main-status-content {
    padding: 0 16px 16px;
  }

  .show-all-reply-btn {
    width: auto;
    margin: 14px 0 -2px 0;
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    color: #2962ff;
  }

  .simple-reply-list {
    margin-top: 16px;
  }

  .simple-reply-list-item {

    &:first-child {
      margin-top: 0;
    }

    line-height: 18px;
    margin: 16px 16px 0;
    overflow: hidden;
    word-break: break-word;
    font-size: 14px;
  }

  .full-reply-list-item {
    display: flex;
    padding: 12px 16px;

    .center-area {
      flex-grow: 1;
      margin: 0 10px 0 16px;
      display: flex;
      flex-direction: column;

      .reply-user-display-name {
        display: flex;
        align-items: center;

        > p {
          margin: 0;
          font-size: 15px;
          font-weight: 500;
          color: $common_black_color;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .reply-favorites-count {
          font-size: 13px;
          color: $common_grey_color;
          font-weight: 500;
          margin-left: 8px;
        }
      }

      .reply-action-list {
        display: flex;
        align-items: center;
        margin-top: 6px;

        > a {
          cursor: pointer;
          font-size: 13px;
          color: #2962ff;
          margin: 8px;

          &:first-child {
            margin-left: 0;
          }
        }
      }
    }

    .right-area {

      .reply-from-now {
        width: 32px;
        color: $common_grey_color;
        font-size: 13px;
      }
    }
  }

  .status-content {

  }
</style>

<style lang="scss">

  .status-content {
    > p {
      margin: 0;
      padding: 0;
    }
    span.h-card, span.h-card > a, span.h-card > span { color: #2962ff }
  }

  .full-reply-status-content {

  }

  .simple-reply-status-content {
    > p { display: inline }
  }
</style>
