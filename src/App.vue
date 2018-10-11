<template>
  <div id="app">
    <div class="main-container">
      <cuckoo-plus-header />
      <mu-container>
        <router-view />
      </mu-container>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import Header from '@/components/Header'

  @Component({
    components: {
      'cuckoo-plus-header': Header
    }
  })
  class App extends Vue {

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
    background-color: rgb(241, 241, 241);
  }
</style>
