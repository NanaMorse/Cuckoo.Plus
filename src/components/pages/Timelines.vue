<template>
  <div class="timelines-container">

    <template v-for="(timeLineName, index) in allTimeLineNameList">
      <transition name="slide-fade">
        <mu-load-more :key="index" @load="loadStatuses(true)" v-show="isTimeLineNameEqualCurrentRoute(timeLineName)"
                      :loading="isLoading" loading-text="">
          <div class="status-cards-container">
            <template v-for="status in getRootStatuses(timeLineName.split('/')[0], timeLineName.split('/')[1])">
              <status-card class="status-card-container" :key="status.id" :status="status"/>
            </template>
          </div>
        </mu-load-more>
      </transition>
    </template>

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
  import { getTimeLineTypeAndHashName, isBaseTimeLine } from '@/util'
  import StatusCard from '@/components/StatusCard.vue'
  import PostStatusDialog from '@/components/PostStatusDialog.vue'

  @Component({
    components: {
      'status-card': StatusCard,
      'post-status-dialog': PostStatusDialog
    }
  })
  class TimeLines extends Vue {

    $route;

    $progress;

    @State('timelines') timelines

    @Getter('getRootStatuses') getRootStatuses

    @Action('updateTimeLineStatuses') updateTimeLineStatuses

    isLoading: boolean = false

    isSnackBarOpening: boolean = false

    snackBarMessage: string = ''

    isPostStatusDialogOpening: boolean = false

    get allTimeLineNameList (): Array<string> {
      const result = [
        TimeLineTypes.HOME, TimeLineTypes.PUBLIC
      ].filter(type => this.timelines[type].length);

      [TimeLineTypes.TAG, TimeLineTypes.LIST].forEach(secondType => {
        Object.keys(this.timelines[secondType]).forEach(hashName => {
          if (Array.isArray(this.timelines[secondType][hashName])) {
            result.push(`${secondType}/${hashName}`)
          }
        })
      })

      return result
    }

    get currentRootStatuses (): Array<mastodonentities.Status> {
      // @ts-ignore
      const { timeLineType, hashName } = getTimeLineTypeAndHashName(this.$route)
      return this.getRootStatuses(timeLineType, hashName)
    }

    @Watch('$route')
    onRouteChanged () {
      if (!this.currentRootStatuses.length) {
        this.loadStatuses()
      } else {
        this.loadStatuses(false, true)
      }
    }

    async mounted () {
      await this.loadStatuses()
    }

    async loadStatuses (isLoadMore: boolean = false, isFetchMore: boolean = false) {
      this.isLoading = true
      this.$progress.start()
      await this.updateTimeLineStatuses({
        isLoadMore,
        isFetchMore,
        ...getTimeLineTypeAndHashName(this.$route)
      })
      this.$progress.done()
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

    isTimeLineNameEqualCurrentRoute (timeLineName: string): boolean {
      const { timeLineType, hashName } = getTimeLineTypeAndHashName(this.$route)

      if (isBaseTimeLine(timeLineName)) {
        return timeLineType === timeLineName
      } else {
        return `${timeLineType}/${hashName}` === timeLineName
      }
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

    .status-cards-container {

      .status-card-container {
        max-width: 530px;
        margin: 16px auto;
      }

    }

  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(30px);
    opacity: 0;
  }
</style>
