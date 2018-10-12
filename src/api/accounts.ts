import Vue from 'vue'
import { mastodonentities } from '@/interface'
import HttpResponse = vuejs.HttpResponse
import { patchApiUri } from './util'

async function fetchAccountInfoById () {

}

async function fetchCurrentUserAccountInfo (): Promise<{ data: mastodonentities.AuthenticatedAccount }> {
  return Vue.http.get(patchApiUri('/api/v1/accounts/verify_credentials')) as any
}

export {
  fetchAccountInfoById,
  fetchCurrentUserAccountInfo
}
