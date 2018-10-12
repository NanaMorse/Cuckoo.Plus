<template>
  <div class="status-card-container" @mouseover="onMouseOver" @mouseout="onMouseOut">
    <mu-card class="status-card">
      <mu-card-header class="mu-card-header">
        <div class="left-area">
          <mu-avatar class="mu-avatar" slot="avatar" size="34">
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
          <span v-show="!showHeaderActionButtonGroup" class="from-now">{{fromNowTime}}</span>

          <div v-show="showHeaderActionButtonGroup" class="card-header-action">
            <mu-icon class="header-icon" value="open_in_new" />
            <mu-icon class="header-icon" value="more_vert" />
          </div>
        </div>

      </mu-card-header>

      <mu-card-text class="mu-card-text" v-html="status.content" />

      <mu-divider />

      <div class="reply-area-simple" v-if="shouldShowSimpleReplyArea">
        <template v-if="context.descendants.length > 3">
          <mu-sub-header class="mu-sub-header">显示所有评论（共 {{context.descendants.length}} 条）</mu-sub-header>
        </template>

        <div class="reply-simple-list">
          <div class="reply-simple-list-item" v-for="status in lastedThreeReplyStatuses" :key="status.id">
            <span class="reply-account-display-name">{{status.account.display_name}}:</span>
            <span class="reply-content" v-html="status.content"></span>
          </div>
        </div>
      </div>

      <div class="reply-area-complete"></div>

      <mu-card-actions>

      </mu-card-actions>
    </mu-card>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import * as moment from 'moment'
  import { mastodonentities } from '@/interface'

  @Component({})
  class StatusCard extends Vue {

    showHeaderActionButtonGroup: boolean = false

    @Prop() status: mastodonentities.Status

    @Prop() context: mastodonentities.Context

    get lastedThreeReplyStatuses (): Array<mastodonentities.Status> {
      return [...this.context.descendants].splice(this.context.descendants.length - 3, this.context.descendants.length)
    }

    get shouldShowSimpleReplyArea () {
      return this.context && this.context.descendants.length
    }

    get fromNowTime () {
      return moment(this.status.created_at).fromNow(true)
    }

    onMouseOver () {
      this.showHeaderActionButtonGroup = true
    }

    onMouseOut () {
      this.showHeaderActionButtonGroup = false
    }
  }

  export default StatusCard
</script>

<style lang="scss" scoped>
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

      .mu-avatar {
        margin-right: 8px;
        cursor: pointer;
      }

      .user-and-status-info {
        display: flex;
        align-items: center;

        .user-name {
          cursor: pointer;
          font-size: 15px;
          color: rgba(0,0,0,.87);
        }

        .visibility-row {
          display: flex;
          align-items: center;
          color: rgba(0,0,0,0.54);

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

      .from-now {
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

  .mu-card-text {
    padding: 0 16px 16px;
  }

  .mu-sub-header {
    width: auto;
    margin: 14px 0 -2px 0;
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    color: #2962ff;
  }

  .reply-simple-list {
    margin-top: 16px;
  }

  .reply-simple-list-item {

    &:first-child {
      margin-top: 0;
    }

    line-height: 18px;
    margin: 16px 16px 0;
    overflow: hidden;
    word-break: break-word;
    font-size: 14px;
  }
</style>

<style lang="scss">

  // todo add a common scss lib
  .mu-card-text {
    > p {
      margin: 0;
      padding: 0;
    }
    span.h-card, span.h-card > a, span.h-card > span { color: #2962ff }
  }

  .reply-simple-list-item {
    .reply-content {
      > p { display: inline }
      span.h-card, span.h-card > a, span.h-card > span { color: #2962ff }
    }
  }
</style>
