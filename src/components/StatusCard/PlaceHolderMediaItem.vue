<template>
  <div class="placeholder-media-item-container" :style="placeHolderItemStyle">

    <div class="placeholder-area" v-if="!showSensitiveCover && !isMediaLoaded">
      <mu-icon class="status-icon" :value="placeHolderStatusIconValue"/>
    </div>

    <img v-show="isMediaLoaded" v-if="(mediaType === mediaTypes.IMAGE)"
         :class="[showSensitiveCover && 'sensitive-hide']"
         :src="url" @load="onMediaContentLoaded" @error="onMediaContentLoadFailed"/>

    <div class="gifv-container" v-show="isMediaLoaded" v-if="mediaType === mediaTypes.GIFV || mediaType === mediaTypes.VIDEO">
      <video width="100%" controls :loop="mediaType === mediaTypes.GIFV"
             :class="[showSensitiveCover && 'sensitive-hide']"
             :src="url" @loadstart="onMediaContentLoaded" @error="onMediaContentLoadFailed"/>
    </div>

    <mu-button class="hide-sensitive-btn" v-show="!showSensitiveCover && isMediaLoaded" @click.stop="onShowSensitiveCover">
      <mu-icon value="visibility_off"/>
    </mu-button>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { AttachmentTypes } from '@/constant'

  @Component({})
  class PlaceHolderMediaItem extends Vue {

    @Prop() url: string

    @Prop() mediaType: string

    @Prop() shouldShowSensitiveCover: boolean

    @Prop() holderStyle

    get showSensitiveCover () {
      return this.shouldShowSensitiveCover
    }

    get placeHolderItemStyle () {
      return this.isMediaLoaded ? null : this.holderStyle
    }

    get placeHolderStatusIconValue () {
      return this.isMediaLoadFailed ? 'broken_image' : this.mediaType === AttachmentTypes.IMAGE ? 'photo' : 'videocam'
    }

    get isVideo () {
      return null
    }

    mediaTypes = AttachmentTypes

    isMediaLoaded = false

    isMediaLoadFailed = false

    onShowSensitiveCover () {
      this.$emit('update:shouldShowSensitiveCover', true)
    }

    onMediaContentLoaded () {
      this.isMediaLoaded = true
    }

    onMediaContentLoadFailed () {
      this.isMediaLoadFailed = true
    }
  }

  export default PlaceHolderMediaItem

</script>

<style lang="less" scoped>
  .placeholder-media-item-container {
    width: auto;
    max-width: 100%;

    .placeholder-area {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ccc;
      color: #b0b0b0;

      .status-icon {
        font-size: 30px;
      }
    }

    .gifv-container {
      width: 100%;
    }

    .sensitive-hide {
      filter: blur(20px);
    }
  }

</style>
