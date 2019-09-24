<template>
  <div class="link-preview-panel-container" @click="onLinkPreviewPanelClick">
    <div class="content-area">
      <img v-if="cardInfo.image" class="preview-image" :src="cardInfo.image" :alt="cardInfo.title"/>
      <div class="text-area">
        <div class="link-preview-text primary-read-text-color">
          {{cardInfo.title}}
        </div>
        <div class="link-preview-text link-preview-description primary-read-text-color">
          {{cardInfo.description}}
        </div>
        <div class="link-preview-text link-preview-url secondary-read-text-color">
          {{cardInfo.url}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import {} from 'vuex-class'
  import { mastodonentities } from '@/interface'

  @Component({})
  class LinkPreviewPanel extends Vue {

    @Prop() cardInfo: mastodonentities.Card

    onLinkPreviewPanelClick () {
      window.open(this.cardInfo.url, "_blank")
    }
  }

  export default LinkPreviewPanel
</script>

<style lang="less" scoped>
  .link-preview-panel-container {
    cursor: pointer;

    .content-area {
      display: flex;
      align-items: center;

      .preview-image {
        width: 110px;
        height: 110px;
        margin-right: 16px;
        flex-shrink: 0;
      }

      .text-area {
        .link-preview-text {
          font-size: 20px;
          font-weight: 300;
          margin-bottom: 8px;
          line-height: 24px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          max-height: 48px;
        }

        .link-preview-description {
          font-size: 16px;
        }

        .link-preview-url {
          font-size: 12px;
        }
      }
    }
  }
</style>

<style lang="less">
  .full-reply-link-preview-area {
    .preview-image {
      width: 72px !important;
      height: 72px !important;
      margin-right: 12px !important;
    }

    .link-preview-text {
      font-size: 16px !important;
      margin-top: 8px !important;
      margin-bottom: 8px !important;
      line-height: 18px !important;
      max-height: 36px !important;
    }

    .link-preview-description {
      font-size: 12px !important;
    }

    .link-preview-url {
      font-size: 8px !important;
    }
  }
</style>
