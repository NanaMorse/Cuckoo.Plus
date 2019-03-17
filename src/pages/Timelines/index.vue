<template>
  <div class="timelines-container" ref="timelinesContainer" v-loading="isInitLoading">

    <template v-for="(timeLineName, index) in allTimeLineNameList">
      <mu-load-more :key="index" @load="loadStatuses(true)" v-show="isTimeLineNameEqualCurrentRoute(timeLineName)"
                    :loading="!isInitLoading && isLoading" loading-text="">
        <div v-masonry-container :style="statusCardsContainerStyle" class="status-cards-container">

          <post-status-stamp-card @click="showNewPostDialogPanel"
            class="status-card-container" :style="statusCardStyle" />

          <template v-for="status in getRootStatuses(timeLineName.split('/')[0], timeLineName.split('/')[1])">
            <status-card v-masonry-item :style="statusCardStyle"
                         class="status-card-container"
                         :key="status.id" :status="status"/>
          </template>

          <p class="no-more-status-notice secondary-read-text-color"
             v-if="currentTimeLineCannotLoadMore && (count === waterfallLineCount) ">
            {{$t($i18nTags.timeLines.no_load_more_status_notice)}}
          </p>

        </div>
      </mu-load-more>
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
  import { TimeLineTypes, UiWidthCheckConstants } from '@/constant'
  import { cuckoostore, mastodonentities } from '@/interface'
  import { getTimeLineTypeAndHashName, isBaseTimeLine } from '@/util'
  import StatusCard from '@/components/StatusCard'
  import PostStatusDialog from '@/components/PostStatusDialog'
  import NewStatusNoticeButton from './NewStatusNoticeButton'
  import PostStatusStampCard from './PostStatusStampCard'

  const waterFallMaxLineCount = 3

  function getFitStatusWidth (containerWidth, lineCount): number {
    return (containerWidth - (lineCount - 1) * UiWidthCheckConstants.TIMELINE_WATER_FALL_GUTTER) / lineCount
  }

  function calcFitWaterFallLineCount (containerWidth: number, testLineCount: number = waterFallMaxLineCount) {
    if (testLineCount <= 1) return 1

    const testStatusCardWidth = getFitStatusWidth(containerWidth, testLineCount)

    if (testStatusCardWidth > UiWidthCheckConstants.STATUS_CARD_MIN_WIDTH) {
      return testLineCount
    } else {
      return calcFitWaterFallLineCount(containerWidth, testLineCount - 1)
    }
  }

  @Component({
    components: {
      'status-card': StatusCard,
      'post-status-dialog': PostStatusDialog,
      'new-status-notice-button': NewStatusNoticeButton,
      'post-status-stamp-card': PostStatusStampCard
    }
  })
  class TimeLines extends Vue {

    $refs: {
      timelinesContainer: HTMLDivElement
    }

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
        TimeLineTypes.HOME, TimeLineTypes.PUBLIC, TimeLineTypes.LOCAL
      ];
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

      return this.getRootStatuses(timeLineType, hashName).filter(status => status.id)
    }

    get currentTimeLineCannotLoadMore () {
      if (!this.isCurrentTimeLineRoute) return

      const { timeLineType, hashName } = getTimeLineTypeAndHashName(this.$route)

      return this.noLoadMoreTimeLineList.indexOf(`${timeLineType}/${hashName}`) !== -1
    }

    get contentAreaWidth (): number {
      return this.appStatus.documentWidth - UiWidthCheckConstants.DRAWER_DESKTOP_WIDTH
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

    @Watch('currentRootStatuses')
    onCurrentRootStatusesChanged () {
      this.$nextTick(async () => {
        // load more to show scroll
        // todo maybe we could find a better way to serve this?
        // if (this.$refs.timelinesContainer.clientHeight < window.screen.availHeight) {
        //   this.isInitLoading = true
        //   this.isLoading = false
        //   await this.loadStatuses(true)
        //   this.isInitLoading = false
        // }
      })
    }

    async mounted () {
      this.onRouteChanged()
    }

    async loadStatuses (isLoadMore: boolean = false, isFetchMore: boolean = false) {

      if (isLoadMore && this.currentTimeLineCannotLoadMore) return

      if (!this.isCurrentTimeLineRoute) return

      if (this.isLoading) return

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

    get waterfallLineCount () {
      if (!this.appStatus.settings.multiLineMode) return 1

      return calcFitWaterFallLineCount(this.contentAreaWidth - UiWidthCheckConstants.TIMELINE_WATER_FALL_GUTTER * 2)
    }

    get statusCardsContainerStyle () {
      if (this.waterfallLineCount === 1) {
        return {
          maxWidth: `${UiWidthCheckConstants.STATUS_CARD_MAX_WIDTH}px`
        }
      } else {
        const width = this.statusCardMultiLineFinalWidth * this.waterfallLineCount +
          UiWidthCheckConstants.TIMELINE_WATER_FALL_GUTTER * (this.waterfallLineCount - 1)

        return { width: `${width}px` }
      }
    }

    get statusCardMultiLineFinalWidth () {
      let fitWidth = getFitStatusWidth(this.contentAreaWidth - UiWidthCheckConstants.TIMELINE_WATER_FALL_GUTTER * 2, this.waterfallLineCount)

      if (fitWidth > UiWidthCheckConstants.STATUS_CARD_MAX_WIDTH) fitWidth = UiWidthCheckConstants.STATUS_CARD_MAX_WIDTH

      return fitWidth
    }

    get statusCardStyle () {
      if (this.waterfallLineCount === 1) return null

      return {
        width: `${this.statusCardMultiLineFinalWidth}px`
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
      margin: 0 auto;
      padding-top: 24px;

      .new-status-stamp {
        height: 60px;
      }

      .status-card-container, .no-more-status-notice {
        max-width: 530px;
        margin: 0 auto 24px;
        break-inside: avoid;
        box-sizing: border-box;
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
</style>
