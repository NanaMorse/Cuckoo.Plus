<template>
  <div class="cuckoo-input-container">
    <textarea ref="textArea" class="auto-size-text-area" v-model="textValue"
              @keydown.ctrl.enter="onQuickSubmit" @input="onInput"
              @keydown.38="onMinisSelectedResultIndex" @keydown.40="onPlusSelectedResultIndex"
              @keydown.enter="onSelectedSearchResult" @click="onTextAreaClick"
              :placeholder="placeholder"/>

    <div v-if="uploadProcesses.length" class="media-area" :class="{ 'single-media-area': uploadProcesses.length === 1 }">
      <div class="media-item" :key="index"
           v-for="(processInfo, index) in uploadProcesses">
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

    <mu-list v-if="shouldShowAccountSearchResultList" v-loading="isLoadingSearchResult"
             class="at-account-search-result-list dialog-theme-bg-color"
             :style="accountSearchResultListStyle">
      <mu-list-item avatar button :ripple="false" :key="index"
                    @hover="currentSelectedResultIndex = index"
                    @click="onSelectedSearchResult"
                    :class="{ 'active': currentSelectedResultIndex === index }"
                    v-for="(account, index) in atAccountSearchResultList">
        <mu-list-item-action>
          <mu-avatar>
            <img :src="account.avatar_static">
          </mu-avatar>
        </mu-list-item-action>
        <mu-list-item-title v-html="getSearchUserFullName(account)" />
      </mu-list-item>
    </mu-list>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import { mastodonentities } from '@/interface'
  import * as Api from '@/api'
  import { formatAccountDisplayName, resetImageFileSizeForUpload } from '@/util'

  const autosize = require('autosize')
  const getCaretCoordinates = require('textarea-caret');

  const maxImageSize = 7.8 * 1024 * 1024

  const searchResultListMaxHeight = 240
  const listItemHeight = 48
  const listVerticalPadding = 0
  const listMargin = 4
  const atCheckRegex = /\s@\S*|^@\S*/

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

    @Prop({ default: () => [] }) presetAtAccounts: Array<mastodonentities.Account>

    uploadFileDataUrlList: Array<string> = []

    atAccountSearchResultList: Array<mastodonentities.Account> = []

    currentSelectedResultIndex: number = 0

    currentSearchTextPosition: [number, number] = null

    insertedAcctList: Array<string> = []

    isLoadingSearchResult = false

    get textValue () {
      return this.text
    }

    set textValue (val) {
      this.$emit('update:text', val)
    }

    get shouldShowAccountSearchResultList () {
      return this.atAccountSearchResultList.length !== 0
    }

    accountSearchResultListStyle = null

    @Watch('uploadProcesses')
    startUploadProcess () {
      const uploadProcessesCopy = [...this.uploadProcesses]

      uploadProcessesCopy.forEach(async (processInfo, index) => {
        // update data url list
        if (!this.uploadFileDataUrlList[index] && !processInfo.hasStartedUpload) {
          const resolvedFile = await resetImageFileSizeForUpload(processInfo.file)
          if (resolvedFile !== processInfo.file) {
            uploadProcessesCopy[index].file = resolvedFile as any
          }

          const fileReader = new FileReader()
          fileReader.readAsDataURL(processInfo.file)
          // @ts-ignore
          fileReader.onload = () => Vue.set(this.uploadFileDataUrlList, index, fileReader.result)
        }

        // start upload process
        if (!processInfo.hasStartedUpload) {
          uploadProcessesCopy[index].hasStartedUpload = true

          this.$emit('update:uploadProcesses', uploadProcessesCopy)

          const formData = new FormData()
          formData.append('file', processInfo.file)

          try {
            const result = await Api.media.postMediaFile(formData)

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
      this.insertedAcctList = this.presetAtAccounts.map(accounts => accounts.acct)
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

    onTextAreaClick () {
      if (this.shouldShowAccountSearchResultList) {
        this.closeSearchAtUsersList()
      }
    }

    onPlusSelectedResultIndex (e: KeyboardEvent) {
      if (this.shouldShowAccountSearchResultList) {
        e.preventDefault()
        if (this.currentSelectedResultIndex === (this.atAccountSearchResultList.length - 1)) {
          this.currentSelectedResultIndex = 0
        } else {
          this.currentSelectedResultIndex = this.currentSelectedResultIndex + 1
        }
      }
    }

    onMinisSelectedResultIndex (e: KeyboardEvent) {
      if (this.shouldShowAccountSearchResultList) {
        e.preventDefault()
        if (this.currentSelectedResultIndex === 0) {
          this.currentSelectedResultIndex = this.atAccountSearchResultList.length - 1
        } else {
          this.currentSelectedResultIndex = this.currentSelectedResultIndex - 1
        }
      }
    }

    onSelectedSearchResult (e: KeyboardEvent) {
      if (this.shouldShowAccountSearchResultList) {
        e.preventDefault()
        const preText = this.textValue.substring(0, this.currentSearchTextPosition[0])
        const insertText = `@${this.atAccountSearchResultList[this.currentSelectedResultIndex].acct}`
        const endText = this.textValue.substring(this.currentSearchTextPosition[1])

        this.textValue = `${preText}${insertText}${endText} `

        this.insertedAcctList.push(this.atAccountSearchResultList[this.currentSelectedResultIndex].acct)
        this.closeSearchAtUsersList()

        this.focus()
        this.updateSize()
      }
    }

    getSearchUserFullName (account: mastodonentities.Account) {
      return `${formatAccountDisplayName(account)} <span class="at-name secondary-read-text-color">@${account.acct}</span>`
    }

    getAccountListTopPosition () {
      const { top, height } = getCaretCoordinates(this.$refs.textArea, this.$refs.textArea.selectionEnd)

      const { height: offsetHeight, top: offsetTop } = this.$refs.textArea.getBoundingClientRect()

      let topPosition = top + height + listMargin

      if (innerHeight - offsetTop - offsetHeight - top < searchResultListMaxHeight) {
        const listHeight = Math.min(listItemHeight * this.atAccountSearchResultList.length + listVerticalPadding * 2, searchResultListMaxHeight)
        topPosition = -listHeight - listMargin
      }

      return `${topPosition}px`
    }

    getSearchAtUsersKeyWords (): string {

      let selectionEnd = this.$refs.textArea.selectionEnd

      if (this.textValue[selectionEnd - 1] === ' ') return

      const len = this.textValue.length
      for (; selectionEnd < len; selectionEnd ++) {
        if (this.textValue[selectionEnd] === ' ') {
          break
        }
      }

      const textBeforeSelection = this.textValue.slice(0, selectionEnd).split(' ').pop().split('\n').pop()

      if (textBeforeSelection.match(atCheckRegex)) {
        this.currentSearchTextPosition = [selectionEnd - textBeforeSelection.length, selectionEnd]

        return textBeforeSelection.slice(1)
      }
    }

    searchAtUsers () {
      this.$nextTick(async () => {
        const searchUsersKeyWords = this.getSearchAtUsersKeyWords()

        if (searchUsersKeyWords === undefined || this.insertedAcctList.indexOf(searchUsersKeyWords) !== -1) {
          this.isLoadingSearchResult = false
          return this.closeSearchAtUsersList()
        }

        if (searchUsersKeyWords === '') {
          Api.search.abortSearch()
          this.isLoadingSearchResult = false
          this.atAccountSearchResultList = [...this.presetAtAccounts]
        } else {
          // search for accounts
          try {
            this.isLoadingSearchResult = true
            const result = await Api.search.getSearchResults(searchUsersKeyWords)
            this.isLoadingSearchResult = false
            this.atAccountSearchResultList = [...result.data.accounts]
          } catch (e) {

          }
        }

        if (this.atAccountSearchResultList.length) {
          this.accountSearchResultListStyle = { top: this.getAccountListTopPosition() }
        }

      })
    }

    closeSearchAtUsersList () {
      this.atAccountSearchResultList = []
      this.currentSelectedResultIndex = 0
      this.currentSearchTextPosition = [0, 0]
    }
  }

  export default Input
</script>

<style lang="less" scoped>
  .cuckoo-input-container {
    width: 100%;
    position: relative;

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

    .at-account-search-result-list {
      width: 100%;
      max-height: 240px;
      position: absolute;
      box-shadow: 0 2px 5px 0 rgba(0,0,0,0.26);
      z-index: 1;
      padding: 0;
    }
  }
</style>

<style lang="less">
  .at-account-search-result-list {


    .active > .mu-item-wrapper {
      background-color: rgba(0, 0, 0, .1) !important;
    }

    .mu-item-wrapper {
      &.hover {
        background-color: unset;
      }

      .mu-item.has-avatar {
        height: 48px;
        padding: 0 10px;
      }
    }
  }
</style>