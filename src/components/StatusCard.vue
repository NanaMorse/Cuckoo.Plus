<template>
  <div class="status-card-container">
    <mu-card class="status-card">
      <mu-card-header class="mu-card-header">
        <mu-avatar class="mu-avatar" slot="avatar" size="34">
          <img :src="status.account.avatar_static">
        </mu-avatar>
        <a class="user-name">{{status.account.display_name}}</a>
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
  import {  } from 'vuex-class'
  import { mastodonentities } from '@/interface'

  @Component({})
  class StatusCard extends Vue {

    @Prop() status: mastodonentities.Status

    @Prop() context: mastodonentities.Context

    get lastedThreeReplyStatuses (): Array<mastodonentities.Status> {
      return [...this.context.descendants].splice(this.context.descendants.length - 3, this.context.descendants.length)
    }

    get shouldShowSimpleReplyArea () {
      return this.context && this.context.descendants.length
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

    .mu-avatar {
      margin-right: 8px;
    }

    .user-name {
      font-size: 15px;
      color: rgba(0,0,0,.87);
      display: inline-block;
      vertical-align: top;
      white-space: normal;
      line-height: 34px;
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
