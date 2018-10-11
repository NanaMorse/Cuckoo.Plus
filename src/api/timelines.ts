import Vue from 'vue'
import { patchApiUri } from './util'
import { mastodonentities } from '@/interface'

async function getHomeStatuses (): Promise<{ data: Array<mastodonentities.Status> }> {
  return Vue.http.get(patchApiUri('/api/v1/timelines/home')) as any
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
  getHomeStatuses,
  getPublicStatuses,
  getStatusesByTag,
  getStatusesByListId,
  getDirectStatuses
}
