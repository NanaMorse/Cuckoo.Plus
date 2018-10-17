<template>
  <div class="media-panel-container" v-if="hasMediaInfo">

    <div class="single-media-area pixiv-card-area" v-if="pixivCards.length">
      <img :src="pixivCards[0].image_url"/>
    </div>

    <div class="single-media-area" v-if="mediaList.length === 1">
      <img v-if="isSameMediaType(mediaList[0].type, mediaTypes.IMAGE)"
           :src="mediaList[0].url"/>

      <div class="gifv-container" v-if="isSameMediaType(mediaList[0].type, mediaTypes.GIFV)">
        <video autoplay loop :src="mediaList[0].url" />
      </div>
    </div>

    <div class="multi-media-area" v-if="mediaList.length > 1">
      <div class="media-gallery-item" v-for="(media, index) in mediaList">
        <img v-if="isSameMediaType(media.type, mediaTypes.IMAGE)"
             :src="media.url" :key="index"/>

        <div class="gifv-container" v-if="isSameMediaType(media.type, mediaTypes.GIFV)">
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

    @Prop({ default: () => [] }) mediaList?: Array<mastodonentities.Attachment>

    @Prop({ default: () => [] }) pixivCards?: Array<{ url: string, image_url: string }>

    mediaTypes = AttachmentTypes

    get hasMediaInfo () {
      return (this.mediaList.length > 0) || (this.pixivCards.length > 0)
    }

    get singleMediaInfo () {
      const info = {
        imageUrl: '',
        clickUrl: ''
      }

      if (this.mediaList[0]) {
        info.imageUrl = this.mediaList[0].url
        info.clickUrl = this.mediaList[0].url
      }

      if (this.pixivCards[0]) {
        info.imageUrl = this.pixivCards[0].image_url
        info.clickUrl = this.pixivCards[0].url
      }

      // todo multi pixiv cards?
      return info
    }

    isSameMediaType (typeA: string, typeB: string) {
      return typeA === typeB
    }
  }

  export default MediaPanel
</script>

<style lang="scss" scoped>
  .media-panel-container {

    img, video {
      display: block;
      cursor: zoom-in;
    }

    .single-media-area img {
      width: 100%;
      height: auto;
      cursor: zoom-in;
    }

    .multi-media-area{
      height: calc(50vh - 70px);
      display: flex;

      .media-gallery-item {
        width: 50%;
        height: 100%;

        > img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: 50% 20%;
        }

      }
    }

    .gifv-container {
      width: 100%;
      height: 100%;
      overflow: hidden;

      > video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
</style>
