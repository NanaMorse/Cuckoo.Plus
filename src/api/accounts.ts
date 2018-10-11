import Vue from 'vue'
import { mastodonentities } from '@/interface'
import HttpResponse = vuejs.HttpResponse
import { patchApiUri } from './util'

async function fetchAccountInfoById () {

}

interface authenticatedAccount extends mastodonentities.Account {
  // Selected preference: Default privacy of new toots
  privacy: string
  // Selected preference: Mark media as sensitive by default?
  sensitive: boolean
  // Plain-text version of the account's note
  note: string
  // Array of profile metadata, each element has 'name' and 'value'
  fields: Array<any>
}

interface fetchCurrentUserAccountInfoReturnData extends HttpResponse {
  data: authenticatedAccount
}

async function fetchCurrentUserAccountInfo (): Promise<fetchCurrentUserAccountInfoReturnData> {
  return Vue.http.get(patchApiUri('/api/v1/accounts/verify_credentials')) as any
}

export {
  fetchAccountInfoById,
  fetchCurrentUserAccountInfo
}
