<template>
  <div class="header-container">
    <mu-appbar class="header" color="primary">
      <mu-button icon slot="left">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      Cuckoo
    </mu-appbar>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import {} from 'vuex-class'

  @Component({})
  class Header extends Vue {

  }

  export default Header
</script>

<style lang="scss" scoped>

</style>
