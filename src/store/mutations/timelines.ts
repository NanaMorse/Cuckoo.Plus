import Vue from 'vue'
import { cuckoostore } from '@/interface'
import { isBaseTimeLine } from '@/util'

export default {
  setTimeLineStatuses (state: cuckoostore.stateInfo, { newStatusIdList, timeLineType, hashName }) {
    if (isBaseTimeLine(timeLineType)) {
      Vue.set(state.timelines, timeLineType, newStatusIdList)
    } else {
      if (!hashName) throw new Error('need a hash name!')

      Vue.set(state.timelines[timeLineType], hashName, newStatusIdList)
    }
  },

  pushTimeLineStatuses (state: cuckoostore.stateInfo, { newStatusIdList, timeLineType, hashName }) {
    let targetTimeLines
    if (isBaseTimeLine(timeLineType)) {
      targetTimeLines = state.timelines[timeLineType]
    } else {
      if (!hashName) throw new Error('need a hash name!')
      targetTimeLines = state.timelines[timeLineType][hashName]
    }

    targetTimeLines.push(...newStatusIdList)
  },

  unShiftTimeLineStatuses (state: cuckoostore.stateInfo, { newStatusIdList, timeLineType, hashName }) {
    let targetTimeLines
    if (isBaseTimeLine(timeLineType)) {
      targetTimeLines = state.timelines[timeLineType]
    } else {
      if (!hashName) throw new Error('need a hash name!')
      targetTimeLines = state.timelines[timeLineType][hashName]
    }

    targetTimeLines.unshift(...newStatusIdList)
  }
}