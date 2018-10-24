<template>
  <div class="media-panel-container" v-if="combinedMediaList.length > 0">
    <div class="media-area" :class="mediaAreaClass">
      <div class="media-gallery-item" v-for="(media, index) in combinedMediaList"
           @click="onMediaItemClick(index)">
        <img v-if="media.type === mediaTypes.IMAGE"
             :src="media.url" :key="index"/>

        <div class="gifv-container" v-if="media.type === mediaTypes.GIFV">
          <video autoplay :src="media.url" :key="index" />
        </div>
      </div>
    </div>

    <div class="light-box" v-if="shouldShowLightBox">
      <mu-carousel :cycle="false" :active="lightBoxActiveIndex"
                   :hide-indicators="!shouldShowLightBoxControlBtn"
                   :hide-controls="!shouldShowLightBoxControlBtn">
        <mu-carousel-item v-for="(mediaInfo, index) in combinedMediaList" :key="index">
          <div class="light-box-item" @click.stop="onLightBoxMediaItemClick">
            <img v-if="mediaInfo.type === mediaTypes.IMAGE" :src="mediaInfo.url"/>
          </div>
        </mu-carousel-item>
      </mu-carousel>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import { AttachmentTypes } from '@/constant'
  import { mastodonentities } from '@/interface'

  @Component({})
  class MediaPanel extends Vue {

    @Prop() mediaList?: Array<mastodonentities.Attachment>

    @Prop() pixivCards?: Array<{ url: string, image_url: string }>

    get combinedMediaList () {
      const mediaListPart = this.mediaList.map(item => {
        return { url: item.url, originUrl: item.url, type: item.type }
      })

      const pixivCardsPart = this.pixivCards.map(item => {
        return { url: item.image_url, originUrl: item.url, type: this.mediaTypes.IMAGE }
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

    shouldShowLightBox: boolean = false

    shouldShowLightBoxControlBtn: boolean = true

    lightBoxActiveIndex: number = 0

    onMediaItemClick (mediaItemIndex: number) {
      //this.lightBoxActiveIndex = mediaItemIndex
      //this.shouldShowLightBox = true
    }

    onLightBoxMediaItemClick () {
      this.shouldShowLightBoxControlBtn = !this.shouldShowLightBoxControlBtn
    }

    // todo 或许应该用dialog来包裹light box
    onHideLightBox (e) {
      // console.log(e)
      //this.shouldShowLightBox = false
    }
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
        max-height: 350px;
        min-height: 260px;
        width: calc(50% - 2px);
      }

    }

    .three-medias {
      flex-wrap: wrap;

      .media-gallery-item {
        height: calc(((100vw - 300px) / 2) - 100px);
        max-height: 270px;
        min-height: 140px;
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

    .light-box {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 201412245;
      background-color: rgba(0,0,0,.7);

      .light-box-item {
        img {
          height: auto;
        }
      }
    }
  }
</style>

<style lang="less">
  .light-box {
    .mu-carousel {
      height: 100%;

      .mu-carousel-item {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
