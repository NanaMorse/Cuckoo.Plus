<template>
  <div class="full-action-bar" v-show="show">
    <div class="reply-input-area">
      <mu-avatar class="current-user-avatar" slot="avatar" size="24">
        <img :src="currentUserAccount.avatar_static">
      </mu-avatar>

      <div class="input-container">
              <textarea ref="replayTextInput" class="auto-size-text-area" v-model="inputValue"
                        @keydown.ctrl.enter="onSubmitReplyContent"
                        :placeholder="$t($i18nTags.statusCard.reply_to_main_status)"/>
      </div>

    </div>

    <div class="reply-action-area">
      <div class="left-area">
        <mu-button class="operate-btn add-image secondary-read-text-color" icon>
          <mu-icon class="reply-action-icon" value="local_see" />
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
  const autosize = require('autosize')
  import VisibilitySelectPopOver from '@/components/VisibilitySelectPopOver'

  @Component({
    components: {
      'visibility-select-pop-over': VisibilitySelectPopOver
    }
  })
  class FullActionBar extends Vue {

    $refs: {
      replayTextInput: HTMLTextAreaElement
      visibilityTriggerBtn: any
    }

    @Prop() status

    @Prop() show

    @Prop() value

    @Prop() currentReplyToStatus

    @State('currentUserAccount') currentUserAccount

    @Action('postStatus') postStatus

    replyVisibility = VisibilityTypes.PUBLIC

    shouldOpenVisibilitySelectPopOver = false

    visibilityTriggerBtn: any = null

    getVisibilityDescInfo = getVisibilityDescInfo

    get shouldEnableSubmitButton () {
      return this.value
    }

    get inputValue () {
      return this.value
    }

    set inputValue (val) {
      this.$emit('update:value', val)
    }

    mounted () {
      this.visibilityTriggerBtn = this.$refs.visibilityTriggerBtn.$el
      autosize(this.$refs.replayTextInput)
    }

    @Watch('show')
    onShowFullActionBar (val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.replayTextInput.focus()
          this.$refs.replayTextInput.dispatchEvent(new Event('autosize:update'))
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
          visibility: this.replyVisibility
        }
      })

      this.$emit('loadingEnd')

      this.$emit('replySuccess')

      this.hideFullReplyActionArea()
    }

    hideFullReplyActionArea () {
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
        display: flex;
        align-items: center;
        flex-grow: 1;
        margin-left: 16px;
        padding: 9px 12px 8px 0;

        .auto-size-text-area {
          height: 18px;
        }
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