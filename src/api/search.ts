import Vue from 'vue'
import { mastodonentities } from '@/interface'
import { patchApiUri } from '@/util'

export default {
  /**
   * @param q The search query
   * @param resolve Whether to resolve non-local accounts (default: don't resolve)
   * */
  getSearchResults (q: string, resolve: boolean = false): Promise<{ data: mastodonentities.SearchResults }> {
    return Vue.http.get(patchApiUri('/api/v1/search'), {
      params: {
        q, resolve
      }
    }) as any
  }
}
