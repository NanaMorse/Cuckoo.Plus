<template>
  <div>
    <h1>Welcome to Cuckoo.Plus!</h1>
    <!-- todo add vue i18n -->
    <h2>Please input the mastodon server which you want to join in..</h2>

    <el-input placeholder="https://pawoo.net" :value="mastodonServerUri"/>

    <el-button class="submit-server-name-btn" @click="onSubmitServerName">Submit</el-button>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { Mutation, State } from 'vuex-class'
  import { apps } from '@/api'
  import { cuckoostore } from '@/interface'

  // the first step, ask for mastodon OAuth Access token
  // and store this token

  @Component({})
  class App extends Vue {

    @State('OAuthInfo') OAuthInfo: cuckoostore.OAuthInfo

    @Mutation('updateMastodonServerUri') updateMastodonServerUri

    @Mutation('updateClientInfo') updateClientInfo

    mastodonServerUri: string = 'https://pawoo.net'

    async onSubmitServerName () {
      this.updateMastodonServerUri(this.mastodonServerUri)

      const result = await apps.registerApplication()

      this.updateClientInfo({
        clientId: result.data.client_id,
        clientSecret: result.data.client_secret
      })

      this.goToMastodonServerForOAuth()
    }

    goToMastodonServerForOAuth () {
      window.location.href = `${this.mastodonServerUri}/oauth/authorize?client_id=${this.OAuthInfo.clientId}` +
        `&redirect_uri=${location.origin}` +
        `&response_type=code&scope=read write follow`
    }
  }

  export default App
</script>

<style lang="scss" scoped>
  .submit-server-name-btn {
    // todo don't use px
    margin-top: 20px;
  }
</style>
