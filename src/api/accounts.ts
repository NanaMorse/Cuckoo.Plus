import Vue from 'vue'
import store from '@/store'
import { mastodonentities } from '@/interface'
import HttpResponse = vuejs.HttpResponse

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
  const apiUri = `${store.state.mastodonServerUri}/api/v1/accounts/verify_credentials?access_token=${store.state.OAuthInfo.accessToken}`

  return Vue.http.get(apiUri) as any
}

export {
  fetchAccountInfoById,
  fetchCurrentUserAccountInfo
}