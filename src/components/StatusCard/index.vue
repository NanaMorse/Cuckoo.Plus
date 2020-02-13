<template>
  <div class="status-card-container" @dragenter="onDragFileOver" ref="statusCardContainer">
    <mu-card class="status-card status-card-bg-color" v-loading="isCardLoading"
             v-drag-over="isFileDragOver"
             @cuckooDragOver="onDragFileOver"
             @cuckooDragleave="isFileDragOver = false"
             @cuckooDrop="onDropFile">

      <card-header :status="status" @deleteStatus="isCardLoading = true"
                   @muteStatus="onMuteStatus" @muteUser="onMuteUser"/>

      <div class="spoiler-text-area primary-read-text-color" v-if="status.spoiler_text">
        <span v-html="status.spoiler_text"/>
        <mu-button flat small class="secondary-theme-text-color" :style="{ minWidth: 'unset' }"
                   @click="shouldShowContentWhileSpoilerExists = !shouldShowContentWhileSpoilerExists">
          {{ $t(shouldShowContentWhileSpoilerExists ? $i18nTags.statusCard.hide_content : $i18nTags.statusCard.show_content) }}
        </mu-button>
      </div>

      <mu-card-text v-if="!status.reblog && status.content" v-show="(status.spoiler_text ? shouldShowContentWhileSpoilerExists : true)"
                    class="status-content main-status-content"
                    v-html="status.content" :style="mainStatusContentStyle"/>

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

      <div v-if="!status.reblog && hasLinkCardInfo" class="main-link-preview-area">
        <mu-divider class="link-preview-divider"/>
        <link-preview-panel :cardInfo="cardMap[status.id]"/>
      </div>

      <mu-divider v-if="!status.media_attachments.length && !(status.pixiv_cards || []).length"/>

      <div v-if="!status.reblog" class="main-attachment-area">
        <media-panel :mediaList="status.media_attachments"
                     :pixivCards="status.pixiv_cards"
                     :cardInfo="mainStatusCardInfo" :sensitive="status.sensitive"/>
      </div>

      <div v-if="status.reblog" class="reblog-area">
        <div class="reblog-plain-info-area">
          <a @click="onCheckSharedOriginalPost" class="reblog-source-link" v-html="$t($i18nTags.statusCard.originally_shared_by, {
              displayName: status.reblog.account.display_name,
              atName: getAccountAtName(status.reblog.account)
            })">
          </a>
          <mu-card-text v-if="status.reblog.content" class="status-content reblog-status-content" v-html="status.reblog.content" />
        </div>

        <div v-if="reblogNeteaseMusicLink" class="netease-music-panel">
          <iframe class="netease-music-iframe" frameborder="no" border="0"
                  marginwidth="0" marginheight="0" height=86
                  :src="reblogNeteaseMusicLink"></iframe>
        </div>

        <div v-if="reblogYoutubeVideoLink" class="youtube-video-panel">
          <iframe class="youtube-video-iframe"
                  :height="youtubeVideoIFrameHeight"
                  :src="reblogYoutubeVideoLink"
                  frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen></iframe>
        </div>

        <div v-if="reblogHasLinkCardInfo" class="main-link-preview-area">
          <mu-divider class="link-preview-divider"/>
          <link-preview-panel :cardInfo="cardMap[status.reblog.id]"/>
        </div>

        <div class="reblog-attachment-area">
          <media-panel
            :mediaList="status.reblog.media_attachments"
            :pixivCards="status.reblog.pixiv_cards"
            :cardInfo="cardMap[status.reblog.id]" :sensitive="status.reblog.sensitive"/>
        </div>
      </div>

      <div class="reply-area-full">
        <div class="full-reply-list" ref="replyListContainer">
          <full-reply-list-item v-for="replierStatus in descendantStatusList" @muteStatus="onMuteStatus" @muteUser="onMuteUser"
                                :key="replierStatus.id" :status="replierStatus" @reply="onReplyToStatus(replierStatus)"/>
        </div>
      </div>

      <div class="current-reply-to-info-area" v-if="currentReplyToStatus">
        <mu-chip class="reply-to-account-info" color="primary" @delete="hideFullReplyActionArea" delete>
          <mu-avatar :size="32">
            <img :src="currentReplyToStatus.account.avatar">
          </mu-avatar>
          <span v-html="currentReplyToStatus.account.display_name"/>
          <span>&nbsp;@{{currentReplyToStatus.account.username}}</span>
        </mu-chip>
      </div>

      <mu-card-actions class="card-action-area">
        <simple-action-bar v-show="!shouldShowFullReplyActionArea" :status="status"
                           @reply="onReplyToStatus(status)"/>

        <full-action-bar v-if="isOAuthUser && shouldShowFullReplyActionArea"
                         :currentReplyToStatus="currentReplyToStatus"
                         :descendantStatusList="descendantStatusList"
                         :droppedFiles="droppedFiles" :replySpoilerText.sync="replySpoilerText"
                         :status="status" :value.sync="replyInputValue" @hide="hideFullReplyActionArea"
                         @loadingStart="isCardLoading = true" @loadingEnd="isCardLoading = false" @replySuccess="onReplySuccess"/>
      </mu-card-actions>
    </mu-card>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import { State, Getter, Mutation } from 'vuex-class'
  import { mastodonentities } from '@/interface'
  import { StatusCardTypes } from '@/constant'
  import * as $ from 'jquery'

  import CardHeader from './CardHeader'
  import MediaPanel from './MediaPanel'
  import LinkPreviewPanel from './LinkPreviewPanel'
  import FullReplyListItem from './FullReplyListItem'
  import SimpleActionBar from './SimpleActionBar'
  import FullActionBar from './FullActionBar'

  import VisibilitySelectPopOver from '@/components/VisibilitySelectPopOver'
  import { getNetEaseMusicFrameLinkFromContentLink, getYoutubeVideoFrameLinkFromContentLink } from '@/util'

  @Component({
    components: {
      'card-header': CardHeader,
      'media-panel': MediaPanel,
      'link-preview-panel': LinkPreviewPanel,
      'full-reply-list-item': FullReplyListItem,
      'simple-action-bar': SimpleActionBar,
      'full-action-bar': FullActionBar,
      'visibility-select-pop-over': VisibilitySelectPopOver
    }
  })
  class StatusCard extends Vue {

    $router

    $routersInfo

    $refs: {
      replyListContainer: HTMLDivElement
    }

    $confirm

    $t

    $i18nTags

    @State('contextMap') contextMap
    @State('statusMap') statusMap
    @State('cardMap') cardMap
    @State('currentUserAccount') currentUserAccount: mastodonentities.AuthenticatedAccount
    @State('appStatus') appStatus

    @Getter('getAccountAtName') getAccountAtName
    @Getter('isOAuthUser') isOAuthUser

    @Mutation('updateMuteStatusList') updateMuteStatusList
    @Mutation('updateMuteUserList') updateMuteUserList

    currentReplyToStatus: mastodonentities.Status = null

    shouldShowContentWhileSpoilerExists_ = null

    shouldShowFullReplyActionArea: boolean = false

    replyInputValue: string = ''

    replySpoilerText: string = ''

    isCardLoading = false

    isFileDragOver = false

    youtubeVideoIFrameHeight = 0

    droppedFiles: Array<File> = null

    @Prop() status: mastodonentities.Status

    @Prop() shouldCollapseContent: boolean

    mounted () {
      this.youtubeVideoIFrameHeight = this.$refs.replyListContainer.clientWidth * 315 / 560
    }

    get mainStatusCardInfo (): mastodonentities.Card {
      return this.cardMap[this.status.id]
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

    get reblogContentLinkList () {
      return this.status.reblog ? [...$(this.status.reblog.content).find('a')].map(a => {
        return a.getAttribute('href')
      }) : []
    }

    get reblogNeteaseMusicLink () {
      return this.reblogContentLinkList.map(link => {
        return getNetEaseMusicFrameLinkFromContentLink(link)
      }).filter(l => l)[0]
    }

    get reblogYoutubeVideoLink () {
      return this.reblogContentLinkList.map(link => {
        return getYoutubeVideoFrameLinkFromContentLink(link)
      }).filter(l => l)[0]
    }

    get hasLinkCardInfo () {
      return this.mainStatusCardInfo &&
        (Object.keys(this.mainStatusCardInfo).length !== 0)
        && this.mainStatusCardInfo.type === StatusCardTypes.LINK
    }

    get reblogHasLinkCardInfo () {
      return this.status.reblog &&
        this.cardMap[this.status.reblog.id] &&
        (Object.keys(this.cardMap[this.status.reblog.id]).length !== 0) &&
        this.cardMap[this.status.reblog.id].type === StatusCardTypes.LINK
    }

    get shouldShowContentWhileSpoilerExists () {
      if (typeof this.shouldShowContentWhileSpoilerExists_ === 'boolean') {
        return this.shouldShowContentWhileSpoilerExists_
      }

      return this.appStatus.settings.autoExpandSpoilerTextMode
    }

    set shouldShowContentWhileSpoilerExists (val) {
      this.shouldShowContentWhileSpoilerExists_ = val
    }

    get descendantStatusList (): Array<mastodonentities.Status> {
      if (!this.contextMap[this.status.id] || !this.contextMap[this.status.id].descendants) return []

      return this.contextMap[this.status.id].descendants.map(descendantStatusId => {
        return this.statusMap[descendantStatusId]
      }).filter(s => s).sort((a, b) => {
        return new Date(a.created_at) >= new Date(b.created_at) ? 1 : -1
      }).filter(status => {
        const muteByStatus = this.appStatus.settings.muteMap.statusList.indexOf(status.id) !== -1
        const muteByUser = this.appStatus.settings.muteMap.userList.indexOf(status.account.id) !== -1
        return !muteByStatus && !muteByUser
      })
    }

    get mainStatusContentStyle () {
      return this.shouldCollapseContent ? {
        'max-height': '500px',
        'overflow': 'auto'
      } : null
    }

    @Watch('shouldShowFullReplyActionArea')
    onFullReplyActionAreaDisplayToggled (val) {
      if (val) this.$emit('statusCardFocus')
    }

    hideFullReplyActionArea () {
      this.shouldShowFullReplyActionArea = false
      this.currentReplyToStatus = null
      this.replyInputValue = ''
      this.replySpoilerText = ''
      this.droppedFiles = []
    }

    onCheckSharedOriginalPost () {
      this.$router.push({
        name: this.$routersInfo.statuses.name,
        params: {
          statusId: this.status.reblog.id
        }
      })
    }

    onReplyToStatus (status: mastodonentities.Status) {
      this.currentReplyToStatus = status

      let preSetMentions

      if (this.appStatus.settings.onlyMentionTargetUserMode) {
        preSetMentions = [{ acct: status.account.acct }]
      } else {
        preSetMentions = status.mentions.filter(mention => {
          return (mention.id !== this.currentUserAccount.id) && (mention.id !== status.account.id)
        })

        if (status.account.id !== this.currentUserAccount.id || preSetMentions.length === 0) {
          preSetMentions.unshift({
            acct: status.account.acct,
            id: status.account.id
          } as mastodonentities.Mention)
        }
      }

      this.replyInputValue = preSetMentions.reduce((pre, cur) => pre + `@${cur.acct} `, '')

      this.shouldShowFullReplyActionArea = true
    }

    onReplySuccess () {
      this.$nextTick(() => {
        this.$refs.replyListContainer.scrollTo({ top: this.$refs.replyListContainer.scrollHeight, left: 0, behavior: 'smooth' })
      })
    }

    onDragFileOver (e: DragEvent) {
      e.preventDefault()

      this.isFileDragOver = true
    }

    onDropFile (e: DragEvent) {
      e.preventDefault()

      this.isFileDragOver = false

      if (!this.shouldShowFullReplyActionArea) {
        this.onReplyToStatus(this.status)
      }

      this.droppedFiles = Array.from(e.dataTransfer.files)
    }

    async onMuteStatus (statusId: string) {
      const doMuteStatus = (await this.$confirm(this.$t(this.$i18nTags.statusCard.mute_status_confirm), {
        okLabel: this.$t(this.$i18nTags.statusCard.do_mute_status_btn),
        cancelLabel: this.$t(this.$i18nTags.statusCard.cancel_mute_status_btn),
      })).result
      if (doMuteStatus) {
        this.updateMuteStatusList(statusId)
      }
    }

    async onMuteUser (userId: string) {
      const doMuteUser = (await this.$confirm(this.$t(this.$i18nTags.statusCard.mute_user_confirm), {
        okLabel: this.$t(this.$i18nTags.statusCard.do_mute_user_btn),
        cancelLabel: this.$t(this.$i18nTags.statusCard.cancel_mute_user_btn),
      })).result
      if (doMuteUser) {
        this.updateMuteUserList(userId)
      }
    }
  }

  export default StatusCard
</script>

<style lang="less" scoped>
  .status-card-container {
    width: 100%;

    .status-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.3s ease-in-out;
    }
  }

  .at-name {
    font-weight: 400;
    font-size: 13px;
  }

  .spoiler-text-area {
    padding: 0 16px 16px;
  }

  .main-status-content {
    padding: 0 16px 16px;
  }

  .main-link-preview-area {
    padding: 0 16px 16px 16px;
    .link-preview-divider {
      margin-bottom: 16px;
    }
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

  .reply-area-full {

    .full-reply-list {
      max-height: 400px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .full-reply-status-content {
      padding: 0;
    }
  }

  .current-reply-to-info-area {
    height: 44px;
    line-height: 44px;
    padding-left: 16px;

    .reply-to-account-info {
      margin-top: 6px;
    }
  }

  .card-action-area {
    padding: 0;
  }
</style>

<style lang="less">

  .status-content {
    // https://stackoverflow.com/questions/5241369/word-wrap-a-link-so-it-doesnt-overflow-its-parent-div-width
    word-wrap: break-word;
    white-space: pre-wrap;

    > p {
      margin: 0 0 10px 0;
      padding: 0;
    }

    > P:last-child {
      margin-bottom: 0;
    }
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
      resize: none;
    }
  }

  .no-limit-reply-area-height.status-card-container {
    .full-reply-list {
      max-height: unset;
    }
  }
</style>
