<template>
  <div class="home-container">
    <mu-load-more @load="onLoadMoreStatuses" :loading="isLoading" loading-text=""
                  @refresh="onFetchMoreStatuses" :refreshing="isRefreshing">
      <div class="status-cards-container">
        <template v-for="status in rootHomeStatuses">
          <status-card :key="status.id" :status="status"/>
        </template>
      </div>
    </mu-load-more>

    <mu-snackbar position="top" color="info" :open.sync="isSnackBarOpening">
      <mu-icon left value="info"></mu-icon>
      {{snackBarMessage}}
      <mu-button flat slot="action" color="#fff" @click="isSnackBarOpening = false">Close</mu-button>
    </mu-snackbar>

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

    isRefreshing: boolean = false

    isLoading: boolean = false

    isSnackBarOpening: boolean = false

    snackBarMessage: string = ''

    get rootHomeStatuses () {
      return this.timelines.home.filter((status: mastodonentities.Status) => !status.in_reply_to_id)
    }

    async mounted () {
      this.isLoading = true
      await this.updateTimeLineStatuses({ timeLineType: TimeLineTypes.HOME })
      this.isLoading = false
    }

    async onLoadMoreStatuses () {
      this.isLoading = true
      await this.updateTimeLineStatuses({
        isLoadMore: true,
        timeLineType: TimeLineTypes.HOME
      })
      this.isLoading = false
    }

    async onFetchMoreStatuses () {
      this.isRefreshing = true
      const result = await this.updateTimeLineStatuses({
        isFetchMore: true,
        timeLineType: TimeLineTypes.HOME
      })

      if (!result.data.length) {
        // todo 弹出提示 i18n
        this.showSnackBar('没有更多了')
      }

      this.isRefreshing = false
    }

    showSnackBar (message: string) {
      this.snackBarMessage = message
      this.isSnackBarOpening = true
      setTimeout(() => {
        this.isSnackBarOpening = false
      }, 3000)
    }
  }

  export default Home
</script>