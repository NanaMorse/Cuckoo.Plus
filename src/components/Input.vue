<template>
  <div class="cuckoo-input-container">
    <textarea ref="textArea" class="auto-size-text-area" v-model="textValue"
              @keydown.ctrl.enter="onQuickSubmit" @input="onInput"
              :placeholder="placeholder"/>

    <div v-if="uploadProcesses.length" class="media-area" :class="{ 'single-media-area': uploadProcesses.length === 1 }">
      <div class="media-item" :key="index"
           v-for="(processInfo, index) in uploadProcesses">
        <!--<div v-if="!processInfo.uploadSuccess" class="media-placeholder" v-loading="true"/>-->
        <div class="media-loading-wrapper" v-loading="!processInfo.uploadResult">
          <img v-if="uploadFileDataUrlList[index]" :src="uploadFileDataUrlList[index]"/>
        </div>

        <div class="remove-icon-wrapper" @click="onRemoveMediaFileByIndex(index)">
          <svg height="24px" width="24px" viewBox="0 0 48 48">
            <circle fill="#fefefe" cx="24" cy="24" r="24"></circle>
            <path fill="#000" d="M24,4C12.9,4,4,12.9,4,24s8.9,20,20,20s20-9,20-20S35,4,24,4z M34,31.2L31.2,34L24,26.8L16.8,34L14,31.2l7.2-7.2L14,16.8l2.8-2.8l7.2,7.2l7.2-7.2l2.8,2.8L26.8,24L34,31.2z"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import {} from 'vuex-class'
  import { mastodonentities } from '@/interface'
  import * as Api from '@/api'
  const autosize = require('autosize')

  const atCheckRegex = /\s@\S\S+|^@\S\S+/

  @Component({})
  class Input extends Vue {

    $refs: {
      textArea: HTMLTextAreaElement
    }

    @Prop() text: string

    @Prop() uploadProcesses: Array<{
      file: File,
      hasStartedUpload: boolean,
      uploadResult: mastodonentities.Attachment
    }>

    @Prop() placeholder: string

    uploadFileDataUrlList: Array<string> = []

    atAccountSearchResultList: Array<mastodonentities.Account> = []

    get textValue () {
      return this.text
    }

    set textValue (val) {
      this.$emit('update:text', val)
    }

    @Watch('uploadProcesses')
    startUploadProcess () {
      this.uploadProcesses.forEach(async (processInfo, index) => {
        // update data url list
        if (!this.uploadFileDataUrlList[index]) {
          const fileReader = new FileReader()
          fileReader.readAsDataURL(processInfo.file)
          // @ts-ignore
          fileReader.onload = () => Vue.set(this.uploadFileDataUrlList, index, fileReader.result)
        }

        // start upload process
        if (!processInfo.hasStartedUpload) {
          // 好像没意义
          const uploadProcessesCopy = [...this.uploadProcesses]
          uploadProcessesCopy[index].hasStartedUpload = true

          this.$emit('update:uploadProcesses', uploadProcessesCopy)

          const formData = new FormData()
          formData.append('file', processInfo.file)

          try {
            const result = await Api.media.postMediaFile(formData)

            const uploadProcessesCopy = [...this.uploadProcesses]
            uploadProcessesCopy[index].uploadResult = result.data

            this.$emit('update:uploadProcesses', uploadProcessesCopy)

          } catch (e) {

          }
        }
      })
    }

    public focus () {
      this.$nextTick(() => {
        this.$refs.textArea.focus()
      })
    }

    public updateSize () {
      this.$nextTick(() => {
        this.$refs.textArea.dispatchEvent(new Event('autosize:update'))
      })
    }

    mounted () {
      this.startUploadProcess()
      autosize(this.$refs.textArea)
    }

    onQuickSubmit () {
      this.$emit('submit')
    }

    onRemoveMediaFileByIndex (index: number) {
      const uploadProcessesCopy = [...this.uploadProcesses]
      uploadProcessesCopy.splice(index, 1)
      this.$emit('update:uploadProcesses', uploadProcessesCopy)

      // update uploadFileDataUrlList
      this.uploadFileDataUrlList.splice(index, 1)
    }

    onInput () {
      this.searchAtUsers()
    }

    async searchAtUsers () {
      this.$nextTick(() => {
        let selectionEnd = this.$refs.textArea.selectionEnd

        if (this.textValue[selectionEnd - 1] === ' ') return

        const len = this.textValue.length
        for (; selectionEnd < len; selectionEnd ++) {
          if (this.textValue[selectionEnd] === ' ') {
            break
          }
        }

        const textBeforeSelection = this.textValue.slice(0, selectionEnd).split(' ').pop()

        if (textBeforeSelection.match(atCheckRegex)) {
          // Api.search.getSearchResults(textBeforeSelection.slice(1))
        }
      })
    }
  }

  export default Input
</script>

<style lang="less" scoped>
  .cuckoo-input-container {
    width: 100%;

    .media-area {
      padding-left: 16px;

      .media-loading-wrapper {
        height: 100%;
        position: relative;
      }

      .remove-icon-wrapper {
        cursor: pointer;
        position: absolute;
        right: 12px;
        top: 12px;
        z-index: 20141223;
      }
    }
  }
</style>
