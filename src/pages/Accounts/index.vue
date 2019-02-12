<template>
  <div class="account-container">
    <account-header />
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { } from 'vuex-class'
  import AccountHeader from './AccountHeader'

  @Component({
    components: {
      'account-header': AccountHeader
    }
  })
  class Accounts extends Vue {

  }

  export default Accounts
</script>

<style lang="less" scoped>

</style>
