<template>
  <div id="app">
    <div class="main-container">
      <cuckoo-plus-header />
      <router-view />
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

</style>
