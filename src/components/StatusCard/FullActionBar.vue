<template>
  <div class="full-action-bar" v-show="show">
    <div class="reply-input-area">
      <mu-avatar class="current-user-avatar" slot="avatar" size="24">
        <img :src="currentUserAccount.avatar_static">
      </mu-avatar>

      <div class="input-container">
        <cuckoo-input ref="cuckooInput" @submit="onSubmitReplyContent"
                      :text.sync="inputValue" :uploadProcesses.sync="uploadProcesses"
                      :presetAtAccounts="presetAtAccounts"
                      :placeholder="$t($i18nTags.statusCard.reply_to_main_status)"/>
      </div>

    </div>

    <div class="reply-action-area">
      <div class="left-area">
        <mu-button @click="onSelectMediaFiles" :disabled="uploadProcesses.length === 4"
                   class="operate-btn add-image secondary-read-text-color" icon>
          <mu-icon class="reply-action-icon" value="camera_alt" />
          <input ref="fileInput" type="file" @change="onUploadMediaFiles"
                 accept=".jpg,.jpeg,.png,.gif,.webm,.mp4,.m4v,.mov,image/jpeg,image/png,image/gif,video/webm,video/mp4,video/quicktime"
                 style="display: none" multiple/>
        </mu-button>
        <mu-button ref="visibilityTriggerBtn" @click="shouldOpenVisibilitySelectPopOver = true" class="operate-btn change-visibility secondary-read-text-color" icon>
          <mu-icon class="reply-action-icon" :value="getVisibilityDescInfo(replyVisibility).icon" />
        </mu-button>
      </div>
      <div class="right-area">
        <mu-button flat class="operate-btn cancel"
                   color="secondary" @click="hideFullReplyActionArea">{{$t($i18nTags.statusCard.cancel_post)}}</mu-button>
        <mu-button flat class="operate-btn submit secondary-theme-text-color" @click="onSubmitReplyContent"
                   :disabled="!shouldEnableSubmitButton">{{$t($i18nTags.statusCard.submit_post)}}</mu-button>
      </div>
    </div>

    <visibility-select-pop-over :visibility.sync="replyVisibility"
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

  @Component({
    components: {
      'cuckoo-input': Input,
      'visibility-select-pop-over': VisibilitySelectPopOver
    }
  })
  class FullActionBar extends Vue {

    $refs: {
      cuckooInput: Input
      replayTextInput: HTMLTextAreaElement
      fileInput: HTMLInputElement
      visibilityTriggerBtn: any
    }

    @Prop() status

    @Prop() show

    @Prop() value

    @Prop() currentReplyToStatus

    @Prop() descendantStatusList: Array<mastodonentities.Status>

    @State('currentUserAccount') currentUserAccount

    @Action('postStatus') postStatus

    replyVisibility = VisibilityTypes.PUBLIC

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
    }

    @Watch('show')
    onShowFullActionBar (val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.cuckooInput.focus()
          this.$refs.cuckooInput.updateSize()
        })
      }
    }

    async onSubmitReplyContent () {
      if (!this.shouldEnableSubmitButton) return

      const currentReplyToStatus = this.currentReplyToStatus

      this.$emit('loadingStart')

      await this.postStatus({
        mainStatusId: this.status.id,
        formData: {
          status: this.value,
          inReplyToId: currentReplyToStatus.id,
          visibility: this.replyVisibility,
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

    hideFullReplyActionArea () {
      this.uploadProcesses = []
      this.$emit('hide')
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
