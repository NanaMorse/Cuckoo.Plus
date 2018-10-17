<template>
  <div id="app">
    <cuckoo-plus-header v-if="shouldShowHeader"/>
    <mu-container>
      <cuckoo-plus-drawer />
      <router-view />
    </mu-container>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import Header from '@/components/Header.vue'
  import Drawer from '@/components/Drawer.vue'

  @Component({
    components: {
      'cuckoo-plus-header': Header,
      'cuckoo-plus-drawer': Drawer
    }
  })
  class App extends Vue {

    get shouldShowHeader () {
      // @ts-ignore
      return this.$route.name !== this.$routersInfo.oauth.name
    }

  }

  export default App
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
  @import "assets/common";

  body {
    height: 100%;
    background-color: #f2f2f2;
  }

  .container {
    padding: 0;
  }

  a, .mu-load-more {
    -webkit-user-select: auto;
    -moz-user-select: auto;
    -ms-user-select: auto;
    user-select: auto;
  }
</style>
