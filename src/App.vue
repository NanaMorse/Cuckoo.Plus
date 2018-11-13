<template>
  <div id="app">
    <cuckoo-plus-header v-if="!isOAuthPage"/>
    <cuckoo-plus-drawer v-if="!isOAuthPage"/>
    <mu-container :fluid="true" class="app-content" :style="appContentStyle">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>

      <router-view v-if="!$route.meta.keepAlive" />
    </mu-container>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { Mutation, State } from 'vuex-class'
  import * as _ from 'underscore'
  import { UiWidthCheckConstants } from '@/constant'
  import Header from '@/components/Header.vue'
  import Drawer from '@/components/Drawer.vue'

  @Component({
    components: {
      'cuckoo-plus-header': Header,
      'cuckoo-plus-drawer': Drawer
    }
  })
  class App extends Vue {

    $route

    @State('appStatus') appStatus

    @Mutation('updateDocumentWidth') updateDocumentWidth

    mounted () {
      window.addEventListener('resize', _.debounce(() => this.updateDocumentWidth(), 200))
    }

    get appContentStyle () {
      if (this.appStatus.isDrawerOpened && !this.isOAuthPage &&
        (this.appStatus.documentWidth > UiWidthCheckConstants.DRAWER_DOCKING_BOUNDARY)) {
        return {
          paddingLeft: '210px'
        }
      }
    }

    get isOAuthPage () {
      // @ts-ignore
      return this.$route.name === this.$routersInfo.oauth.name
    }

  }

  export default App
</script>

<style lang="less" scoped>
  .app-content {
    padding: 56px 0 0 0;
    -webkit-transition: padding-left .45s cubic-bezier(.23,1,.32,1);
    -moz-transition: padding-left .45s cubic-bezier(.23,1,.32,1);
    -ms-transition: padding-left .45s cubic-bezier(.23,1,.32,1);
    -o-transition: padding-left .45s cubic-bezier(.23,1,.32,1);
    transition: padding-left .45s cubic-bezier(.23,1,.32,1);
  }

  @media (min-width: 600px) {
    .app-content {
      padding: 64px 0 0 0;
    }
  }
</style>

<style lang="less">
  * {
    transition: background-color .45s cubic-bezier(.23,1,.32,1), color .45s cubic-bezier(.23,1,.32,1);
  }

  body {
    height: 100%;
  }

  a, .mu-load-more {
    -webkit-user-select: auto;
    -moz-user-select: auto;
    -ms-user-select: auto;
    user-select: auto;
  }

  // header z-index 20141223
  // drawer z-index 20141224

  .mu-loading-wrap {
    z-index: 20141222 !important;
  }
</style>
