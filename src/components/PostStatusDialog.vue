<template>
  <mu-dialog dialog-class="post-status-dialog-container"
             :open.sync="isDialogOpening" overlay-color="rgba(0,0,0,0.12)"
             :overlay-opacity="1" @close="onTryCloseDialog" :transition="transition"
             :width="dialogWidth" :fullscreen="isFullScreen" v-loading="isPostLoading">

    <mu-appbar v-if="isFullScreen" class="dialog-fullscreen-bar" color="primary">
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
          <img :src="currentUserAccount.avatar_static">
        </mu-avatar>
        <div class="user-and-status-info">
          <a class="user-name primary-read-text-color" v-html="formatAccountDisplayName(currentUserAccount)"></a>
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
          <mu-button icon>
            <mu-icon class="secondary-read-text-color" value="link" />
          </mu-button>
        </div>
      </div>
    </section>

    <footer v-if="!isFullScreen">
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
  import { getVisibilityDescInfo, formatAccountDisplayName } from '@/util'
  import VisibilitySelectPopOver from '@/components/VisibilitySelectPopOver'
  import Input from '@/components/Input'
  import { mastodonentities } from "../interface";

  const preViewAreaHeight = 212

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

    getVisibilityDescInfo = getVisibilityDescInfo

    formatAccountDisplayName = formatAccountDisplayName

    visibility: string = VisibilityTypes.PUBLIC

    visibilityTriggerBtn: HTMLDivElement = null

    shouldOpenVisibilitySelectPopOver = false

    isPostLoading: boolean = false

    uploadProcesses: Array<{
      file: File,
      hasStartedUpload: boolean,
      uploadResult: mastodonentities.Attachment
    }> = []

    textContentValue: string = ''

    @Prop() open: boolean

    @Prop() close: Function

    @State('appStatus') appStatus

    @State('currentUserAccount') currentUserAccount

    @Action('postStatus') postStatus

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
        })
      } else {
        this.setVisibilitySelectPopOverDisplay(false)
      }
    }

    get dialogWidth () {
      return this.appStatus.documentWidth > UiWidthCheckConstants.POST_STATUS_DIALOG_TOGGLE_WIDTH
        ? UiWidthCheckConstants.POST_STATUS_DIALOG_TOGGLE_WIDTH : null
    }

    get isFullScreen () {
      return this.appStatus.documentWidth <= UiWidthCheckConstants.POST_STATUS_DIALOG_TOGGLE_WIDTH
    }

    get transition () {
      return this.isFullScreen ? 'slide-bottom' : 'slide-top'
    }

    async onTryCloseDialog () {
      if (this.textContentValue || this.uploadProcesses.length) {
        const doCloseDialog = (await this.$confirm(this.$t(this.$i18nTags.postStatusDialog.do_discard_message_confirm), {
          okLabel: this.$t(this.$i18nTags.postStatusDialog.do_discard_message),
          cancelLabel: this.$t(this.$i18nTags.postStatusDialog.do_keep_message),
        })).result
        if (doCloseDialog) {
          this.closeDialog()
        }
      } else {
        this.closeDialog()
      }
    }

    async onSubmitNewStatus () {
      if (!this.shouldEnableSubmitButton) return

      const formData = {
        status: this.textContentValue,
        visibility: this.visibility,
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
      const maxUploadLength = 4

      Array.from(this.$refs.fileInput.files)
        .splice(0, maxUploadLength - this.uploadProcesses.length)
        .forEach(async (file) => {
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
      this.uploadProcesses = []
      this.$emit('update:open', false)
    }
  }

  export default PostStatusDialog
</script>

<style lang="less" scoped>
  @import "../assets/variable";

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
        height: calc(100vh - 56px - 72px);
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
      @media (max-width: 530px) {
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
    }
  }

  .mu-item-wrapper {
    &:hover {

    }
  }

</style>
