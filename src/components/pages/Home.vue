<template>
  <div class="home-container">
    <div class="status-cards-container">
      <template v-for="status in rootHomeStatuses">
        <status-card :key="status.id" :status="status"/>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { State } from 'vuex-class'
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { Mutation } from 'vuex-class'
  import * as api from '@/api'
  import { cuckoostore, mastodonentities } from '@/interface'
  import StatusCard from '@/components/StatusCard.vue'

  // todo 大部分逻辑应该剥离出home timeline，多个timeline共享方法

  @Component({
    components: {
      'status-card': StatusCard
    }
  })
  class Home extends Vue {

    @State('OAuthInfo') OAuthInfo: cuckoostore.OAuthInfo

    @Mutation('updateOAuthAccessToken') updateOAuthAccessToken

    get rootHomeStatuses () {
      return this.homeStatuses.filter((status: mastodonentities.Status) => !status.in_reply_to_id)
    }

    homeStatuses: Array<mastodonentities.Status> = []

    async mounted () {
      this.getHomeStatuses()
    }

    async getHomeStatuses () {
      try {
        const result = await api.timelines.getHomeStatuses()
        this.homeStatuses.push(...result.data)

        // todo if result was less than 20, load more
      } catch (e) {
        console.log(e)
      }
    }
  }

  export default Home
</script>

<style lang="scss">

</style>
