<template>
  <div class="media-panel-container" v-if="combinedMediaList.length > 0">
    <div class="media-area" :class="mediaAreaClass">
      <div class="media-gallery-item" v-for="(media, index) in combinedMediaList">
        <img v-if="media.type === mediaTypes.IMAGE"
             :src="media.url" :key="index"/>

        <div class="gifv-container" v-if="media.type === mediaTypes.GIFV">
          <video autoplay :src="media.url" :key="index" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { AttachmentTypes } from '@/constant'
  import { mastodonentities } from '@/interface'

  @Component({})
  class MediaPanel extends Vue {

    @Prop() mediaList?: Array<mastodonentities.Attachment>

    @Prop() pixivCards?: Array<{ url: string, image_url: string }>

    get combinedMediaList () {
      const mediaListPart = this.mediaList.map(item => {
        return { url: item.url, clickUrl: item.url, type: item.type }
      })

      const pixivCardsPart = this.pixivCards.map(item => {
        return { url: item.image_url, clickUrl: item.url, type: this.mediaTypes.IMAGE }
      })

      return [...mediaListPart, ...pixivCardsPart]
    }

    get mediaAreaClass () {
      const mediaAreaClassList = [
        'one-media', 'two-medias', 'three-medias', 'four-medias'
      ]

      return mediaAreaClassList[this.combinedMediaList.length - 1]
    }

    mediaTypes = AttachmentTypes
  }

  export default MediaPanel
</script>

<style lang="less" scoped>
  .media-panel-container {

    img, video {
      display: block;
      cursor: zoom-in;
    }

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: 50% 20%;
    }

    .media-area {
      display: flex;
      justify-content: space-around;
    }

    .media-gallery-item {
      height: 100%;
      max-height: 1000px;
      overflow: hidden;
      border-radius: 4px;

      .gifv-container {
        width: 100%;
        height: 100%;

        > video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

    }

    .two-medias {

      .media-gallery-item {
        height: calc(50vh - 70px);
        width: calc(50% - 2px);
      }

    }

    .three-medias {
      flex-wrap: wrap;

      .media-gallery-item {
        height: calc(((100vw - 300px) / 2) - 100px);
        width: calc(50% - 2px);;

        &:first-child {
          width: 100%;
          margin-bottom: 2px;
        }
      }
    }

    .four-medias {
      .three-medias();

      .media-gallery-item {

        &:first-child {
          width: calc(50% - 2px);
        }
      }
    }
  }
</style>
