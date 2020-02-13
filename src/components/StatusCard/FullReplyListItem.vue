<template>
  <div class="full-reply-list-item" v-loading="isListItemLoading" @mouseover="onItemMouseOver" @mouseout="onItemMouseOut">
    <div class="left-area">
      <mu-avatar @click="onCheckUserAccountPage" class="status-replier-avatar" slot="avatar" size="34">
        <img :src="status.account.avatar">
      </mu-avatar>
    </div>

    <div class="content-area" ref="contentArea">

      <div class="content-header">
        <div class="reply-user-display-name">
          <a @click="onCheckUserAccountPage" class="primary-read-text-color">
            <span class="display-name" v-html="status.account.display_name"></span>
            <span class="at-name secondary-read-text-color">@{{getAccountAtName(status.account)}}</span>
          </a>
          <span v-if="status.favourites_count > 0"
                class="reply-favorites-count"
                :class="[ status.favourited ? 'primary-theme-text-color' : 'secondary-read-text-color' ]">
                  +{{status.favourites_count}}
                </span>
        </div>

        <div class="operation-area" ref="operationArea" :style="operationAreaStyle">
          <span v-show="!shouldOpenMoreOperationPopOver && !shouldShowMoreOperationTriggerBtn" class="reply-from-now secondary-read-text-color">{{getFromNowTime()}}</span>
          <mu-button v-show="shouldOpenMoreOperationPopOver || shouldShowMoreOperationTriggerBtn" icon style="width: 16px; height: 16px" @click="onOpenMoreOperationPopOver">
            <mu-icon class="header-icon secondary-read-text-color" value="more_vert"/>
          </mu-button>
        </div>
      </div>

      <div class="spoiler-text-area primary-read-text-color" v-if="status.spoiler_text">
        <span v-html="status.spoiler_text"/>
        <mu-button flat small class="secondary-theme-text-color" :style="{ minWidth: 'unset' }"
                   @click="shouldShowContentWhileSpoilerExists = !shouldShowContentWhileSpoilerExists">
          {{ $t(shouldShowContentWhileSpoilerExists ? $i18nTags.statusCard.hide_content : $i18nTags.statusCard.show_content) }}
        </mu-button>
      </div>

      <mu-card-text class="status-content full-reply-status-content"
                    v-show="(status.spoiler_text ? shouldShowContentWhileSpoilerExists : true)"
                    v-html="status.content"></mu-card-text>

      <div v-if="neteaseMusicLink" class="netease-music-panel">
        <iframe class="netease-music-iframe" frameborder="no" border="0"
                marginwidth="0" marginheight="0" height=86
                :src="neteaseMusicLink"></iframe>
      </div>

      <div v-if="youtubeVideoLink" class="youtube-video-panel">
        <iframe class="youtube-video-iframe"
                :height="youtubeVideoIFrameHeight"
                :src="youtubeVideoLink"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
      </div>

      <div v-if="!status.reblog && hasLinkCardInfo" class="full-reply-link-preview-area">
        <link-preview-panel :cardInfo="cardMap[status.id]"/>
      </div>

      <div class="full-reply-attachment-area">
        <media-panel :mediaList="status.media_attachments" :pixivCards="status.pixiv_cards" :sensitive="status.sensitive"/>
      </div>

      <div class="reply-action-list">

        <a class="reply-button secondary-theme-text-color"
           @click="onReplyToStatus">{{$t($i18nTags.statusCard.reply_to_replier)}}</a>

        <div class="plus-one-button secondary-theme-text-color"
             @click="onFavoriteButtonClick"
             :class="{ 'primary-theme-bg-color': status.favourited }">
          <a>+1</a>
        </div>

        <div class="reshare-button secondary-theme-text-color"
             @click="onReBlogButtonClick"
             :class="{ 'primary-theme-bg-color': status.reblogged }">
          <mu-icon class="share-icon" value="share" />
        </div>

      </div>
    </div>

    <mu-popover cover placement="left-start"
                :open.sync="shouldOpenMoreOperationPopOver"
                :trigger="moreOperationTriggerBtn">
      <mu-list>
        <mu-list-item button @click.stop="onMuteStatus">
          <mu-list-item-title>{{$t($i18nTags.statusCard.mute_status)}}</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button v-if="currentUserAccount.id !== status.account.id"
                      @click.stop="onMuteUser">
          <mu-list-item-title>{{$t($i18nTags.statusCard.mute_user)}}</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button v-if="currentUserAccount.id === status.account.id"
                      @click.stop="onDeleteStatus">
          <mu-list-item-title>{{$t($i18nTags.statusCard.delete_status)}}</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-popover>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { Getter, Action, State } from 'vuex-class'
  import * as moment from 'moment'
  import { mastodonentities } from "@/interface"
  import MediaPanel from './MediaPanel'
  import LinkPreviewPanel from './LinkPreviewPanel'
  import {getNetEaseMusicFrameLinkFromContentLink, getYoutubeVideoFrameLinkFromContentLink } from '@/util'
  import * as $ from "jquery"

  @Component({
    components: {
      'media-panel': MediaPanel,
      'link-preview-panel': LinkPreviewPanel,
    }
  })
  class FullReplyListItem extends Vue {

    $refs: {
      operationArea: HTMLDivElement
      contentArea: HTMLDivElement
    }

    $confirm

    $t

    $i18nTags

    @Prop() status: mastodonentities.Status

    @State('cardMap') cardMap
    @State('currentUserAccount') currentUserAccount: mastodonentities.AuthenticatedAccount

    @Action('updateFavouriteStatusById') updateFavouriteStatusById
    @Action('updateReblogStatusById') updateReblogStatusById
    @Action('deleteStatus') deleteStatus

    @Getter('getAccountAtName') getAccountAtName

    isListItemLoading: boolean = false

    shouldShowMoreOperationTriggerBtn: boolean = false
    shouldOpenMoreOperationPopOver: boolean = false
    moreOperationTriggerBtn = null

    shouldShowContentWhileSpoilerExists: boolean = false

    operationAreaStyle = null

    youtubeVideoIFrameHeight = 0

    get hasLinkCardInfo () {
      return this.cardMap[this.status.id]
        && (Object.keys(this.cardMap[this.status.id]).length !== 0)
        && this.cardMap[this.status.id].type === 'link'
    }

    get contentLinkList () {
      return [...$(this.status.content).find('a')].map(a => {
        return a.getAttribute('href')
      })
    }

    get neteaseMusicLink () {
      return this.contentLinkList.map(link => {
        return getNetEaseMusicFrameLinkFromContentLink(link)
      }).filter(l => l)[0]
    }

    get youtubeVideoLink () {
      return this.contentLinkList.map(link => {
        return getYoutubeVideoFrameLinkFromContentLink(link)
      }).filter(l => l)[0]
    }

    mounted () {
      this.operationAreaStyle = {
        // todo 2 is magic number
        width: `${this.$refs.operationArea.clientWidth + 2}px`
      }

      this.youtubeVideoIFrameHeight = this.$refs.contentArea.clientWidth * 315 / 560
    }

    getFromNowTime () {
      return moment(this.status.created_at).fromNow(true)
    }

    onFavoriteButtonClick () {
      this.updateFavouriteStatusById({
        favourited: !this.status.favourited,
        mainStatusId: this.status.id,
        targetStatusId: this.status.id
      })
    }

    onReBlogButtonClick () {
      this.updateReblogStatusById({
        reblogged: !this.status.reblogged,
        mainStatusId: this.status.id,
        targetStatusId: this.status.id
      })
    }

    onReplyToStatus () {
      this.$emit('reply', this.status)
    }

    onOpenMoreOperationPopOver (e) {
      this.moreOperationTriggerBtn = e.target
      this.shouldOpenMoreOperationPopOver = true
    }

    onCheckUserAccountPage () {
      window.open(this.status.account.url, "_blank")
    }

    async onDeleteStatus () {
      const doDeleteStatus = (await this.$confirm(this.$t(this.$i18nTags.statusCard.delete_status_confirm), {
        okLabel: this.$t(this.$i18nTags.statusCard.do_delete_status_btn),
        cancelLabel: this.$t(this.$i18nTags.statusCard.cancel_delete_status_btn),
      })).result
      if (doDeleteStatus) {
        this.isListItemLoading = true
        await this.deleteStatus({ statusId: this.status.id })
      }
    }

    onMuteStatus () {
      this.$emit('muteStatus', this.status.id)
    }

    async onMuteUser () {
      this.$emit('muteUser', this.status.account.id)
    }

    onItemMouseOver () {
      this.shouldShowMoreOperationTriggerBtn = true
    }

    onItemMouseOut () {
      this.shouldShowMoreOperationTriggerBtn = false
    }

  }

  export default FullReplyListItem
