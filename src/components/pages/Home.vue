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

    <!-- todo move those widgets to a common area -->
    <mu-snackbar position="top" color="info" :open.sync="isSnackBarOpening">
      <mu-icon left value="info"></mu-icon>
      {{snackBarMessage}}
      <mu-button flat slot="action" color="#fff" @click="isSnackBarOpening = false">Close</mu-button>
    </mu-snackbar>

    <mu-button fab class="post-new-status-button" v-show="!isPostStatusDialogOpening"
               @click="showNewPostDialogPanel">
      <mu-icon value="edit" />
    </mu-button>

    <post-status-dialog :open.sync="isPostStatusDialogOpening"/>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { Action, State } from 'vuex-class'
  import { TimeLineTypes } from '@/constant'
  import { cuckoostore, mastodonentities } from '@/interface'
  import StatusCard from '@/components/StatusCard.vue'
  import PostStatusDialog from '@/components/PostStatusDialog.vue'

  @Component({
    components: {
      'status-card': StatusCard,
      'post-status-dialog': PostStatusDialog
    }
  })
  class Home extends Vue {

    @State('timelines') timelines

    @Action('updateTimeLineStatuses') updateTimeLineStatuses

    isRefreshing: boolean = false

    isLoading: boolean = false

    isSnackBarOpening: boolean = false

    snackBarMessage: string = ''

    isPostStatusDialogOpening: boolean = false

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

    showNewPostDialogPanel () {
      // todo handle history.back() event
      // use vue router?
      this.isPostStatusDialogOpening = true
    }
  }

  export default Home
</script>

<style lang="scss" scoped>
  .home-container {

    .post-new-status-button {
      position: fixed;
      right: 16px;
      bottom: 16px;
      background-color: #db4437;

      @media (min-width: 768px) {
        right: 32px;
        bottom: 32px;
      }
    }
  }
</style>