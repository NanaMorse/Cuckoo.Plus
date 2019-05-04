import Vue from 'vue'
import { mastodonentities } from '@/interface'
import { patchApiUri } from '@/util'

interface updateAccountFormData {
  // The name to display in the user's profile
  display_name?: string
  // A new biography for the user
  note?: string
  // An avatar for the user (encoded using multipart/form-data)
  avatar?: FormData
  // A header image for the user (encoded using multipart/form-data)
  header?: FormData
  // Manually approve followers?
  locked?: boolean
  // (2.4 or later) extra source attribute from verify_credentials
  source?: {
    privacy?: string
    sensitive?: boolean
    note?: string
    fields?: Array<any>
  }
}

async function fetchAccountInfoById (id: string): Promise<{ data: mastodonentities.Account }> {
  return Vue.http.get(patchApiUri(`/api/v1/accounts/${id}`)) as any
}

async function fetchCurrentUserAccountInfo (): Promise<{ data: mastodonentities.AuthenticatedAccount }> {
  return Vue.http.get(patchApiUri('/api/v1/accounts/verify_credentials')) as any
}

async function updateUserAccountInfo (formData: updateAccountFormData): Promise<{ data: mastodonentities.AuthenticatedAccount }> {
  return Vue.http.patch(patchApiUri('/api/v1/accounts/update_credentials'), formData) as any
}

async function fetchRelationships (idList: Array<string>) {
  return Vue.http.get(patchApiUri('/api/v1/accounts/relationships'), {
    params: {
      id: idList
    }
  }) as any
}

async function followAccountById (id: string) {
  return Vue.http.post(patchApiUri(`/api/v1/accounts/${id}/follow`)) as any
}

async function unFollowAccountById (id: string) {
  return Vue.http.post(patchApiUri(`/api/v1/accounts/${id}/unfollow`)) as any
}

export {
  fetchAccountInfoById,
  fetchCurrentUserAccountInfo,
  updateUserAccountInfo,
  fetchRelationships,
  followAccountById,
  unFollowAccountById
}
