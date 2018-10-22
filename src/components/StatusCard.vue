<template>
  <div class="status-card-container" ref="statusCardContainer">
    <mu-card class="status-card" v-loading="isCardLoading" @mouseover="onCardMouseOver" @mouseout="onCardMouseOut">

      <mu-card-header class="mu-card-header">
        <div class="left-area">
          <mu-avatar class="status-account-avatar" slot="avatar" size="34">
            <img :src="status.account.avatar_static">
          </mu-avatar>
          <div class="user-and-status-info">
            <a class="user-name mu-primary-text-color" :style="userNameAreaStyle">
              {{getAccountDisplayName(status.account)}}
              <span class="at-name mu-secondary-text-color">@{{getAccountAtName(status.account)}}</span>
            </a>
            <div class="visibility-row mu-secondary-text-color">
              <div class="arrow-container">
                <svg viewBox="0 0 48 48" height="100%" width="100%"><path fill="rgba(0, 0, 0, 0.54)" d="M20 14l10 10-10 10z"></path></svg>
              </div>
              <div class="visibility-info">{{$t(status.visibility)}}</div>
            </div>
          </div>
        </div>

        <div class="right-area">
          <span v-show="!shouldShowHeaderActionButtonGroup" class="status-from-now">{{getFromNowTime(status.created_at)}}</span>

          <div v-show="shouldShowHeaderActionButtonGroup" class="card-header-action">
            <mu-icon class="header-icon" value="open_in_new" @click="onCheckStatusInSinglePage"/>
            <mu-icon class="header-icon" value="more_vert" />
          </div>
        </div>

      </mu-card-header>

      <mu-card-text v-if="!status.reblog && status.content" class="status-content main-status-content" v-html="formatHtml(status.content)" />

      <mu-divider />

      <div v-if="!status.reblog" class="main-attachment-area">
        <media-panel :mediaList="status.media_attachments" :pixivCards="status.pixiv_cards"/>
      </div>

      <div v-if="status.reblog" class="reblog-area">
        <div class="reblog-plain-info-area">
          <a class="reblog-source-link">
            此信息最初是由{{getAccountDisplayName(status.reblog.account)}}
            <span class="at-name">@{{getAccountAtName(status.reblog.account)}}</span>
            分享的
          </a>
          <mu-card-text v-if="status.reblog.content" class="status-content reblog-status-content" v-html="formatHtml(status.reblog.content)" />
        </div>
        <div class="reblog-attachment-area">
          <media-panel :mediaList="status.reblog.media_attachments" :pixivCards="status.reblog.pixiv_cards"/>
        </div>
      </div>

      <div class="reply-area-simple" v-if="shouldShowSimpleReplyListArea">
        <template v-if="descendantStatusList.length > 3">
          <mu-sub-header class="show-all-reply-btn" @click="onShowAllReplyButtonClick">显示所有评论（共 {{descendantStatusList.length}} 条）</mu-sub-header>
        </template>

        <div class="simple-reply-list" @click="onSimpleReplyListClick">
          <div class="simple-reply-list-item" v-for="replierStatus in lastedThreeReplyStatuses" :key="replierStatus.id">
            <span class="reply-account-display-name">{{getAccountDisplayName(replierStatus.account)}}:</span>
            <span class="status-content simple-reply-status-content" v-html="formatHtml(replierStatus.content)"></span>
          </div>
        </div>
      </div>

      <div class="reply-area-full" v-if="shouldShowFullReplyListArea">
        <div class="full-reply-list">
          <div class="full-reply-list-item" v-for="replierStatus in descendantStatusList" :key="replierStatus.id">
            <div class="left-area">
              <mu-avatar class="status-replier-avatar" slot="avatar" size="34">
                <img :src="replierStatus.account.avatar_static">
              </mu-avatar>
            </div>
            <div class="center-area">

              <div class="reply-user-display-name">
                <p class="mu-primary-text-color">
                  {{getAccountDisplayName(replierStatus.account)}}
                  <span class="at-name mu-secondary-text-color">@{{getAccountAtName(replierStatus.account)}}</span>
                </p>
                <span v-if="replierStatus.favourites_count > 0"
                      class="reply-favorites-count mu-secondary-text-color" :class="{ 'mu-primary-color': replierStatus.favourited }">+{{replierStatus.favourites_count}}</span>
              </div>
              <div class="status-content full-reply-status-content" v-html="formatHtml(replierStatus.content)"></div>
              <div class="reply-action-list">
                <a class="reply-button" @click="onReplyToReplierStatus(replierStatus)">{{$t($i18nTags.statusCard.reply_to_replier)}}</a>
                <div class="plus-one-button" @click="onFavoriteButtonClick(replierStatus)" :class="{ 'mu-primary-color': replierStatus.favourited }">
                  <a>+1</a>
                </div>
              </div>

            </div>
            <div class="right-area">
              <span class="reply-from-now mu-secondary-text-color">{{getFromNowTime(replierStatus.created_at)}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="current-reply-to-info-area" v-if="currentReplyToStatus">
        <mu-chip class="reply-to-account-info" color="primary" @delete="clearReplyToStatus" delete>
          <mu-avatar :size="32">
            <img :src="currentReplyToStatus.account.avatar_static">
          </mu-avatar>
          {{getAccountDisplayName(currentReplyToStatus.account)}} @{{currentReplyToStatus.account.username}}
        </mu-chip>
      </div>

      <mu-card-actions class="card-action-area" :style="shouldShowFullReplyListArea && { backgroundColor: '#fff' }">

        <div class="simple-action-bar" v-show="!shouldShowFullReplyActionArea">

          <div class="left-area">
            <mu-avatar class="current-user-avatar" slot="avatar" size="24">
              <img :src="currentUserAccount.avatar_static">
            </mu-avatar>

            <div class="active-reply-entry" @click="showFullReplyActionArea">
              {{$t($i18nTags.statusCard.reply_to_main_status)}}
            </div>
          </div>

          <div class="right-area">
            <div class="plus-one operate-btn-group">
              <mu-button class="button" icon @click="onFavoriteButtonClick(status)"
                         :class="{ 'has-operated': status.favourited }">
                +1
              </mu-button>
              <span v-if="status.favourites_count > 0" class="count">{{status.favourites_count}}</span>
            </div>
            <div class="share operate-btn-group">
              <mu-button class="button unset-display" @click="onReBlogMainStatus()"
                         :class="{ 'has-operated': status.reblogged }" icon>
                <mu-icon class="share-icon" value="share" />
              </mu-button>
              <span v-if="status.reblogs_count > 0" class="count">{{status.reblogs_count}}</span>
            </div>
          </div>

        </div>

        <div class="full-action-bar" v-show="shouldShowFullReplyActionArea">
          <div class="reply-input-area">
            <mu-avatar class="current-user-avatar" slot="avatar" size="24">
              <img :src="currentUserAccount.avatar_static">
            </mu-avatar>

            <div class="input-container">
              <textarea ref="replayTextInput" class="common-auto-size-text-area" v-model="replyInputValue"
                        :style="shouldShowFullReplyListArea && { backgroundColor: '#fff' }"
                        :placeholder="$t($i18nTags.statusCard.reply_to_main_status)"/>
            </div>

          </div>
          <div class="reply-action-area">
            <div class="left-area">
              <mu-button class="operate-btn add-image mu-secondary-text-color" icon>
                <mu-icon class="reply-action-icon" value="local_see" />
              </mu-button>
              <mu-button class="operate-btn add-link mu-secondary-text-color" icon>
                <mu-icon class="reply-action-icon" value="link" />
              </mu-button>
            </div>
            <div class="right-area">
              <mu-button flat class="operate-btn cancel mu-secondary-text-color"
                         color="primary" @click="onHideFullReplyActionArea">{{$t($i18nTags.statusCard.cancel_post)}}</mu-button>
              <mu-button flat class="operate-btn submit mu-secondary-text-color" @click="onSubmitReplyContent()"
                         :disabled="!replyInputValue">{{$t($i18nTags.statusCard.submit_post)}}</mu-button>
            </div>
          </div>
        </div>
      </mu-card-actions>
    </mu-card>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import { State, Action, Getter } from 'vuex-class'
  import * as moment from 'moment'
  import { AttachmentTypes } from '@/constant'
  import MediaPanel from './MediaPanel'
  import { mastodonentities } from '@/interface'
  import ThemeManager from 'muse-ui/lib/theme'
  import { formatHtml } from '@/util'
  const autosize = require('autosize')

  @Component({
    components: {
      'media-panel': MediaPanel
    }
  })
  class StatusCard extends Vue {

    $router

    $routersInfo

    $refs: {
      statusCardContainer: HTMLDivElement
      replayTextInput: HTMLTextAreaElement
    }

    @State('contextMap') contextMap
    @State('statusMap') statusMap

    @Action('updateFavouriteStatusById') updateFavouriteStatusById
    @Action('updateContextMap') updateContextMap
    @Action('postStatus') postStatus

    @Getter('getAccountDisplayName') getAccountDisplayName
    @Getter('getAccountAtName') getAccountAtName

    currentReplyToStatus: mastodonentities.Status = null

    shouldShowHeaderActionButtonGroup: boolean = false

    shouldShowFullReplyActionArea: boolean = false

    hasTryToExtendSimpleReplyArea = false

    replyInputValue: string = ''

    formatHtml = formatHtml

    isCardLoading = false

    userNameAreaStyle = {}

    mounted () {
      autosize(this.$refs.replayTextInput)
      this.setMainStatusUserNameAreaStyle()
    }

    @Prop() status: mastodonentities.Status

    @State('currentUserAccount') currentUserAccount: mastodonentities.AuthenticatedAccount

    @Watch('shouldShowFullReplyArea')
    async onShowCompleteReplyArea () {
      if (this.shouldShowFullReplyListArea) {
        try {
          this.updateContextMap(this.status.id)
        } catch (e) {

        }
      }
    }

    get descendantStatusList (): Array<mastodonentities.Status> {
      if (!this.contextMap[this.status.id]) return []

      return this.contextMap[this.status.id].map(descendantStatusId => {
        return this.statusMap[descendantStatusId]
      })
    }

    get lastedThreeReplyStatuses (): Array<mastodonentities.Status> {
      const descendantListLength = this.descendantStatusList.length

      if (!descendantListLength) return []

      if (descendantListLength <= 3) return this.descendantStatusList

      return [...this.descendantStatusList].splice(descendantListLength - 3, descendantListLength)
    }

    get shouldShowSimpleReplyListArea () {
      return this.descendantStatusList.length && this.descendantStatusList.length > 4 &&
        !this.hasTryToExtendSimpleReplyArea
    }

    get shouldShowFullReplyListArea () {
      return this.descendantStatusList.length && ( this.descendantStatusList.length <= 4 || this.hasTryToExtendSimpleReplyArea)
    }

    onCardMouseOver () {
      this.shouldShowHeaderActionButtonGroup = true
    }

    onCardMouseOut () {
      this.shouldShowHeaderActionButtonGroup = false
    }

    onCheckStatusInSinglePage () {
      this.$router.push({
        name: this.$routersInfo.statuses.name,
        params: {
          statusId: this.status.id
        }
      })
    }

    onShowAllReplyButtonClick () {
      this.hasTryToExtendSimpleReplyArea = true
    }

    onSimpleReplyListClick () {
      if (window.getSelection().toString().length === 0) {
        this.hasTryToExtendSimpleReplyArea = true
      }
    }

    onFavoriteButtonClick (targetStatus: mastodonentities.Status) {
      this.updateFavouriteStatusById({
        favourited: !targetStatus.favourited,
        mainStatusId: this.status.id,
        targetStatusId: targetStatus.id
      })
    }

    // todo
    async onReBlogMainStatus () {
//      this.isCardLoading = true
//
//      this.isCardLoading = false
    }

    showFullReplyActionArea () {
      this.shouldShowFullReplyActionArea = true
      this.$nextTick(() => {
        this.$refs.replayTextInput.focus()
      })
    }

    onHideFullReplyActionArea () {
      this.shouldShowFullReplyActionArea = false
      this.clearReplyToStatus()
    }

    onReplyToReplierStatus (status: mastodonentities.Status) {
      this.currentReplyToStatus = status

      this.replyInputValue = `@${this.currentReplyToStatus.account.username} `

      this.showFullReplyActionArea()
    }

    clearReplyToStatus () {
      this.currentReplyToStatus = null
      this.replyInputValue = ''
    }

    async onSubmitReplyContent () {
      const currentReplyToStatus = this.currentReplyToStatus || this.status

      this.isCardLoading = true
      await this.postStatus({
        mainStatusId: this.status.id,
        formData: {
          status: this.replyInputValue,
          inReplyToId: currentReplyToStatus.id
        }
      })
      this.isCardLoading = false

      this.clearReplyToStatus()
    }

    getFromNowTime (createdAt: string) {
      return moment(createdAt).fromNow(true)
    }

    /**
     * @desc set max-width
     * */
    setMainStatusUserNameAreaStyle () {
      const cardWidth = this.$refs.statusCardContainer.clientWidth
      const headerPadding = 16
      const avatarWidth = 34
      const avatarRightMargin = 8
      const visibilityInfoWidth = 50
      const rightAreaWidth = 50
      const leftToRightMargin = 5

      const maxWidth = cardWidth - headerPadding * 2 - avatarWidth - avatarRightMargin -
        visibilityInfoWidth - rightAreaWidth - leftToRightMargin

      this.userNameAreaStyle = {
        maxWidth: `${maxWidth}px`
      }
    }
  }

  export default StatusCard
</script>

<style lang="less" scoped>
  @import "../assets/themes/base.less";
  @import "../assets/variable.less";

  .status-card {
    width: 100%;
    background-color: #fafafa;
  }

  .at-name {
    font-size: 13px;
  }

  .mu-card-header {
    background-color: #fff;
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap
        }

        .visibility-row {
          display: flex;
          align-items: center;

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
    background-color: #fff;
    padding: 0 16px 16px;
  }

  .main-attachment-area {
    .attachment-list {
      > img {
        width: 100%;
        height: auto;
      }
    }
  }

  .reblog-area {
    .reblog-plain-info-area {
      margin: 16px;

      .reblog-source-link {
        cursor: pointer;
        font-weight: 500;

        .at-name {
          color: unset;
        }
      }

      .reblog-status-content {
        padding: 0;
        margin-top: 8px;
      }
    }
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

  .reply-area-full {
    background-color: #fff;

    .full-reply-list {
      max-height: 400px;
      overflow-y: auto;
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
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .reply-favorites-count {
            font-size: 13px;
            font-weight: 500;
            margin-left: 8px;
          }
        }

        .reply-action-list {
          display: flex;
          align-items: center;
          margin-top: 6px;

          .common-style-mixin() {
            cursor: pointer;
            font-size: 13px;
            color: #2962ff;
            margin: 0 8px;
          }

          .reply-button {
            .common-style-mixin();
            margin-left: 0;
          }

          .plus-one-button {
            .common-style-mixin();
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            border-radius: 50%;

            &.mu-primary-color {

              a {
                color: #fff;
              }
            }

            a {
              color: #2962ff;
            }
          }
        }
      }

      .right-area {
        flex-shrink: 0;

        .reply-from-now {
          width: 32px;
          font-size: 13px;
        }
      }
    }
  }

  .current-reply-to-info-area {
    height: 44px;
    line-height: 44px;
    padding-left: 16px;
    background-color: #fff;

    .reply-to-account-info {
      margin-top: 6px;
    }
  }

  .card-action-area {
    padding: 0;

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
          color: #999;
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

          .button {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #eeeeee;
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

            &:hover {
              background-color: #f5f5f5;
              box-shadow: 0 1px 3px 0 rgba(0,0,0,0.26);
            }

            &.has-operated {
              .mu-primary-color();
              color: #fff;

              &:hover {
                background-color: #c53929;
              }
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
            color: #777;
            font-size: 13px;
            margin-right: 6px;
          }
        }
      }
    }

    .full-action-bar {
      padding: 12px 16px 0 16px;

      .reply-input-area {
        display: flex;

        .current-user-avatar {
          margin-top: 7px;
        }

        .input-container {
          display: flex;
          align-items: center;
          flex-grow: 1;
          margin-left: 16px;
          padding: 9px 12px 8px 0;

          .common-auto-size-text-area {
            height: 18px;
          }
        }
      }

      .reply-action-area {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 48px;
        margin: 0 -12px;

        .left-area {
          display: flex;

          .operate-btn {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;

            .reply-action-icon {
              font-size: 18px;
            }
          }
        }

        .right-area {
          display: flex;
        }
      }
    }
  }
</style>

<style lang="less">

  .status-content {
    // https://stackoverflow.com/questions/5241369/word-wrap-a-link-so-it-doesnt-overflow-its-parent-div-width
    word-wrap: break-word;
    > p {
      margin: 0;
      padding: 0;
    }
    span.h-card, span.h-card > a, span.h-card > span { color: #2962ff }
  }

  .simple-reply-status-content {
    > p { display: inline }
  }

  .reply-text-input {
    .el-textarea__inner {
      width: 100%;
      outline: none;
      border: none;
      padding: 0;
      background-color: #fafafa;
      resize: none;
    }
  }
</style>
