<template>
  <mu-dialog dialog-class="post-status-dialog-container"
             :open.sync="isDialogOpening" overlay-color="rgba(0,0,0,0.12)"
             :overlay-opacity="1" @close="onTryCloseDialog" :transition="transition"
             :width="dialogWidth" :fullscreen="shouldDialogFullScreen" v-loading="isPostLoading">

    <mu-appbar v-if="shouldDialogFullScreen" class="dialog-fullscreen-bar" color="primary">
      <mu-button slot="left" icon @click="onTryCloseDialog">
        <mu-icon value="close"></mu-icon>
      </mu-button>
      <mu-button slot="right" flat :disabled="!shouldEnableSubmitButton"
                 @click="onSubmitNewStatus">
        {{$t($i18nTags.statusCard.submit_post)}}
      </mu-button>
    </mu-appbar>

    <div class="dialog-header">
      <div class="left-area">
        <mu-avatar class="current-user-avatar" slot="avatar" size="40">
          <img :src="currentUserAccount.avatar">
        </mu-avatar>
        <div class="user-and-status-info">
          <a class="user-name primary-read-text-color" v-html="currentUserAccount.display_name"></a>
          <div class="visibility-row">
            <div class="arrow-container">
              <svg viewBox="0 0 48 48" height="100%" width="100%">
                <path class="header-svg-fill" d="M20 14l10 10-10 10z" />
              </svg>
            </div>
            <div class="visibility-info secondary-theme-text-color" ref="visibilitySelectBtn"
                 @click="setVisibilitySelectPopOverDisplay(true)">
              {{$t(visibility)}}
              <mu-icon size="18" class="visibility-icon secondary-read-text-color" :value="getVisibilityDescInfo(visibility).icon"></mu-icon>
            </div>
            <visibility-select-pop-over :visibility.sync="visibility"
                                        :open.sync="shouldOpenVisibilitySelectPopOver"
                                        :trigger="visibilityTriggerBtn"/>
          </div>
        </div>
      </div>

      <div class="right-area">
        <div class="card-header-action">
          <mu-icon class="header-icon" value="more_vert" />
        </div>
      </div>
    </div>

    <section>

      <cuckoo-input ref="cuckooInput" @submit="onSubmitNewStatus"
                    @esc="onTryCloseDialog"
                    :shouldShowSpoilerTextInputArea="shouldShowSpoilerTextInputArea"
                    :spoilerText.sync="spoilerTextValue"
                    :text.sync="textContentValue" :uploadProcesses.sync="uploadProcesses"
                    :placeholder="$t($i18nTags.statusCard.post_new_status_placeholder)"/>

      <div class="bottom-area">

        <div class="attachment-select-btn-group">
          <mu-button icon @click="onSelectMediaFiles" :disabled="uploadProcesses.length === 4">
            <mu-icon class="secondary-read-text-color" value="camera_alt" />
            <input ref="fileInput" type="file" @change="onUploadMediaFiles"
                   accept=".jpg,.jpeg,.png,.gif,.webm,.mp4,.m4v,.mov,image/jpeg,image/png,image/gif,video/webm,video/mp4,video/quicktime"
                   style="display: none" multiple/>
          </mu-button>
          <!--<mu-button icon>-->
            <!--<mu-icon class="secondary-read-text-color" value="link" />-->
          <!--</mu-button>-->
          <mu-button v-if="uploadProcesses.length" @click="markMediaAsSensitive = !markMediaAsSensitive"
                     class="secondary-read-text-color" icon>
            <mu-icon :value="markMediaAsSensitive ? 'visibility_off' : 'visibility'" />
          </mu-button>

          <mu-button @click="shouldShowSpoilerTextInputArea = !shouldShowSpoilerTextInputArea"
                     class="operate-btn" icon
                     :class="shouldShowSpoilerTextInputArea ? 'secondary-theme-text-color' : 'secondary-read-text-color'">
            <mu-icon class="reply-action-icon" value="add_alert" />
          </mu-button>
        </div>

        <div class="content-length-indicator secondary-read-text-color">
          {{textContentValue.length}}/500
        </div>
      </div>
    </section>

    <footer v-if="!shouldDialogFullScreen">
      <mu-button class="dialog-button secondary-theme-text-color" flat :disabled="!shouldEnableSubmitButton"
                 @click="onSubmitNewStatus">
        {{$t($i18nTags.statusCard.submit_post)}}
      </mu-button>
      <mu-button class="dialog-button" color="secondary" flat @click="onTryCloseDialog">
        {{$t($i18nTags.statusCard.cancel_post)}}
      </mu-button>
    </footer>

  </mu-dialog>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import { State, Getter, Action } from 'vuex-class'
  import { UiWidthCheckConstants, VisibilityTypes } from '@/constant'
  import { getVisibilityDescInfo } from '@/util'
  import VisibilitySelectPopOver from '@/components/VisibilitySelectPopOver'
  import Input from '@/components/Input'
  import { mastodonentities } from "../interface";

  const maxUploadLength = 4

  class InjectDragAndDropEvents {

    private dialogComponent

    private beingDragOver: boolean = false

    constructor (dialogComponent: PostStatusDialog) {
      this.dialogComponent = dialogComponent

      this.dialogComponent.$el.addEventListener('dragenter', this.onDragOver.bind(this))
    }

    private insertDragOverLayer () {
      const layer = document.createElement('div')
      layer.className = 'mu-loading-wrap drag-over-layer'

      layer.innerText = this.dialogComponent.$t(this.dialogComponent.$i18nTags.common.drag_and_drop_to_upload)

      this.dialogComponent.$el.appendChild(layer)

      layer.addEventListener('dragover', e => e.preventDefault())
      layer.addEventListener('dragleave', this.onDragLeave.bind(this))
      layer.addEventListener('drop', this.onDrop.bind(this))
    }

    private removeDragOverLayer () {
      this.dialogComponent.$el.removeChild(this.dialogComponent.$el.querySelector('.drag-over-layer'))
    }

    private onDragOver (e: DragEvent) {
      e.preventDefault()

      if (!this.beingDragOver) {
        this.beingDragOver = true
        this.insertDragOverLayer()
      }
    }

    private onDragLeave (e: DragEvent) {
      e.preventDefault()

      if (this.beingDragOver) {
        this.beingDragOver = false
        this.removeDragOverLayer()
      }
    }

    private onDrop (e: DragEvent) {
      e.preventDefault()

      this.beingDragOver = false
      this.removeDragOverLayer()

      const filesToUpload = Array.from(e.dataTransfer.files)
        .splice(0, maxUploadLength - this.dialogComponent.uploadProcesses.length)

      if (filesToUpload.length === 0) return

      filesToUpload.forEach(file => {
        this.dialogComponent.uploadProcesses.push({
          file, hasStartedUpload: false, uploadResult: null
        })
      })
    }
  }

  @Component({
    components: {
      'cuckoo-input': Input,
      'visibility-select-pop-over': VisibilitySelectPopOver
    }
  })
  class PostStatusDialog extends Vue {

    $refs: {
      cuckooInput: Input
      textArea: HTMLTextAreaElement
      fileInput: HTMLInputElement
      visibilitySelectBtn: HTMLDivElement
    }

    $confirm

    $t

    $i18nTags

    $toast

    getVisibilityDescInfo = getVisibilityDescInfo

    isConfirmDialogShowing: boolean = false

    postPrivacy = null

    get visibility () {
      return this.postPrivacy || this.appStatus.settings.postPrivacy
    }

    set visibility (val) {
      this.postPrivacy = val
    }

    postMediaAsSensitiveMode: boolean = null

    get markMediaAsSensitive () {
      return typeof this.postMediaAsSensitiveMode === 'boolean' ? this.postMediaAsSensitiveMode :
        this.appStatus.settings.postMediaAsSensitiveMode
    }

    set markMediaAsSensitive (val) {
      this.postMediaAsSensitiveMode = val
    }

    visibilityTriggerBtn: HTMLDivElement = null

    shouldOpenVisibilitySelectPopOver = false

    isPostLoading: boolean = false

    uploadProcesses: Array<{
      file: File,
      hasStartedUpload: boolean,
      uploadResult: mastodonentities.Attachment
    }> = []

    textContentValue: string = ''

    shouldShowSpoilerTextInputArea: boolean = null

    spoilerTextValue: string = ''

    @Prop() open: boolean

    @Prop() close: Function

    @State('appStatus') appStatus

    @State('currentUserAccount') currentUserAccount

    @Action('postStatus') postStatus

    @Getter('shouldDialogFullScreen') shouldDialogFullScreen

    get isDialogOpening () {
      return this.open
    }

    set isDialogOpening (val) {}

    get shouldEnableSubmitButton () {
      const isInUploadProcess = this.uploadProcesses.every(i => !i.uploadResult)

      return this.uploadProcesses.length ? !isInUploadProcess : this.textContentValue
    }

    @Watch('isDialogOpening')
    onDialogOpenChanged (isOpening) {
      if (isOpening) {
        this.$nextTick(() => {
          this.visibilityTriggerBtn = this.$refs.visibilitySelectBtn
          this.$refs.cuckooInput.focus()

          new InjectDragAndDropEvents(this)
        })
      } else {
        this.setVisibilitySelectPopOverDisplay(false)
      }
    }

    get dialogWidth () {
      return this.shouldDialogFullScreen ? null : UiWidthCheckConstants.POST_STATUS_DIALOG_TOGGLE_WIDTH
    }

    get transition () {
      return this.shouldDialogFullScreen ? 'slide-bottom' : 'slide-top'
    }

    async onTryCloseDialog () {
      if (this.isConfirmDialogShowing) return

      if (this.textContentValue || this.spoilerTextValue || this.uploadProcesses.length) {
        this.isConfirmDialogShowing = true
        const doCloseDialog = (await this.$confirm(this.$t(this.$i18nTags.postStatusDialog.do_discard_message_confirm), {
          okLabel: this.$t(this.$i18nTags.postStatusDialog.do_discard_message),
          cancelLabel: this.$t(this.$i18nTags.postStatusDialog.do_keep_message),
        })).result
        if (doCloseDialog) {
          this.closeDialog()
        } else {
          this.$refs.cuckooInput.focus()
        }

        this.isConfirmDialogShowing = false
      } else {
        this.closeDialog()
      }
    }

    async onSubmitNewStatus () {
      if (!this.shouldEnableSubmitButton) return

      if (this.textContentValue.length > 500) {
        return this.$toast.error(this.$t(this.$i18nTags.postStatusDialog.text_character_limit_exceed))
      }

      const formData = {
        status: this.textContentValue,
        visibility: this.visibility,
        spoilerText: this.shouldShowSpoilerTextInputArea ? this.spoilerTextValue : '',
        sensitive: this.postMediaAsSensitiveMode,
        mediaIds: this.uploadProcesses.map(info => info.uploadResult.id)
      }

      this.isPostLoading = true

      await this.postStatus({ formData })

      this.isPostLoading = false

      // clear data and close dialog
      this.closeDialog()
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

    setVisibilitySelectPopOverDisplay (open: boolean) {
      this.shouldOpenVisibilitySelectPopOver = open
    }

    closeDialog () {
      this.textContentValue = ''
      this.$refs.fileInput.value = ''
      this.spoilerTextValue = ''
      this.shouldShowSpoilerTextInputArea = false
      this.uploadProcesses = []
      this.$emit('update:open', false)
    }
  }

  export default PostStatusDialog
</script>

<style lang="less" scoped>
  .post-status-dialog-container {

    .dialog-header {
      line-height: 1;
      display: flex;
      justify-content: space-between;
      padding: 16px 4px 8px 16px;

      .left-area {
        display: flex;
        align-items: center;

        .current-user-avatar {
          margin-right: 8px;
          cursor: pointer;
        }

        .user-and-status-info {
          display: flex;
          align-items: center;

          .user-name {
            cursor: pointer;
            font-size: 15px;
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
              display: flex;
              align-items: center;

              .visibility-icon {
                margin-left: 4px;
              }
            }
          }

        }

      }

      .right-area {
        display: flex;
        align-items: center;
        width: 48px;
        height: 48px;

        .card-header-action {
          .header-icon {
            cursor: pointer;
            font-size: 18px;
            margin-left: 10px;
          }
        }
      }
    }

    section {
      @media (max-width: 530px) {
        height: calc(100% - 56px - 72px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .auto-size-text-area {
          max-height: unset !important;
          flex-grow: 1;
        }
      }

      .auto-size-text-area {
        height: 187px;
        padding: 0 16px;
        max-height: 373px;
      }

      .bottom-area {
        display: flex;
        justify-content: space-between;

        .content-length-indicator {
          line-height: 48px;
          font-size: 16px;
          margin-right: 20px;
        }
      }

    }

    footer {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      height: 57px;

      .dialog-button {
        margin-right: 16px;
      }
    }
  }
</style>

<style lang="less">
  .post-status-dialog-container {
    border-radius: 4px;

    .mu-dialog-body {
      padding: 0;
    }

    section {

      .cuckoo-input-container {
        margin: 0 16px;
        width: auto;
      }

      @media (max-width: 530px) {
        .auto-size-text-area {
          max-height: unset !important;
          flex-grow: 1;
        }
      }

      .auto-size-text-area {
        height: 187px;
        max-height: 373px;
      }
    }
  }

  .mu-item-wrapper {
    &:hover {

    }
  }

</style>
