<template>
  <div class="media-panel-container" v-if="combinedMediaList.length > 0">
    <div class="media-area" ref="mediaArea" :style="mediaAreaScrollStyle"
         :class="{ 'single-media-area': combinedMediaList.length === 1 }">
      <place-holder-media-item class="media-item" v-for="(media, index) in combinedMediaList" :key="index"
                               @click.native="onMediaItemClick(index)" :holderStyle="getMediaSizeStyle(index)"
                               :url="media.url" :mediaType="media.type"
                               :shouldShowSensitiveCover.sync="shouldShowSensitiveCover"/>

      <div class="sensitive-alert-cover" v-show="shouldShowSensitiveCover" @click="shouldShowSensitiveCover = false">
        <p v-html="$t($i18nTags.statusCard.sensitive_media_alert)"></p>
      </div>
    </div>

    <mu-dialog class="light-box" transition="fade" ref="lightBox"
               @click.native.stop="onLightBoxClick"
               :open.sync="shouldShowLightBox" :overlay-opacity="0.7">
      <mu-icon class="close-icon" value="close" @click="shouldShowLightBox = false"/>
      <mu-carousel :cycle="false" :active="lightBoxActiveIndex" transition="fade"
                   @click.native.stop="onCarouselBackgroundClick"
                   :hide-indicators="(combinedMediaList.length === 1) || !shouldShowLightBoxControlBtn"
                   :hide-controls="(combinedMediaList.length === 1) || !shouldShowLightBoxControlBtn">
        <mu-carousel-item v-for="(mediaInfo, index) in combinedMediaList" :key="index">
          <div class="light-box-item" @click.stop="onLightBoxMediaItemClick">
            <img v-if="mediaInfo.type === mediaTypes.IMAGE" :src="mediaInfo.url"/>
            <video v-if="mediaInfo.type === mediaTypes.GIFV || mediaInfo.type === mediaTypes.VIDEO"
                   controls :loop="mediaInfo.type === mediaTypes.GIFV" :src="mediaInfo.url"/>
          </div>
        </mu-carousel-item>
      </mu-carousel>
    </mu-dialog>

  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import { State } from 'vuex-class'
  import { AttachmentTypes, StatusCardTypes } from '@/constant'
  import { documentGlobalEventBus } from '@/util'
  import { mastodonentities } from '@/interface'
  import PlaceHolderMediaItem from './PlaceHolderMediaItem'
  import ImageMeta = mastodonentities.ImageMeta
  import GifvMeta = mastodonentities.GifvMeta

  let mediaPanelKeyDownEventListener

  @Component({
    components: {
      'place-holder-media-item': PlaceHolderMediaItem
    }
  })
  class MediaPanel extends Vue {

    $refs: {
      mediaArea: HTMLDivElement
      mediaPanelContainer: HTMLDivElement
      lightBox: {
        $el: HTMLDivElement
      }
    }

    @Prop() mediaList?: Array<mastodonentities.Attachment>

    @Prop({ default: () => [] }) pixivCards?: Array<{ url: string, image_url: string }>

    @Prop({ default: () => {} }) cardInfo: mastodonentities.Card

    @Prop() sensitive?: boolean

    @State('appStatus') appStatus

    manuallyShowSensitiveCover: boolean = null

    isMounted: boolean = false

    onLightBoxClick () { }

    get fixedPixivCards () {
      if (this.mediaList.length) {
        return []
      }

      return this.pixivCards
    }

    get fixedCardInfo () {
      if (this.mediaList.length ||
        this.fixedPixivCards.length) {
        return null
      }

      if (!this.cardInfo || (this.cardInfo.type !== StatusCardTypes.PHOTO)) {
        return null
      }

      return this.cardInfo
    }

    mounted () {
      this.isMounted = true
    }

    get mediaAreaWidth () {
      if (!this.isMounted) return null

      return this.$refs.mediaArea.clientWidth
    }

    get mediaAreaScrollStyle () {
      if (this.shouldShowSensitiveCover) {
        return {
          overflow: 'hidden'
        }
      } else {
        return null
      }
    }

    //
    getMediaSizeStyle (mediaIndex: number) {
      if (!this.isMounted) return {}

      if (this.combinedMediaList.length === 1) {

        let aspect: number = 1

        // for normal media list
        if (this.mediaList.length === 1) {

          if (!this.mediaList[0].meta) return {}

          const mediaType = this.mediaList[0].type

          if (mediaType === AttachmentTypes.IMAGE) {
            aspect = (this.mediaList[0].meta as ImageMeta).original.aspect
          }

          else if (mediaType === AttachmentTypes.VIDEO || mediaType === AttachmentTypes.GIFV) {
            const originInfo = (this.mediaList[0].meta as GifvMeta).original
            aspect = originInfo.width / originInfo.height
          }
        }

        // for pixiv cards and photo type card info
        if (this.fixedPixivCards.length === 1) {
          // pixiv cards media size is 1050 * 550 by now
          aspect = 1050 / 550
        }

        if (this.fixedCardInfo) {
          aspect = this.fixedCardInfo.width / this.fixedCardInfo.height
        }

        return { height: `${this.mediaAreaWidth / aspect}px` }
      } else if (this.combinedMediaList.length > 1) {

        if (!this.mediaList[mediaIndex].meta) return {}

        // multi media's height was static by now
        const height = 212

        return { width: `${height * (this.mediaList[mediaIndex].meta as ImageMeta).original.aspect}px` }
      }

      return {}
    }

    get shouldShowSensitiveCover () {
      if (typeof this.manuallyShowSensitiveCover === 'boolean') {
        return this.manuallyShowSensitiveCover
      }

      if (this.appStatus.settings.showSensitiveContentMode) return false

      return this.sensitive
    }

    set shouldShowSensitiveCover (val) {
      this.manuallyShowSensitiveCover = val
      this.$refs.mediaArea.scrollTo(0, 0)
    }

    get combinedMediaList () {
      const mediaListPart = this.mediaList.map(item => {
        const url = item.url || item.remote_url

        let type: string = item.type

        if (type === AttachmentTypes.UNKNOWN) {
          type = url.endsWith('.mp4') ? AttachmentTypes.GIFV : AttachmentTypes.IMAGE
        }

        return { url, type, previewUrl: item.preview_url }
      })

      const pixivCardsPart = this.fixedPixivCards.map(item => {
        return { url: item.image_url, type: this.mediaTypes.IMAGE }
      })

      const photoCardPart = []
      if (this.fixedCardInfo) {
        photoCardPart.push({
          url: this.fixedCardInfo.image,
          type: this.mediaTypes.IMAGE
        })
      }

      return [...mediaListPart, ...pixivCardsPart, ...photoCardPart]
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

    @Watch('shouldShowLightBox')
    onLightBoxStatusChanged () {
      if (this.shouldShowLightBox) {
        mediaPanelKeyDownEventListener = e => this.onMediaPanelKeyDown(e)
        documentGlobalEventBus.on('keydown', mediaPanelKeyDownEventListener)
      } else {
        documentGlobalEventBus.off('keydown', mediaPanelKeyDownEventListener)
      }
    }

    onMediaItemClick (mediaItemIndex: number) {
      this.shouldShowLightBox = true
      this.lightBoxActiveIndex = mediaItemIndex
    }

    onMediaPanelKeyDown (e) {
      e.stopPropagation()
      e.preventDefault()

      switch (e.key) {
        case 'h': {
          if (this.lightBoxActiveIndex === 0) {
            this.lightBoxActiveIndex = this.combinedMediaList.length - 1
          } else {
            this.lightBoxActiveIndex --
          }
          break
        }

        case 'l': {
          if (this.lightBoxActiveIndex === this.combinedMediaList.length - 1) {
            this.lightBoxActiveIndex = 0
          } else {
            this.lightBoxActiveIndex ++
          }
          break
        }
      }
    }

    onCarouselBackgroundClick (e) {
      if (e.target.className === 'mu-carousel-item') {
        this.shouldShowLightBox = false
      }
    }

    onLightBoxMediaItemClick () {
      this.shouldShowLightBoxControlBtn = !this.shouldShowLightBoxControlBtn
    }
  }

  export default MediaPanel
</script>

<style lang="less" scoped>
  .media-panel-container {

    .media-area {
      position: relative;

      &.single-media-area {
        width: 100%;
        height: auto;
        padding-left: 0;

      }

      .sensitive-alert-cover {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        background: rgba(0,0,0,0.2);
        color: #fff;
        font-weight: 700;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }

  }
</style>

<style lang="less">
  .media-panel-container {
    img, video {
      display: block;
      cursor: zoom-in;
      filter: blur(0);

      &.sensitive-hide {
        filter: blur(20px);
      }

      -webkit-transition: filter 200ms;
      -moz-transition: filter 200ms;
      -ms-transition: filter 200ms;
      -o-transition: filter 200ms;
      transition: filter 200ms;
    }
  }

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
