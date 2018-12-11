<template>
  <div class="account-header">

  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import {  } from 'vuex-class'

  @Component({})
  class AccountHeader extends Vue {

    $route

    mounted () {
      const accountId = this.$route.params.accountId
    }

  }

  export default AccountHeader
</script>

<style lang="less" scoped>

</style>