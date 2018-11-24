import Vue from 'vue'
import { mastodonentities } from '@/interface'
import { patchApiUri } from '@/util'

let preSearchRequest

/**
 * @param q The search query
 * @param resolve Whether to resolve non-local accounts (default: don't resolve)
 * */
async function getSearchResults (q: string, resolve: boolean = false): Promise<{ data: mastodonentities.SearchResults }> {
  return Vue.http.get(patchApiUri('/api/v1/search'), {
    params: {
      q, resolve
    },
    before(request) {
      if (preSearchRequest) preSearchRequest.abort()
      preSearchRequest = request
    }
  }) as any
}

export {
  getSearchResults
}
