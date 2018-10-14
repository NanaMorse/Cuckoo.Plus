<template>
  <mu-dialog dialog-class="post-status-dialog-container"
             :open.sync="isDialogOpening" overlay-color="rgba(0,0,0,0.12)"
             :overlay-opacity="1" @close="onTryCloseDialog" :transition="transition"
             :width="dialogWidth" :fullscreen="isFullScreen">

    <mu-appbar v-if="isFullScreen" class="dialog-fullscreen-bar" color="#db4437">
      <mu-button slot="left" icon @click="onTryCloseDialog">
        <mu-icon value="close"></mu-icon>
      </mu-button>
      <mu-button slot="right" flat :disabled="!shouldEnableSubmitButton">
        {{$t($i18nTags.statusCard.submit_post)}}
      </mu-button>
    </mu-appbar>

    <div class="dialog-header">
      <div class="left-area">
        <mu-avatar class="current-user-avatar" slot="avatar" size="40">
          <img :src="currentUserAccount.avatar_static">
        </mu-avatar>
        <div class="user-and-status-info">
          <a class="user-name">{{getAccountDisplayName(currentUserAccount)}}</a>
          <div class="visibility-row">
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
          <mu-icon class="common-icon" value="camera_alt" />
        </mu-button>
        <mu-button icon>
          <mu-icon class="common-icon" value="link" />
        </mu-button>
      </div>
    </section>

    <footer v-if="!isFullScreen">
      <mu-button class="dialog-button" flat :disabled="!shouldEnableSubmitButton">
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
  import { State, Getter } from 'vuex-class'
  const autosize = require('autosize')

  const dialogStyleToggleWidth = 530

  @Component({})
  class PostStatusDialog extends Vue {

    $refs: {
      textArea: HTMLTextAreaElement
    }

    textContentValue: string = ''

    mounted () {
      autosize(this.$refs.textArea)
    }

    @Prop() open: boolean

    @Prop() close: Function

    @State('currentUserAccount') currentUserAccount

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
      return document.body.clientWidth > dialogStyleToggleWidth ? dialogStyleToggleWidth : null
    }

    get isFullScreen () {
      return document.body.clientWidth <= dialogStyleToggleWidth
    }

    get transition () {
      return this.isFullScreen ? 'slide-bottom' : 'slide-top'
    }

    async onTryCloseDialog () {
      if (this.textContentValue) {
        // @ts-ignore todo i18n
        const doCloseDialog = (await this.$confirm('要舍弃这条信息吗？', '', {})).result
        if (doCloseDialog) {
          this.textContentValue = ''
          this.cancelPostStatus()
        }
      } else {
        this.cancelPostStatus()
      }
    }

    cancelPostStatus () {
      this.$emit('update:open', false)
    }
  }

  export default PostStatusDialog
</script>

<style lang="scss" scoped>
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
            color: $common_black_color;
          }

          .visibility-row {
            display: flex;
            align-items: center;
            color: $common_grey_color;

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

<style lang="scss">
  .post-status-dialog-container {
    border-radius: 4px;

    .mu-dialog-body {
      padding: 0;
    }
  }

</style>