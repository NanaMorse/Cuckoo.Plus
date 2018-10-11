<template>
  <div class="home-container">
    <div class="status-cards-container">
      <status-card />
    </div>
  </div>
</template>

<script lang="ts">
  import { State } from 'vuex-class'
  import { Vue, Component } from 'vue-property-decorator'
  import { Mutation } from 'vuex-class'
  import { oauth, timelines, accounts } from '@/api'
  import { cuckoostore } from '@/interface'
  import StatusCard from '@/components/StatusCard'

  @Component({
    components: {
      'status-card': StatusCard
    }
  })
  class Home extends Vue {

    @State('OAuthInfo') OAuthInfo: cuckoostore.OAuthInfo

    @Mutation('updateOAuthAccessToken') updateOAuthAccessToken

    async mounted () {
      if (!this.OAuthInfo.accessToken) {
        try {
          const result = await oauth.fetchOAuthToken()
          this.updateOAuthAccessToken(result.data.access_token)
        } catch (e) {
          // todo
        }
      }

      this.getHomeStatuses()
    }

    async getHomeStatuses () {
      try {
        const result = await timelines.getHomeStatuses()

      } catch (e) {
        console.log(e)
      }
    }

  }

  export default Home
</script>

<style lang="scss">

</style>
