<template>
  <mu-dialog dialog-class="post-status-dialog-container"
             :open.sync="isDialogOpening" overlay-color="rgba(0,0,0,0.12)"
             :overlay-opacity="1" @close="onTryCloseDialog" :transition="transition"
             :width="dialogWidth" :fullscreen="isFullScreen">

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
          <a class="user-name primary-read-text-color">
            {{getAccountDisplayName(currentUserAccount)}}
          </a>
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
      <textarea ref="textArea" class="auto-size-text-area" v-model="textContentValue"
                :placeholder="$t($i18nTags.statusCard.post_new_status_placeholder)"/>

      <div class="bottom-area">
        <div v-if="uploadProcessInfoList.length" class="media-preview-area" :class="{ 'single-upload-preview-area': uploadProcessInfoList.length === 1 }">
          <div class="media-item" :key="index"
               v-for="(processInfo, index) in uploadProcessInfoList">
            <div v-if="!processInfo.uploadSuccess" class="media-placeholder" v-loading="true"/>
            <img v-if="processInfo.uploadSuccess" :src="processInfo.uploadResult.url"/>
            <div class="remove-icon-wrapper">
              <svg height="24px" width="24px" viewBox="0 0 48 48"><circle fill="#fefefe" cx="24" cy="24" r="24"></circle><path fill="#000" d="M24,4C12.9,4,4,12.9,4,24s8.9,20,20,20s20-9,20-20S35,4,24,4z M34,31.2L31.2,34L24,26.8L16.8,34L14,31.2l7.2-7.2L14,16.8l2.8-2.8l7.2,7.2l7.2-7.2l2.8,2.8L26.8,24L34,31.2z"></path></svg>
            </div>
          </div>
        </div>

        <div class="attachment-select-btn-group">
          <mu-button icon @click="onSelectMediaFiles" :disabled="uploadProcessInfoList.length === 4">
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
  import { getVisibilityDescInfo } from '@/util'
  import VisibilitySelectPopOver from '@/components/VisibilitySelectPopOver'
  import * as Api from '@/api'
  import { mastodonentities } from "../interface";
  const autosize = require('autosize')

  let isFirstTimeOpenDialog = true

  const preViewAreaHeight = 212

  @Component({
    components: {
      'visibility-select-pop-over': VisibilitySelectPopOver
    }
  })
  class PostStatusDialog extends Vue {

    $refs: {
      textArea: HTMLTextAreaElement
      fileInput: HTMLInputElement
      visibilitySelectBtn: HTMLDivElement
    }

    getVisibilityDescInfo = getVisibilityDescInfo

    visibility: string = VisibilityTypes.PUBLIC

    visibilityTriggerBtn: HTMLDivElement = null

    shouldOpenVisibilitySelectPopOver = false

    uploadProcessInfoList: Array<{
      file: File,
      uploadSuccess: boolean,
      uploadResult: mastodonentities.Attachment
    }> = []

    textContentValue: string = ''

    @Prop() open: boolean

    @Prop() close: Function

    @State('appStatus') appStatus

    @State('currentUserAccount') currentUserAccount

    @Action('postStatus') postStatus

    @Getter('getAccountDisplayName') getAccountDisplayName

    get isDialogOpening () {
      return this.open
    }

    set isDialogOpening (val) {}

    get shouldEnableSubmitButton () {
      return this.textContentValue
    }

    getMediaItemStyle (resultInfo: mastodonentities.Attachment) {
      if (!resultInfo) return { width: 'auto' }

      return
    }

    @Watch('isDialogOpening')
    onDialogOpenChanged (isOpening) {
      if (isOpening) {
        this.$nextTick(() => {
          if (isFirstTimeOpenDialog) {
            autosize(this.$refs.textArea)
            isFirstTimeOpenDialog = false
          }
          this.visibilityTriggerBtn = this.$refs.visibilitySelectBtn
          this.$refs.textArea.focus()
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
      if (this.textContentValue || this.uploadProcessInfoList.length) {
        // @ts-ignore todo i18n
        const doCloseDialog = (await this.$confirm('要舍弃这条信息吗？', '', {})).result
        if (doCloseDialog) {
          this.closeDialog()
        }
      } else {
        this.closeDialog()
      }
    }

    async onSubmitNewStatus () {
      const formData = {
        status: this.textContentValue,
        visibility: this.visibility
      }

      // @ts-ignore
      const loading = this.$loading({})

      await this.postStatus({ formData })

      loading.close()

      // clear data and close dialog
      this.closeDialog()
    }

    onSelectMediaFiles () {
      this.$refs.fileInput.click()
    }

    onUploadMediaFiles () {
      const maxUploadLength = 4

      Array.from(this.$refs.fileInput.files)
        .splice(0, maxUploadLength - this.uploadProcessInfoList.length)
        .forEach(async (file) => {
          this.uploadProcessInfoList.push({
            file, uploadSuccess: false, uploadResult: null
          })

          const indexInProcessList = this.uploadProcessInfoList.length - 1

          const formData = new FormData()
          formData.append('file', file)

          try {
            const result = await Api.media.postMediaFile(formData)

            this.uploadProcessInfoList[indexInProcessList].uploadSuccess = true
            this.uploadProcessInfoList[indexInProcessList].uploadResult = result.data

          } catch (e) {

          }

        })

    }

    setVisibilitySelectPopOverDisplay (open: boolean) {
      this.shouldOpenVisibilitySelectPopOver = open
    }

    closeDialog () {
      this.textContentValue = ''
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

      .media-preview-area {
        height: 212px;
        display: flex;
        overflow-x: scroll;
        overflow-y: hidden;
        padding: 0 16px;

        &.single-upload-preview-area {
          .media-item {
            margin: 0;
            width: 100%;
            display: flex;
            justify-content: center;
          }
        }

        .media-item {
          margin-right: 8px;
          position: relative;
          object-fit: contain;

          .media-placeholder {
            width: 212px;
            position: relative;
            height: 100%;
          }

          img {
            width: auto;
            height: 100%;
            display: block;
          }

          .remove-icon-wrapper {
            cursor: pointer;
            position: absolute;
            right: 12px;
            top: 12px;
          }
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
  }

  .mu-item-wrapper {
    &:hover {

    }
  }

</style>
