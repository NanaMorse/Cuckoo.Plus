<template>
  <div class="timelines-container">

    <mu-load-more @load="loadStatuses(true)" :loading="isLoading" loading-text="">
      <div class="status-cards-container">
        <template v-for="status in getRootStatuses('home')">
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
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { Action, State, Getter } from 'vuex-class'
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
  class TimeLines extends Vue {

    $route: {
      name: string

      params: {
        timeLineType: string
        tagName: string
        listName: string
      }
    }

    @State('timelines') timelines

    @Getter('getRootStatuses') getRootStatuses

    @Action('updateTimeLineStatuses') updateTimeLineStatuses

    isLoading: boolean = false

    isSnackBarOpening: boolean = false

    snackBarMessage: string = ''

    isPostStatusDialogOpening: boolean = false

    @Watch('$route')
    onRouteChanged (to) {
      console.log(to)
    }

    async mounted () {
      this.loadStatuses()
    }

    getTimeLineTypeAndHashName () {
      let timeLineType = '', hashName = ''
      // @ts-ignore
      if (this.$route.name === this.$routersInfo.defaulttimelines.name) {
        timeLineType = this.$route.params.timeLineType
      }
      // @ts-ignore
      else if (this.$route.name === this.$routersInfo.tagtimelines.name) {
        timeLineType = TimeLineTypes.TAG
        hashName = this.$route.params.tagName
      }
      // @ts-ignore
      else if (this.$route.name === this.$routersInfo.listtimelines.name) {
        timeLineType = TimeLineTypes.LIST
        hashName = this.$route.params.listName
      }

      return { timeLineType, hashName }
    }

    async loadStatuses (isLoadMore: boolean = false) {
      this.isLoading = true
      await this.updateTimeLineStatuses({
        isLoadMore,
        ...this.getTimeLineTypeAndHashName()
      })
      this.isLoading = false
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

  export default TimeLines
</script>

<style lang="scss" scoped>
  .timelines-container {

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
