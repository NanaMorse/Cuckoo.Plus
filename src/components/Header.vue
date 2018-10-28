<template>
  <div class="cuckoo-header-container">
    <mu-appbar class="header" color="primary">
      <mu-button icon @click="onMenuBtnClick" slot="left">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      <span>{{parsedMastodonServerUri}}</span>
      <span class="route-info" v-if="shouldShowRouteInfo">{{pathToRouteInfo[$route.path].name}}</span>
      <div class="search-input-area" v-if="shouldShowRouteInfo">
        <mu-icon class="pre-fix-icon" value="search"/>
        <mu-auto-complete class="search-input" :placeholder="searchInputPlaceHolder" v-model="searchKeyString"
                          :max-search-results="5" :full-width="true"	:data="searchResult">
          <template slot-scope="scope">
            <mu-list-item-action>
              <mu-avatar>
                <img :src="scope.item.favicon">
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content v-html="scope.item.value">
            </mu-list-item-content>
          </template>
        </mu-auto-complete>
      </div>
    </mu-appbar>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { State, Mutation } from 'vuex-class'
  import { cuckoostore } from '@/interface'

  // todo 统一位置管理
  const pathToRouteInfo = {
    '/timelines/home': {
      name: 'Home'
    },
    '/timelines/public': {
      name: 'Public'
    }
  }

  @Component({})
  class Header extends Vue {

    $route

    @State('appStatus') appStatus

    @State('mastodonServerUri') mastodonServerUri

    @Mutation('updateDrawerOpenStatus') updateDrawerOpenStatus

    searchKeyString = ''

    searchResult = []

    pathToRouteInfo = pathToRouteInfo

    get shouldShowRouteInfo () {
      return (this.appStatus.documentWidth > 600) && this.pathToRouteInfo[this.$route.path]
    }

    get parsedMastodonServerUri () {
      const url = new URL(this.mastodonServerUri)
      return url.host.replace(url.host[0], (c) => c.toUpperCase())
    }

    get searchInputPlaceHolder () {
      // todo i18n
      return `搜索${this.parsedMastodonServerUri}`
    }

    onMenuBtnClick () {
      this.updateDrawerOpenStatus(!this.appStatus.isDrawerOpened)
    }

  }

  export default Header
</script>

<style lang="less" scoped>
  .header {
    padding-left: 8px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 20141223;

    .route-info {
      height: 32px;
      line-height: 32px;
      padding-left: 24px;
      margin-left: 24px;
      border-left: 1px solid;
    }

    .search-input-area {
      width: 720px;
      display: flex;
      margin-left: 28px;
      align-items: center;

      .pre-fix-icon {
        margin-left: 10px;
      }

      .search-input {
        margin: 0;
        padding: 0;
        padding-left: 10px;
      }
    }
  }
</style>

<style lang="less">
  .cuckoo-header-container {
    .mu-appbar-title {
      display: flex;
      align-items: center;

      .search-input-area {
        .mu-text-field-input {
          height: 48px;
        }

        .mu-input-line, .mu-input-focus-line {
          display: none;
        }
      }
    }
  }
</style>
