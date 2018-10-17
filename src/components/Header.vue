<template>
  <div class="header-container">
    <mu-appbar class="header" color="#db4437">
      <mu-button icon @click="onMenuBtnClick" slot="left">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      <span>{{parsedMastodonServerUri}}</span>
    </mu-appbar>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { State, Mutation } from 'vuex-class'
  import { cuckoostore } from '@/interface'

  @Component({})
  class Header extends Vue {

    @State('appStatus') appStatus

    @State('mastodonServerUri') mastodonServerUri

    @Mutation('updateDrawerOpenStatus') updateDrawerOpenStatus

    get parsedMastodonServerUri () {
      const url = new URL(this.mastodonServerUri)
      return url.host
    }

    onMenuBtnClick () {
      this.updateDrawerOpenStatus(!this.appStatus.isDrawerOpened)
    }

  }

  export default Header
</script>

<style lang="scss" scoped>
  .header {
    background-color: rgba(255, 255, 255, 1);
    padding-left: 8px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 300;
  }
</style>
