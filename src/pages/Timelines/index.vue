<template>
  <div class="timelines-container" v-loading="isInitLoading">

    <template v-for="(timeLineName, index) in allTimeLineNameList">
      <transition name="slide-fade">
        <mu-load-more :key="index" @load="loadStatuses(true)" v-show="isTimeLineNameEqualCurrentRoute(timeLineName)"
                      :loading="isLoading" loading-text="">
          <div class="status-cards-container">

            <div class="water-flow-wrapper" v-for="count in waterfallLineCount" :key="count">
              <template v-for="(status, index) in getRootStatuses(timeLineName.split('/')[0], timeLineName.split('/')[1])">
                <status-card v-if="(index % waterfallLineCount) === (count - 1)"
                             class="status-card-container" :style="statusCardStyle"
                             :key="status.id" :status="status"/>
              </template>

              <p class="no-more-status-notice secondary-read-text-color"
                 v-if="currentTimeLineCannotLoadMore && (count === waterfallLineCount) ">
                {{$t($i18nTags.timeLines.no_load_more_status_notice)}}
              </p>
            </div>

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

    <mu-button fab class="post-new-status-button" color="primary" v-show="!isPostStatusDialogOpening"
               @click="showNewPostDialogPanel">
      <mu-icon value="edit" />
    </mu-button>

    <post-status-dialog :open.sync="isPostStatusDialogOpening"/>

    <new-status-notice-button />
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { Action, State, Getter } from 'vuex-class'
  import { TimeLineTypes } from '@/constant'
  import { cuckoostore, mastodonentities } from '@/interface'
  import { getTimeLineTypeAndHashName, isBaseTimeLine } from '@/util'
  import StatusCard from '@/components/StatusCard'
  import PostStatusDialog from '@/components/PostStatusDialog.vue'
  import NewStatusNoticeButton from './NewStatusNoticeButton'

  const statusCardMaxWidth = 530
  const statusCardMinWidth = 360

  function getFitStatusWidth (containerWidth, lineCount): number {
    return containerWidth / ( lineCount + (lineCount - 1) * 0.02 )
  }

  function calcFitWaterFallLineCount (containerWidth: number, testLineCount: number = 3) {
    if (testLineCount <= 1) return 1

    const testStatusCardWidth = getFitStatusWidth(containerWidth, testLineCount)

    if (testStatusCardWidth > statusCardMinWidth) {
      return testLineCount
    } else {
      return calcFitWaterFallLineCount(containerWidth, testLineCount - 1)
    }
  }

  @Component({
    components: {
      'status-card': StatusCard,
      'post-status-dialog': PostStatusDialog,
      'new-status-notice-button': NewStatusNoticeButton
    }
  })
  class TimeLines extends Vue {

    $route;

    $progress;

    @State('appStatus') appStatus

    @State('timelines') timelines

    @Getter('getRootStatuses') getRootStatuses

    @Action('updateTimeLineStatuses') updateTimeLineStatuses

    @Action('loadStreamStatusesPool') loadStreamStatusesPool

    /**
     * @description 这种loading应该是全屏白色遮罩
     **/
    isInitLoading: boolean = false

    /**
     * @description 这种则只需要转圈就行
     * */
    isLoading: boolean = false

    noLoadMoreTimeLineList: Array<string> = []

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

    get isCurrentTimeLineRoute () {
      // todo use meta?
      return this.$route.path.startsWith('/timelines/')
    }

    get currentRootStatuses (): Array<mastodonentities.Status> {
      if (!this.isCurrentTimeLineRoute) return

      const { timeLineType, hashName } = getTimeLineTypeAndHashName(this.$route)

      return this.getRootStatuses(timeLineType, hashName)
    }

    get currentTimeLineCannotLoadMore () {
      if (!this.isCurrentTimeLineRoute) return

      const { timeLineType, hashName } = getTimeLineTypeAndHashName(this.$route)

      return this.noLoadMoreTimeLineList.indexOf(`${timeLineType}/${hashName}`) !== -1
    }

    get statusCardsContainerWidth (): number {
      return this.appStatus.documentWidth - 210
    }

    get waterfallLineCount () {
      if (!this.appStatus.settings.multiLineMode) return 1

      return calcFitWaterFallLineCount(this.statusCardsContainerWidth * 0.9)
    }

    get statusCardStyle () {
      if (this.waterfallLineCount === 1) return null

      let fitWidth = getFitStatusWidth(this.statusCardsContainerWidth * 0.9, this.waterfallLineCount)

      if (fitWidth > statusCardMaxWidth) fitWidth = statusCardMaxWidth

      return {
        width: `${fitWidth}px`
      }
    }

    @Watch('$route')
    async onRouteChanged () {
      if (!this.isCurrentTimeLineRoute) return

      if (!this.currentRootStatuses.length) {
        this.isInitLoading = true
        await this.loadStatuses()
        this.isInitLoading = false
      } else {
        this.loadStreamStatusesPool({...getTimeLineTypeAndHashName(this.$route)})
        this.loadStatuses(false, true)
      }
    }

    async mounted () {
      this.onRouteChanged()
    }

    async loadStatuses (isLoadMore: boolean = false, isFetchMore: boolean = false) {

      if (isLoadMore && this.currentTimeLineCannotLoadMore) return

      if (!this.isCurrentTimeLineRoute) return

      this.isLoading = true
      this.$progress.start()

      const preStatusesLength = this.currentRootStatuses.length
      const { timeLineType, hashName } = getTimeLineTypeAndHashName(this.$route)
      await this.updateTimeLineStatuses({
        isLoadMore,
        isFetchMore,
        timeLineType,
        hashName
      })

      const newStatusesLength = this.currentRootStatuses.length

      if (isLoadMore && (preStatusesLength === newStatusesLength)) {
        this.noLoadMoreTimeLineList.push(`${timeLineType}/${hashName}`)
      }

      this.$progress.done()
      this.isLoading = false
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

<style lang="less" scoped>
  .timelines-container {

    .post-new-status-button {
      position: fixed;
      right: 16px;
      bottom: 16px;

      @media (min-width: 768px) {
        right: 32px;
        bottom: 32px;
      }
    }

    .status-cards-container {
      display: flex;
      justify-content: center;

      @media (max-width: 530px) {
        display: block;
      }

      .water-flow-wrapper {
        margin-left: 2%;
        &:first-child {
          margin-left: 0;
        }
      }

      .status-card-container, .no-more-status-notice {
        max-width: 530px;
        margin: 16px 0 16px 0;
      }

      .no-more-status-notice {
        text-align: center;
      }

    }

    .new-status-notice-button {
      position: fixed;
      top: 70px;
      left: 50%;
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
