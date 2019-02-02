<template>
  <div class="search-area-container">
    <div class="search-bar">
      <mu-icon value="search" style="margin-right: 10px"/>
      <mu-text-field class="search-input" v-model="searchKey"
                     @keydown.enter="onSearch" :placeholder="$t($i18nTags.drawer.search_input_placeholder)"
                     :action-icon="shouldShowSearchActionIcon ? 'search' : 'cancel'"
                     :action-click="onSearchInputActionClick"/>
    </div>
    <div class="search-results default-theme-bg-color" :style="resultPanelStyle">
      <mu-list>
        <mu-sub-header>{{$t($i18nTags.drawer.search_result_people_label)}}</mu-sub-header>
        <people-result-card v-for="(account, index) in searchResults.accounts" :account="account" :key="index"/>
      </mu-list>

      <mu-divider></mu-divider>

      <mu-list>

        <mu-sub-header>{{$t($i18nTags.drawer.search_result_hashtag_label)}}</mu-sub-header>

        <mu-list-item v-for="(hashTag, index) in searchResults.hashtags" :key="index"
                      class="hashtag-result-card" :ripple="false">
          <mu-list-item-title class="hash-tag ellipsis-text primary-read-text-color"
                              v-html="hashTag" />
          <mu-list-item-action>
            <mu-icon class="operate-btn" value="playlist_add" />
          </mu-list-item-action>
        </mu-list-item>

      </mu-list>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { Getter, State, Action } from 'vuex-class'
  import * as Api from '@/api'
  import { mastodonentities } from '@/interface'
  import { UiWidthCheckConstants } from '@/constant'
  import PeopleResultCard from './PeopleResultCard'

  @Component({
    components: {
      'people-result-card': PeopleResultCard
    }
  })
  class Search extends Vue {

    $progress

    $t

    $i18nTags

    @State('relationships') relationships: {
      [id: string]: mastodonentities.Relationship
    }

    @Getter('isMobileMode') isMobileMode

    @Action('updateRelationships') updateRelationships

    searchKey: string = ''

    currentSearchKey: string = ''

    shouldShowResultPanel: boolean = false

    searchResults: mastodonentities.SearchResults = {
      accounts: [],
      hashtags: [],
      statuses: []
    }

    get shouldShowSearchActionIcon () {
      return !this.searchKey.length && !this.shouldShowResultPanel
    }

    get resultPanelStyle () {
      return {
        left: this.shouldShowResultPanel ? '0' : `-${this.isMobileMode ? UiWidthCheckConstants.DRAWER_MOBILE_WIDTH : UiWidthCheckConstants.DRAWER_DESKTOP_WIDTH}px`
      }
    }

    async onSearchInputActionClick () {
      if (this.shouldShowSearchActionIcon) return

      this.searchKey = ''
      this.currentSearchKey = ''
      this.shouldShowResultPanel = false
    }

    async onSearch () {
      if (this.searchKey === this.currentSearchKey) return

      this.currentSearchKey = this.searchKey

      this.$progress.start()

      try {
        const result = await Api.search.getSearchResults(this.searchKey)

        this.searchResults = result.data

        this.updateRelationship()

        this.shouldShowResultPanel = true

        this.$progress.done()

      } catch (e) {
        this.$progress.done()
      }
    }

    updateRelationship () {
      const newAccountResultList = this.searchResults.accounts.filter(account => !this.relationships[account.id])
      this.updateRelationships({ idList: newAccountResultList.map(account => account.id) })
    }
  }

  export default Search
</script>

<style lang="less" scoped>

  .ellipsis-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .operate-btn {
    cursor: pointer;
  }

  .search-area-container {
    position: relative;

    .search-bar {
      display: flex;
      align-items: center;
      height: 68px;
      padding: 0 16px;

      .search-input {
        min-height: unset;
        margin: 0;
        padding: 0;
      }
    }

    .search-results {
      position: absolute;
      top: 68px;
      width: 100%;
      // todo
      height: calc(100vh - 64px - 68px);
      z-index: 1;
      -webkit-transition: left .45s cubic-bezier(.23,1,.32,1);
      -moz-transition: left .45s cubic-bezier(.23,1,.32,1);
      -ms-transition: left .45s cubic-bezier(.23,1,.32,1);
      -o-transition: left .45s cubic-bezier(.23,1,.32,1);
      transition: left .45s cubic-bezier(.23,1,.32,1);

      .hashtag-result-card {
        .hash-tag {
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
</style>

<style lang="less">
  .search-area-container {
    .search-input {
      .mu-input-line, .mu-input-focus-line {
        display: none;
      }
    }
  }
</style>
