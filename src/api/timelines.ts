import Vue from 'vue'
import { patchApiUri } from './util'

async function getHomeStatuses () {
  return Vue.http.get(patchApiUri('/api/v1/timelines/home'))
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
