<template>
  <div id="app">
    <div class="main-container">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'

  @Component({})
  class App extends Vue {}

  export default App
</script>

<style lang="scss" scoped>

</style>
