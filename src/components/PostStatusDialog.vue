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
          <a class="user-name mu-primary-text-color">{{getAccountDisplayName(currentUserAccount)}}</a>
          <div class="visibility-row mu-secondary-text-color">
            <div class="arrow-container">
              <svg viewBox="0 0 48 48" height="100%" width="100%"><path fill="rgba(0, 0, 0, 0.54)" d="M20 14l10 10-10 10z"></path></svg>
            </div>
            <div class="visibility-info">公开</div>
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
      <textarea ref="textArea" class="common-auto-size-text-area" v-model="textContentValue"
                :placeholder="$t($i18nTags.statusCard.post_new_status_placeholder)"/>

      <div class="media-preview-area"></div>

      <div class="attachment-select-btn-group">
        <mu-button icon>
          <mu-icon class="mu-secondary-text-color" value="camera_alt" />
        </mu-button>
        <mu-button icon>
          <mu-icon class="mu-secondary-text-color" value="link" />
        </mu-button>
      </div>
    </section>

    <footer v-if="!isFullScreen">
      <mu-button class="dialog-button" :disabled="!shouldEnableSubmitButton"
                 color="primary"
                 @click="onSubmitNewStatus">
        {{$t($i18nTags.statusCard.submit_post)}}
      </mu-button>
      <mu-button class="dialog-button" flat @click="onTryCloseDialog">
        {{$t($i18nTags.statusCard.cancel_post)}}
      </mu-button>
    </footer>

  </mu-dialog>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import { State, Getter, Action } from 'vuex-class'
  import { UiWidthCheckConstants } from '@/constant'

  const autosize = require('autosize')

  const dialogStyleToggleWidth = 530

  @Component({})
  class PostStatusDialog extends Vue {

    $refs: {
      textArea: HTMLTextAreaElement
    }

    textContentValue: string = ''

    mounted () {
      // todo seems not working, why?
      autosize(this.$refs.textArea)
    }

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

    @Watch('isDialogOpening')
    onDialogOpenChanged (isOpening) {
      if (isOpening) {
        this.$nextTick(() => {
          this.$refs.textArea.focus()
        })
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
      if (this.textContentValue) {
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
        status: this.textContentValue
      }

      // @ts-ignore
      const loading = this.$loading({})

      await this.postStatus({ formData })

      loading.close()

      // clear data and close dialog
      this.closeDialog()
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
            color: #757575;
            font-size: 18px;
            margin-left: 10px;
          }
        }
      }
    }

    section {
      .common-auto-size-text-area {
        height: 187px;
        padding: 0 16px;
        background-color: #fff;
        max-height: 373px;

        @media (max-width: 530px) {
          height: calc(100vh - 56px - 72px - 48px);
          max-height: calc(100vh - 56px - 72px - 48px);
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

</style>
