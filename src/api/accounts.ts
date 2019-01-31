import Vue from 'vue'
import { mastodonentities } from '@/interface'
import { patchApiUri } from '@/util'

async function fetchAccountInfoById () {

}

async function fetchCurrentUserAccountInfo (): Promise<{ data: mastodonentities.AuthenticatedAccount }> {
  return Vue.http.get(patchApiUri('/api/v1/accounts/verify_credentials')) as any
}

async function fetchRelationships (idList: Array<string>) {
  return Vue.http.get(patchApiUri('/api/v1/accounts/relationships'), {
    params: {
      id: idList
    }
  }) as any
}

export {
  fetchAccountInfoById,
  fetchCurrentUserAccountInfo,
  fetchRelationships
}
