<template>
  <div class="search-area-container">
    <div class="search-bar">
      <mu-icon value="search" style="margin-right: 10px"/>
      <mu-text-field placeholder="on developing" class="search-input" v-model="searchKey" @keydown.enter="onSearch" />
    </div>
    <div class="search-results default-theme-bg-color">
      <mu-list>

        <mu-sub-header>{{$t($i18nTags.drawer.search_result_people_label)}}</mu-sub-header>

        <mu-list-item v-for="(account, index) in searchResults.accounts" :key="index"
                      class="people-result-card" avatar :ripple="false">
          <mu-list-item-action>
            <mu-avatar class="people-result-card-avatar" @click="onCheckUserAccountPage(account)">
              <img :src="account.avatar_static" />
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-content class="people-result-card-content ellipsis-text" @click="onCheckUserAccountPage(account)">
            <mu-list-item-title class="user-display-name primary-read-text-color"
                                v-html="getAccountDisplayName(account)" />
            <mu-list-item-sub-title class="user-at-name secondary-read-text-color"
                                    v-html="`@${getAccountAtName(account)}`" />
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-icon class="operate-btn" value="person_add" />
          </mu-list-item-action>
        </mu-list-item>
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
  import { Getter } from 'vuex-class'
  import * as Api from '@/api'
  import { mastodonentities } from '@/interface'


  @Component({})
  class Search extends Vue {

    $progress

    $t

    $i18nTags

    @Getter('getAccountDisplayName') getAccountDisplayName
    @Getter('getAccountAtName') getAccountAtName
    @Getter('isMobileMode') isMobileMode

    searchKey: string = ''

    currentSearchKey: string = ''

    shouldShowResultPanel: boolean = false

    searchResults: mastodonentities.SearchResults = {
      accounts: [],
      hashtags: [],
      statuses: []
    }

    onCheckUserAccountPage (account: mastodonentities.Account) {
      window.open(account.url, "_blank")
    }

    // get resultPanelStyle () {
    //
    // }

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

      .people-result-card {

        .people-result-card-avatar {
          cursor: pointer;
        }

        .people-result-card-content {
          cursor: pointer;

          .user-display-name {
            display: inline;
          }

          &:hover {
            .user-display-name, .user-at-name {
              text-decoration: underline;
            }
          }
        }
      }

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
