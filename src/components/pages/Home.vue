<template>
  <div>
    <h1>Hello, {{userName}}!</h1>
    <h1>You have got the access token!</h1>
  </div>
</template>

<script lang="ts">
  import { State } from 'vuex-class'
  import { Vue, Component } from 'vue-property-decorator'
  import { Mutation } from 'vuex-class'
  import { oauth, accounts } from '@/api'
  import { cuckoostore } from '@/interface'

  @Component({})
  class Home extends Vue {

    @State('OAuthInfo') OAuthInfo: cuckoostore.OAuthInfo

    @Mutation('updateOAuthAccessToken') updateOAuthAccessToken

    userName: string = ''

    async mounted () {
      if (!this.OAuthInfo.accessToken) {
        const result = await oauth.fetchOAuthToken()
        this.updateOAuthAccessToken(result.data.access_token)
      }

      const currentUserInfo = await accounts.fetchCurrentUserAccountInfo()
      this.userName = currentUserInfo.data.username
    }
    
  }

  export default Home
</script>

<style lang="scss">

</style>
