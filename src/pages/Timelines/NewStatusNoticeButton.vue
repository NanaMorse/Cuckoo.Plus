<template>
  <mu-button v-if="!appStatus.settings.realTimeLoadStatusMode" v-show="currentTimeLineStreamPool.length"
             class="new-status-notice-button" round color="primary" @click="onNoticeButtonClick" :style="buttonStyle">
    <svg style="margin-left: 6px" width="18px" height="18px" viewBox="0 0 48 48" fill="#fff">
      <path fill="none" d="M0 0h48v48H0V0z"></path>
      <path d="M8 24l2.83 2.83L22 15.66V40h4V15.66l11.17 11.17L40 24 24 8 8 24z"></path>
    </svg>
    {{currentTimeLineStreamPool.length}}
    <span>条新信息</span>
  </mu-button>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { State, Mutation, Action } from 'vuex-class'
  import { getTimeLineTypeAndHashName, isBaseTimeLine } from '@/util'

  @Component({})
  class NewStatusNoticeButton extends Vue {

    $route

    @State('appStatus') appStatus

    @State('statusMap') statusMap

    @Mutation('unShiftTimeLineStatuses') unShiftTimeLineStatuses

    @Action('loadStreamStatusesPool') loadStreamStatusesPool

    translateY: number = 0

    get currentTimeLineStreamPool () {
      const { timeLineType, hashName } = getTimeLineTypeAndHashName(this.$route)

      if (timeLineType === '') return []

      let targetStreamPool: Array<string>
      if (isBaseTimeLine(timeLineType)) {
        targetStreamPool = this.appStatus.streamStatusesPool[timeLineType]
      } else {
        targetStreamPool = this.appStatus.streamStatusesPool[timeLineType][hashName]
      }

      // filter root status
      return targetStreamPool.filter(id => this.statusMap[id] && !this.statusMap[id].in_reply_to_id)
    }

    get buttonStyle () {
      return { transform: `translate(-50%, ${this.translateY}px)` }
    }

    mounted () {
      this.initWindowScrollEvent()
    }

    initWindowScrollEvent () {
      let preScrollY = window.scrollY

      const minTranslateY = -110
      const maxTranslateY = 0

      window.addEventListener('scroll', () => {
        if (!this.currentTimeLineStreamPool.length) return

        if (this.translateY >= minTranslateY && this.translateY <= maxTranslateY) {
          this.translateY -= window.scrollY - preScrollY

          if (this.translateY < minTranslateY) this.translateY = minTranslateY
          if (this.translateY > maxTranslateY) this.translateY = maxTranslateY
        }

        preScrollY = window.scrollY

      }, { passive: true })
    }

    onNoticeButtonClick () {
      this.loadStreamStatusesPool({ ...getTimeLineTypeAndHashName(this.$route) })
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  export default NewStatusNoticeButton
</script>

<style lang="less" scoped>

</style>