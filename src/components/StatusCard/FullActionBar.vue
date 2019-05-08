<template>
  <div class="full-action-bar">
    <div class="reply-input-area">
      <mu-avatar class="current-user-avatar" slot="avatar" size="24">
        <img :src="currentUserAccount.avatar">
      </mu-avatar>

      <div class="input-container">
        <cuckoo-input ref="cuckooInput" @submit="onSubmitReplyContent"
                      @esc="onTryHideFullReplyActionArea"
                      :shouldShowSpoilerTextInputArea="shouldShowSpoilerTextInputArea"
                      :spoilerText.sync="replySpoilerTextValue"
                      :text.sync="inputValue" :uploadProcesses.sync="uploadProcesses"
                      :presetAtAccounts="presetAtAccounts"
                      :placeholder="$t($i18nTags.statusCard.reply_to_main_status)"/>
      </div>

    </div>

    <div class="reply-action-area">
      <div class="left-area">
        <mu-button @click.stop="onSelectMediaFiles" :disabled="uploadProcesses.length === 4"
                   class="operate-btn add-image secondary-read-text-color" icon :title="$t($i18nTags.statusCard.add_photos)">
          <mu-icon class="reply-action-icon" value="camera_alt" />
          <input ref="fileInput" type="file" @change="onUploadMediaFiles"
                 accept=".jpg,.jpeg,.png,.gif,.webm,.mp4,.m4v,.mov,image/jpeg,image/png,image/gif,video/webm,video/mp4,video/quicktime"
                 style="display: none" multiple/>
        </mu-button>

        <mu-button ref="visibilityTriggerBtn" @click.stop="shouldOpenVisibilitySelectPopOver = true" class="operate-btn change-visibility secondary-read-text-color" icon :title="$t($i18nTags.statusCard.change_visibility)">
          <mu-icon class="reply-action-icon" :value="getVisibilityDescInfo(visibility).icon" />
        </mu-button>

        <mu-button v-if="uploadProcesses.length" @click.stop="markMediaAsSensitive = !markMediaAsSensitive"
                   class="operate-btn secondary-read-text-color" icon>
          <mu-icon class="reply-action-icon" :value="markMediaAsSensitive ? 'visibility_off' : 'visibility'" />
        </mu-button>

        <mu-button @click.stop="shouldShowSpoilerTextInputArea = !shouldShowSpoilerTextInputArea"
                   class="operate-btn" icon
                   :class="shouldShowSpoilerTextInputArea ? 'secondary-theme-text-color' : 'secondary-read-text-color'">
          <mu-icon class="reply-action-icon" value="add_alert" />
        </mu-button>

      </div>
      <div class="right-area">
        <mu-button flat class="operate-btn cancel"
                   color="secondary" @click.stop="hideFullReplyActionArea">{{$t($i18nTags.statusCard.cancel_post)}}</mu-button>
        <mu-button flat class="operate-btn submit secondary-theme-text-color" @click.stop="onSubmitReplyContent"
                   :disabled="!shouldEnableSubmitButton">{{$t($i18nTags.statusCard.submit_post)}}</mu-button>
      </div>
    </div>

    <visibility-select-pop-over :visibility.sync="visibility"
                                :open.sync="shouldOpenVisibilitySelectPopOver"
                                :trigger="visibilityTriggerBtn"/>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import { State, Action } from 'vuex-class'
  import { VisibilityTypes } from '@/constant'
  import { getVisibilityDescInfo } from '@/util'
  import VisibilitySelectPopOver from '@/components/VisibilitySelectPopOver'
  import Input from '@/components/Input'
  import { mastodonentities } from '@/interface'

  const maxUploadLength = 4

  @Component({
    components: {
      'cuckoo-input': Input,
      'visibility-select-pop-over': VisibilitySelectPopOver
    }
  })
  class FullActionBar extends Vue {

    $confirm

    $t

    $i18nTags

    $refs: {
      cuckooInput: Input
      replayTextInput: HTMLTextAreaElement
      fileInput: HTMLInputElement
      visibilityTriggerBtn: any
    }

    @Prop() status

    @Prop() value

    @Prop() replySpoilerText

    @Prop() currentReplyToStatus

    @Prop() descendantStatusList: Array<mastodonentities.Status>

    @Prop() droppedFiles: Array<File>

    @State('currentUserAccount') currentUserAccount

    @State('appStatus') appStatus

    @Action('postStatus') postStatus

    isConfirmDialogShowing: boolean = false

    postPrivacy_ = null

    get postPrivacy () {
      if (this.currentReplyToStatus.visibility === VisibilityTypes.DIRECT && !this.postPrivacy_) {
        return VisibilityTypes.DIRECT
      }

      return this.postPrivacy_
    }

    set postPrivacy (val) {
      this.postPrivacy_ = val
    }

    postMediaAsSensitiveMode: boolean = null

    shouldShowSpoilerTextInputArea: boolean = null

    get visibility () {
      return this.postPrivacy || this.appStatus.settings.postPrivacy
    }

    set visibility (val) {
      this.postPrivacy = val
    }

    get markMediaAsSensitive () {
      return typeof this.postMediaAsSensitiveMode === 'boolean' ? this.postMediaAsSensitiveMode :
        this.appStatus.settings.postMediaAsSensitiveMode
    }

    set markMediaAsSensitive (val) {
      this.postMediaAsSensitiveMode = val
    }

    shouldOpenVisibilitySelectPopOver = false

    uploadProcesses: Array<{
      file: File,
      hasStartedUpload: boolean,
      uploadResult: mastodonentities.Attachment
    }> = []

    visibilityTriggerBtn: any = null

    getVisibilityDescInfo = getVisibilityDescInfo

    get shouldEnableSubmitButton () {
      const isInUploadProcess = this.uploadProcesses.every(i => !i.uploadResult)

      return this.uploadProcesses.length ? !isInUploadProcess : this.inputValue
    }

    get inputValue () {
      return this.value
    }

    set inputValue (val) {
      this.$emit('update:value', val)
    }

    get replySpoilerTextValue () {
      return this.replySpoilerText
    }

    set replySpoilerTextValue (val) {
      this.$emit('update:replySpoilerText', val)
    }

    get presetAtAccounts (): Array<mastodonentities.Account> {
      const result: Array<mastodonentities.Account> = [];
      [this.status, ...this.descendantStatusList].forEach(status => {
        if (!result.find(acc => acc.id === status.account.id)) {
          result.push(status.account)
        }
      })
      return result
    }

    mounted () {
      this.visibilityTriggerBtn = this.$refs.visibilityTriggerBtn.$el
      this.$refs.cuckooInput.focus()
      this.$refs.cuckooInput.updateSize()
      this.prepareDroppedFiles()
    }

    @Watch('droppedFiles')
    onDropFiles () {
      this.prepareDroppedFiles()
    }

    async onSubmitReplyContent () {
      if (!this.shouldEnableSubmitButton) return

      const currentReplyToStatus = this.currentReplyToStatus

      this.$emit('loadingStart')

      await this.postStatus({
        mainStatusId: this.status.id,
        formData: {
          status: this.value,
          spoilerText: this.shouldShowSpoilerTextInputArea ? this.replySpoilerText : '',
          inReplyToId: currentReplyToStatus.id,
          visibility: this.visibility,
          sensitive: this.postMediaAsSensitiveMode,
          mediaIds: this.uploadProcesses.map(info => info.uploadResult.id)
        }
      })

      this.$emit('loadingEnd')

      this.$emit('replySuccess')

      this.hideFullReplyActionArea()
    }

    onSelectMediaFiles () {
      this.$refs.fileInput.click()
    }

    onUploadMediaFiles () {
      Array.from(this.$refs.fileInput.files)
        .splice(0, maxUploadLength - this.uploadProcesses.length)
        .forEach(file => {
          this.uploadProcesses.push({
            file, hasStartedUpload: false, uploadResult: null
          })
        })

      this.$refs.fileInput.value = ''
    }

    prepareDroppedFiles () {
      if (!this.droppedFiles || !this.droppedFiles.length) return

      const filesToUpload = [...this.droppedFiles].splice(0, maxUploadLength - this.uploadProcesses.length)

      // todo show notification toast
      if (!filesToUpload.length) return

      filesToUpload.forEach(file => {
        this.uploadProcesses.push({
          file, hasStartedUpload: false, uploadResult: null
        })
      })
    }

    hideFullReplyActionArea () {
      this.uploadProcesses = []
      this.shouldShowSpoilerTextInputArea = false
      this.$emit('hide')
    }

    async onTryHideFullReplyActionArea () {
      if (this.isConfirmDialogShowing) return

      if (this.inputValue || this.replySpoilerTextValue || this.uploadProcesses.length) {
        this.isConfirmDialogShowing = true

        const doHideFullReplyActionArea = (await this.$confirm(this.$t(this.$i18nTags.postStatusDialog.do_discard_message_confirm), {
          okLabel: this.$t(this.$i18nTags.postStatusDialog.do_discard_message),
          cancelLabel: this.$t(this.$i18nTags.postStatusDialog.do_keep_message),
        })).result
        if (doHideFullReplyActionArea) {
          this.hideFullReplyActionArea()
        } else {
          this.$refs.cuckooInput.focus()
        }

        this.isConfirmDialogShowing = false
      } else {
        this.hideFullReplyActionArea()
      }
    }
  }

  export default FullActionBar
</script>

<style lang="less" scoped>
  .full-action-bar {
    padding: 12px 16px 0 16px;

    .reply-input-area {
      display: flex;

      .current-user-avatar {
        margin-top: 6px;
      }

      .input-container {
        width: 100%;
        display: flex;
        align-items: center;
        flex-grow: 1;
        margin-left: 16px;
        padding: 9px 12px 8px 0;
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
</style>

<style lang="less">
  .full-action-bar {
    .auto-size-text-area {
      height: 18px;
    }
  }
</style>
