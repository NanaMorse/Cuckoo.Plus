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
  import { Vue, Component } from 'vue-property-decorator'
  import { Action, State } from 'vuex-class'
  import { TimeLineTypes } from '@/constant'
  import { cuckoostore, mastodonentities } from '@/interface'
  import StatusCard from '@/components/StatusCard.vue'

  @Component({
    components: {
      'status-card': StatusCard
    }
  })
  class Home extends Vue {

    @State('timelines') timelines

    @Action('updateTimeLineStatuses') updateTimeLineStatuses

    get rootHomeStatuses () {
      return this.timelines.home.filter((status: mastodonentities.Status) => !status.in_reply_to_id)
    }

    async mounted () {
      this.updateTimeLineStatuses({ timeLineType: TimeLineTypes.HOME })
    }
  }

  export default Home
</script>