</script>

<style lang="less" scoped>
  .full-reply-list-item {
    position: relative;
    display: flex;
    padding: 12px 16px;

    .status-replier-avatar {
      cursor: pointer;
    }

    .content-area {
      flex-grow: 1;
      margin: 0 10px 0 16px;
      display: flex;
      flex-direction: column;
      width: 0;

      .content-header {
        display: flex;
        justify-content: space-between;
        height: 22px;
        line-height: 22px;

        .reply-user-display-name {
          display: flex;
          align-items: center;

          > a {
            margin: 0;
            font-size: 15px;
            font-weight: 500;
            text-overflow: ellipsis;
            overflow: hidden;
            cursor: pointer;
          }

          .reply-favorites-count {
            font-size: 13px;
            font-weight: 500;
            margin-left: 8px;
          }
        }

        .operation-area {
          display: flex;
          flex-direction: row-reverse;

          .reply-from-now {
            font-size: 13px;
            white-space: nowrap;
          }
        }
      }

      .netease-music-panel {
        margin-left: -60px;
        margin-right: -20px;
      }

      .full-reply-status-content {
        padding: 0;
      }

      .full-reply-link-preview-area {
        margin: 12px 0 0 4px;
      }

      .reply-action-list {
        display: flex;
        align-items: center;
        margin-top: 6px;

        .common-style-mixin() {
          cursor: pointer;
          font-size: 13px;
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
        }

        .reshare-button {
          .common-style-mixin();
          line-height: 1;
          width: 24px;
          height: 24px;
          text-align: center;
          border-radius: 50%;

          .share-icon {
            font-size: 16px;
            line-height: 24px;
          }
        }
      }
    }
  }
</style>
