<template>
  <div class="account-container" v-loading="!account">
    <account-header v-if="account" :account="account"/>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { State, Action } from 'vuex-class'
  import AccountHeader from './AccountHeader'

  @Component({
    components: {
      'account-header': AccountHeader
    }
  })
  class Accounts extends Vue {

    $route

    $progress

    @State('accountMap') accountMap

    @Action('fetchAccountInfoById') fetchAccountInfoById

    get account () {
      return this.accountMap[this.$route.params.accountId]
    }

    mounted () {
      this.fetchTargetAccountInfo()
    }

    async fetchTargetAccountInfo () {
      this.$progress.start()
      await this.fetchAccountInfoById(this.$route.params.accountId)
      this.$progress.done()
    }
  }

  export default Accounts
</script>

<style lang="less" scoped>
  .account-container {
    margin: 0 auto;
  }

  @media (min-width: 0px){
    .account-container {
      width: 100%;
    }
  }

  @media (min-width: 1024px) {
    .account-container {
      width: 85%;
    }
  }
</style>
