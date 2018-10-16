import Vue from 'vue'
import { patchApiUri, isBaseTimeLine } from '@/util'
import { TimeLineTypes } from '@/constant'
import { mastodonentities } from '@/interface'

const allTimeLineTypeList = [
  TimeLineTypes.HOME, TimeLineTypes.PUBLIC, TimeLineTypes.DIRECT,
  TimeLineTypes.TAG, TimeLineTypes.LIST
]

async function getTimeLineStatuses ({ timeLineType = '', maxId = '', sinceId = '', hashName = ''} = {}): Promise<{ data: Array<mastodonentities.Status> }> {
  if (allTimeLineTypeList.indexOf(timeLineType) === -1) throw new Error('unknown timeline type!')

  let urlFragmentString = ''
  if (isBaseTimeLine(timeLineType)) {
    urlFragmentString = timeLineType
  } else {
    if (!hashName) throw new Error('need a hash name!')
    urlFragmentString = `${timeLineType}/${hashName}`
  }

  const params: any = { limit: 20 }
  if (maxId) params.max_id = maxId
  if (sinceId) params.since_id = sinceId

  return Vue.http.get(patchApiUri(`/api/v1/timelines/${urlFragmentString}`), {
    params
  }) as any
}

async function getPublicStatuses () {

}

async function getStatusesByTag () {

}

async function getStatusesByListId () {

}

async function getDirectStatuses () {

}

export {
  getTimeLineStatuses,
  getPublicStatuses,
  getStatusesByTag,
  getStatusesByListId,
  getDirectStatuses
}
