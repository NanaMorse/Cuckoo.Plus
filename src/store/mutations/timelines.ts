import Vue from 'vue'
import { cuckoostore } from '@/interface'
import { TimeLineTypes } from '@/constant'
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

    newStatusIdList = newStatusIdList.filter(id => {
      return targetTimeLines.indexOf(id) === -1
    })

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

    newStatusIdList = newStatusIdList.filter(id => {
      return targetTimeLines.indexOf(id) === -1
    })

    targetTimeLines.unshift(...newStatusIdList)
  },

  deleteStatusFromTimeLine (state: cuckoostore.stateInfo, statusId: string) {
    Object.keys(state.timelines).forEach(timeLineType => {
      if (isBaseTimeLine(timeLineType)) {
        const currentTimeLineList = state.timelines[timeLineType]

        if (currentTimeLineList) {
          currentTimeLineList.splice(currentTimeLineList.indexOf(statusId), 1)
        }

      } else {
        const currentTimeLineMap = state.timelines[timeLineType]

        Object.keys(currentTimeLineMap).forEach(hashName => {
          const currentTimeLineList = currentTimeLineMap[hashName]

          if (currentTimeLineList) {
            currentTimeLineList.splice(currentTimeLineList.indexOf(statusId), 1)
          }
        })

      }
    })
  }
}