import Vue from 'vue'
import { mastodonentities } from '@/interface'
import { patchApiUri } from './util'

async function getStatusById (id: string): Promise<{ data: mastodonentities.Status }> {
  return Vue.http.get(patchApiUri(`/api/v1/statuses/${id}`)) as any
}

async function getStatusContextById (id: string): Promise<{ data: mastodonentities.Context }> {
  return Vue.http.get(patchApiUri(`/api/v1/statuses/${id}/context`)) as any
}

async function getReBloggedAccountsById (id: string): Promise<{ data: Array<mastodonentities.Account> }> {
  return Vue.http.get(patchApiUri(`/api/v1/statuses/${id}/reblogged_by`)) as any
}

async function getFavouritedAccountsById (id: string): Promise<{ data: Array<mastodonentities.Account> }> {
  return Vue.http.get(patchApiUri(`/api/v1/statuses/${id}/favourited_by`)) as any
}

export {
  getStatusById,
  getStatusContextById,
  getReBloggedAccountsById,
  getFavouritedAccountsById
}