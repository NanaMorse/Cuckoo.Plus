<template>
  <div class="account-header">
    <div class="user-info-area">
      <div class="left-area"></div>
      <div></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import {  } from 'vuex-class'
  import { mastodonentities } from "@/interface"


  @Component({})
  class AccountHeader extends Vue {

    $route

    @Prop() account: mastodonentities.Account

  }

  export default AccountHeader
</script>

<style lang="less" scoped>

</style>
