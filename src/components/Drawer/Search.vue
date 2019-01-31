<template>
  <div class="search-area-container">
    <div class="search-bar">
      <mu-icon value="search" style="margin-right: 10px"/>
      <mu-text-field placeholder="on developing" class="search-input" v-model="searchKey" @keydown.enter="onSearch" />
    </div>
    <div class="search-results default-theme-bg-color" style="display: none">
      <mu-list>
        <mu-sub-header>Accounts</mu-sub-header>
        <mu-list-item avatar :ripple="false">
          <mu-list-item-action>
            <mu-avatar></mu-avatar>
          </mu-list-item-action>
          <mu-list-item-title>Mike Li</mu-list-item-title>
          <mu-list-item-action>
            <mu-icon value="chat_bubble"></mu-icon>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
      <mu-divider></mu-divider>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import * as Api from '@/api'
  import { mastodonentities } from '@/interface'


  @Component({})
  class Search extends Vue {

    $progress

    searchKey: string = ''

    currentSearchKey: string = ''

    searchResults: mastodonentities.SearchResults

    async onSearch () {
      if (this.searchKey === this.currentSearchKey) return

      this.currentSearchKey = this.searchKey

      this.$progress.start()

      try {
        const result = await Api.search.getSearchResults(this.searchKey)

        this.searchResults = result.data

        this.$progress.done()

      } catch (e) {
        this.$progress.done()
      }
    }
  }

  export default Search
</script>

<style lang="less" scoped>
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
