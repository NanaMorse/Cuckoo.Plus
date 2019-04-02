<template>
  <mu-card @click="onStampCardClick" class="post-status-stamp-card">
    <div class="left-area">
      <mu-avatar @click.stop="onCheckUserAccountPage" size="36">
        <img :src="currentUserAccount.avatar">
      </mu-avatar>

      <div class="post-new-status-hint placeholder-read-text-color">
        {{$t($i18nTags.timeLines.whats_new_with_you)}}
      </div>
    </div>

    <div class="right-area">
      <mu-button @click.stop="onUploadMedia" class="circle-btn unset-display" icon>
        <mu-icon class="camera-icon" value="camera_alt" />
      </mu-button>
    </div>
  </mu-card>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { State } from 'vuex-class'
  import { mastodonentities } from '@/interface'

  @Component({})
  class PostStatusStampCard extends Vue {

    @State('currentUserAccount') currentUserAccount: mastodonentities.AuthenticatedAccount

    onCheckUserAccountPage () {
      window.open(this.currentUserAccount.url, "_blank")
    }

    onStampCardClick () {
      this.$emit('click')
    }

    onUploadMedia () {

    }
  }

  export default PostStatusStampCard
</script>

<style lang="less" scoped>
  .post-status-stamp-card {
    width: 100%;
    height: 68px;
    opacity: 0;
    padding: 16px;
    cursor: pointer;

    display: flex;
    justify-content: space-between;

    .left-area {
      display: flex;
      justify-content: center;
      align-items: center;

      .post-new-status-hint {
        font-size: 16px;
        cursor: text;
        margin-left: 8px;
        flex-grow: 1;
      }
    }


    .circle-btn {
      margin: 0;

      .camera-icon {
        font-size: 18px;
      }
    }
  }
</style>
