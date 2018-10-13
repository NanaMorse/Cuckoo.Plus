import Vue from 'vue'
import { patchApiUri } from './util'
import { TimeLineTypes } from '@/constant'
import { mastodonentities } from '@/interface'

async function getTimeLineStatuses ({ timeLineType = '', maxId = '', sinceId = ''} = {}): Promise<{ data: Array<mastodonentities.Status> }> {
  const typeToUrlFragment = {
    [TimeLineTypes.HOME]: 'home',
    [TimeLineTypes.PUBLIC]: 'public'
  }

  if (!typeToUrlFragment[timeLineType]) throw new Error('unknown timeline!')

  const params: any = { limit: 20 }
  if (maxId) params.max_id = maxId
  if (sinceId) params.since_id = sinceId

  return Vue.http.get(patchApiUri(`/api/v1/timelines/${typeToUrlFragment[timeLineType]}`), {
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
