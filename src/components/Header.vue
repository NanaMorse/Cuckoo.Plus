<template>
  <div class="header-container">
    <mu-appbar class="header">
      <mu-button icon slot="left">
        <mu-icon value="menu" color="#676767"></mu-icon>
      </mu-button>
      <span>{{parsedMastodonServerUri}}</span>
    </mu-appbar>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { State } from 'vuex-class'
  import { cuckoostore } from '@/interface'

  @Component({})
  class Header extends Vue {

    @State('mastodonServerUri') mastodonServerUri

    get parsedMastodonServerUri () {
      const url = new URL(this.mastodonServerUri)
      return url.host
    }
  }

  export default Header
</script>

<style lang="scss" scoped>
  .header {
    background-color: rgba(255, 255, 255, 1);
    padding-left: 8px;
    color: #676767;
  }
</style>
