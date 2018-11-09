<template>
  <div class="media-panel-container" v-if="combinedMediaList.length > 0">
    <div class="media-area" :class="mediaAreaClass">
      <div class="media-gallery-item" v-for="(media, index) in combinedMediaList"
           @click="onMediaItemClick(index)">
        <img v-if="media.type === mediaTypes.IMAGE"
             :src="media.url" :key="index"/>

        <div class="gifv-container" v-if="media.type === mediaTypes.GIFV">
          <video autoplay loop :src="media.url" :key="index" />
        </div>

        <mu-button class="hide-sensitive-btn" v-if="sensitive" @click.stop="shouldShowSensitiveCover = true">
          <mu-icon value="visibility_off"/>
        </mu-button>
      </div>

      <div class="sensitive-alert-cover" v-if="sensitive" v-show="shouldShowSensitiveCover" @click="shouldShowSensitiveCover = false">
        <p>敏感内容 <br/> 点击显示</p>
      </div>
    </div>

    <mu-dialog class="light-box" transition="fade"
               :open.sync="shouldShowLightBox" :overlay-opacity="0.7">
      <mu-icon class="close-icon" value="close" @click="shouldShowLightBox = false"/>
      <mu-carousel :cycle="false" :active="lightBoxActiveIndex" transition="fade"
                   :hide-indicators="(combinedMediaList.length === 1) || !shouldShowLightBoxControlBtn"
                   :hide-controls="(combinedMediaList.length === 1) || !shouldShowLightBoxControlBtn">
        <mu-carousel-item v-for="(mediaInfo, index) in combinedMediaList" :key="index">
          <div class="light-box-item" @click.stop="onLightBoxMediaItemClick">
            <img v-if="mediaInfo.type === mediaTypes.IMAGE" :src="mediaInfo.url"/>
            <video v-if="mediaInfo.type === mediaTypes.GIFV" autoplay loop :src="mediaInfo.url"/>
          </div>
        </mu-carousel-item>
      </mu-carousel>
    </mu-dialog>

  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import { AttachmentTypes } from '@/constant'
  import { mastodonentities } from '@/interface'

  @Component({})
  class MediaPanel extends Vue {

    @Prop() mediaList?: Array<mastodonentities.Attachment>

    @Prop({ default: () => [] }) pixivCards?: Array<{ url: string, image_url: string }>

    @Prop() sensitive?: boolean

    shouldShowSensitiveCover: boolean = true

    isImageType (type: string) {
      return type === AttachmentTypes.IMAGE || type === AttachmentTypes.UNKNOWN
    }

    get combinedMediaList () {
      const mediaListPart = this.mediaList.map(item => {
        const url = item.remote_url || item.url

        let type: any = item.type

        if (type === AttachmentTypes.UNKNOWN) {
          type = url.endsWith('.mp4') ? AttachmentTypes.GIFV : AttachmentTypes.IMAGE
        }

        return { url, type }
      })

      const pixivCardsPart = this.pixivCards.map(item => {
        return { url: item.image_url, type: this.mediaTypes.IMAGE }
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

    @Watch('$route')
    onRouteChanged () {
      this.shouldShowLightBox = false
    }

    onMediaItemClick (mediaItemIndex: number) {
      this.shouldShowLightBox = true
      this.lightBoxActiveIndex = mediaItemIndex
      // vue会帮忙处理this指向？
      document.addEventListener('click', this.onLightBoxClick)
    }

    onLightBoxMediaItemClick () {
      this.shouldShowLightBoxControlBtn = !this.shouldShowLightBoxControlBtn
    }

    onLightBoxClick (e) {
      if (e.target && (e.target.className === 'mu-carousel-item')) {
        this.shouldShowLightBox = false
        document.removeEventListener('click', this.onLightBoxClick)
      }
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
      position: relative;
      justify-content: space-around;

      .sensitive-alert-cover {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        background-color: #000;
        color: #606984;
        font-weight: 700;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }

    .media-gallery-item {
      height: 100%;
      max-height: 1000px;
      overflow: hidden;
      border-radius: 4px;
      position: relative;

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

  }
</style>

<style lang="less">
  .hide-sensitive-btn {
    position: absolute;
    left: 6px;
    top: 6px;
    background-color: rgba(0,0,0,.6);
    min-width: unset;
    height: auto;
    color: hsla(0,0%,100%,.7);

    &:hover {
      background-color: rgba(0,0,0,.9);
    }

    .mu-button-wrapper {
      padding: 0;
    }
  }

  .light-box {
    .mu-dialog {
      background-color: transparent;
      max-width: unset;

      .close-icon {
        font-size: 46px;
        position: fixed;
        z-index: 1;
        right: 20px;
        top: 20px;
        cursor: pointer;
        color: #fff;
      }

      .mu-dialog-body {
        padding: 0;
        width: 100vw;
        height: 100vh;

        .mu-carousel {
          height: 100%;

          .mu-carousel-item {
            display: flex;
            align-items: center;
            justify-content: center;

            .light-box-item {
              img {
                max-width: 100vw;
                max-height: 80vh;
                width: auto;
                height: auto;
              }
            }
          }
        }
      }
    }
  }
</style>
