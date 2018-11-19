<template>
  <div class="cuckoo-input-container">
    <textarea ref="textArea" class="auto-size-text-area" v-model="textValue"
              @keydown.ctrl.enter="onQuickSubmit"
              :placeholder="placeholder"/>

    <div v-if="uploadProcessInfoList.length" class="media-preview-area" :class="{ 'single-upload-preview-area': uploadProcessInfoList.length === 1 }">
      <div class="media-item" :key="index"
           v-for="(processInfo, index) in uploadProcessInfoList">
        <div v-if="!processInfo.uploadSuccess" class="media-placeholder" v-loading="true"/>
        <img v-if="processInfo.uploadSuccess" :src="processInfo.uploadResult.url"/>
        <div class="remove-icon-wrapper" @click="onRemoveMediaFileByIndex(index)">
          <svg height="24px" width="24px" viewBox="0 0 48 48"><circle fill="#fefefe" cx="24" cy="24" r="24"></circle><path fill="#000" d="M24,4C12.9,4,4,12.9,4,24s8.9,20,20,20s20-9,20-20S35,4,24,4z M34,31.2L31.2,34L24,26.8L16.8,34L14,31.2l7.2-7.2L14,16.8l2.8-2.8l7.2,7.2l7.2-7.2l2.8,2.8L26.8,24L34,31.2z"></path></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import {} from 'vuex-class'
  const autosize = require('autosize')

  @Component({})
  class Input extends Vue {

    $refs: {
      textArea: HTMLTextAreaElement
    }

    @Prop() text: string

    @Prop() uploadProcessInfo: Array<any>

    @Prop() placeholder: string

    get textValue () {
      return this.text
    }

    set textValue (val) {
      this.$emit('update:text', val)
    }

    get uploadProcessInfoList () {
      return this.uploadProcessInfo
    }

    set uploadProcessInfoList (newList) {
      this.$emit('update:uploadProcessInfo', newList)
    }

    public focus () {
      this.$nextTick(() => {
        this.$refs.textArea.focus()
      })
    }

    mounted () {
      autosize(this.$refs.textArea)
    }

    onQuickSubmit () {

    }

  }

  export default Input
</script>

<style lang="less" scoped>
  .cuckoo-input-container {

    .media-preview-area {
      height: 212px;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      padding-left: 16px;
      white-space: nowrap;

      &.single-upload-preview-area {
        .media-item {
          margin: 0;
          width: 100%;
          display: flex;
          justify-content: center;
        }
      }

      .media-item {
        margin-right: 8px;
        position: relative;
        display: inline-block;
        height: 100%;

        .media-placeholder {
          width: 212px;
          position: relative;
          height: 100%;
        }

        img {
          width: auto;
          height: 100%;
          display: block;
        }

        .remove-icon-wrapper {
          cursor: pointer;
          position: absolute;
          right: 12px;
          top: 12px;
        }
      }
    }
  }
</style>