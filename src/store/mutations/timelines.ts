import Vue from 'vue'
import { cuckoostore } from '@/interface'
import { isBaseTimeLine } from '@/util'

export default {
  setTimeLineStatuses (state: cuckoostore.stateInfo, { newStatuses, timeLineType, hashName }) {
    if (isBaseTimeLine(timeLineType)) {
      Vue.set(state.timelines, timeLineType, newStatuses)
    } else {
      if (!hashName) throw new Error('need a hash name!')

      Vue.set(state.timelines[timeLineType], hashName, newStatuses)
    }
  },

  pushTimeLineStatuses (state: cuckoostore.stateInfo, { newStatuses, timeLineType, hashName }) {
    let targetTimeLines
    if (isBaseTimeLine(timeLineType)) {
      targetTimeLines = state.timelines[timeLineType]
    } else {
      if (!hashName) throw new Error('need a hash name!')
      targetTimeLines = state.timelines[timeLineType][hashName]
    }

    targetTimeLines.push(...newStatuses)
  },

  unShiftTimeLineStatuses (state: cuckoostore.stateInfo, { newStatuses, timeLineType, hashName }) {
    let targetTimeLines
    if (isBaseTimeLine(timeLineType)) {
      targetTimeLines = state.timelines[timeLineType]
    } else {
      if (!hashName) throw new Error('need a hash name!')
      targetTimeLines = state.timelines[timeLineType][hashName]
    }

    targetTimeLines.unshift(...newStatuses)
  }
}