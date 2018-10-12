<template>
  <div id="app">
    <cuckoo-plus-header v-if="shouldShowHeader"/>
    <mu-container>
      <router-view />
    </mu-container>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import Header from '@/components/Header.vue'

  @Component({
    components: {
      'cuckoo-plus-header': Header
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
  .main-container {
  }
</style>

<style>
  body {
    height: 100%;
    background-color: #f2f2f2;
  }

  .container {
    padding: 0;
  }
</style>
