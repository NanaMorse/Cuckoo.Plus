<template>
  <div class="status-card-container" @dragover="onDragFileOver" @dragleave="isFileDragOver = false" @drop="onDropFile">
    <mu-card class="status-card status-card-bg-color" v-loading="isCardLoading" v-drag-over="isFileDragOver">

      <card-header :status="status" @deleteStatus="isCardLoading = true"/>

      <div class="spoiler-text-area secondary-read-text-color" v-if="status.spoiler_text">
        <span v-html="status.spoiler_text"/>
        <mu-button flat small class="secondary-theme-text-color" :style="{ minWidth: 'unset' }"
                   @click="shouldShowContentWhileSpoilerExists = !shouldShowContentWhileSpoilerExists">
          {{ $t(shouldShowContentWhileSpoilerExists ? $i18nTags.statusCard.hide_content : $i18nTags.statusCard.show_content) }}
        </mu-button>
      </div>

      <mu-card-text v-if="!status.reblog && status.content" v-show="(status.spoiler_text ? shouldShowContentWhileSpoilerExists : true)"
                    class="status-content main-status-content"
                    v-html="status.content" />

      <mu-divider v-if="!status.media_attachments.length && !(status.pixiv_cards || []).length"/>

      <div v-if="!status.reblog" class="main-attachment-area">
        <media-panel :mediaList="status.media_attachments" :pixivCards="status.pixiv_cards" :sensitive="status.sensitive"/>
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
        <div class="reblog-attachment-area">
          <media-panel :mediaList="status.reblog.media_attachments" :pixivCards="status.reblog.pixiv_cards" :sensitive="status.reblog.sensitive"/>
        </div>
      </div>

      <div class="reply-area-full">
        <div class="full-reply-list" ref="replyListContainer">
          <full-reply-list-item v-for="replierStatus in descendantStatusList"
                                :key="replierStatus.id" :status="replierStatus" @reply="onReplyToStatus(replierStatus)"/>
        </div>
      </div>

      <div class="current-reply-to-info-area" v-if="currentReplyToStatus">
        <mu-chip class="reply-to-account-info" color="primary" @delete="hideFullReplyActionArea" delete>
          <mu-avatar :size="32">
            <img :src="currentReplyToStatus.account.avatar_static">
          </mu-avatar>
          <span v-html="currentReplyToStatus.account.display_name"/> @{{currentReplyToStatus.account.username}}
        </mu-chip>
      </div>

      <mu-card-actions class="card-action-area">
        <simple-action-bar v-show="!shouldShowFullReplyActionArea" :status="status"
                           @reply="onReplyToStatus(status)"/>

        <full-action-bar v-if="isOAuthUser" :show="shouldShowFullReplyActionArea"
                         :currentReplyToStatus="currentReplyToStatus"
                         :descendantStatusList="descendantStatusList"
                         :droppedFiles="droppedFiles"
                         :status="status" :value.sync="replyInputValue" @hide="hideFullReplyActionArea"
                         @loadingStart="isCardLoading = true" @loadingEnd="isCardLoading = false" @replySuccess="onReplySuccess"/>
      </mu-card-actions>
    </mu-card>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { State, Getter } from 'vuex-class'
  import { mastodonentities } from '@/interface'

  import CardHeader from './CardHeader'
  import MediaPanel from './MediaPanel'
  import FullReplyListItem from './FullReplyListItem'
  import SimpleActionBar from './SimpleActionBar'
  import FullActionBar from './FullActionBar'

  import VisibilitySelectPopOver from '@/components/VisibilitySelectPopOver'

  @Component({
    components: {
      'card-header': CardHeader,
      'media-panel': MediaPanel,
      'full-reply-list-item': FullReplyListItem,
      'simple-action-bar': SimpleActionBar,
      'full-action-bar': FullActionBar,
      'visibility-select-pop-over': VisibilitySelectPopOver
    }
  })
  class StatusCard extends Vue {

    $router

    $routersInfo

    $confirm

    $refs: {
      replyListContainer: HTMLDivElement
    }

    @State('contextMap') contextMap
    @State('statusMap') statusMap
    @State('currentUserAccount') currentUserAccount: mastodonentities.AuthenticatedAccount

    @Getter('getAccountAtName') getAccountAtName
    @Getter('isOAuthUser') isOAuthUser

    currentReplyToStatus: mastodonentities.Status = null

    shouldShowContentWhileSpoilerExists: boolean = false

    shouldShowFullReplyActionArea: boolean = false

    replyInputValue: string = ''

    isCardLoading = false

    isFileDragOver = false

    droppedFiles: Array<File> = null

    @Prop() status: mastodonentities.Status

    get descendantStatusList (): Array<mastodonentities.Status> {
      if (!this.contextMap[this.status.id] || !this.contextMap[this.status.id].descendants) return []

      return this.contextMap[this.status.id].descendants.map(descendantStatusId => {
        return this.statusMap[descendantStatusId]
      }).filter(s => s).sort((a, b) => {
        return new Date(a.created_at) >= new Date(b.created_at) ? 1 : -1
      })
    }

    hideFullReplyActionArea () {
      this.shouldShowFullReplyActionArea = false
      this.currentReplyToStatus = null
      this.replyInputValue = ''
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

      const preSetMentions = status.mentions.filter(mention => {
        return (mention.id !== this.currentUserAccount.id) && (mention.id !== status.account.id)
      })

      if (status.account.id !== this.currentUserAccount.id || preSetMentions.length === 0) {
        preSetMentions.push({
          acct: status.account.acct,
          id: status.account.id
        } as mastodonentities.Mention)
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
    > p {
      margin: 0;
      padding: 0;
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
</style>
