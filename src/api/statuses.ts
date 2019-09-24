import Vue from 'vue'
import { mastodonentities } from '@/interface'
import { patchApiUri, generateUniqueKey } from '@/util'
import { VisibilityTypes } from '@/constant'

async function getStatusById (id: string): Promise<{ data: mastodonentities.Status }> {
  return Vue.http.get(patchApiUri(`/api/v1/statuses/${id}`)) as any
}

interface postStatusFormData {
  // The text of the status
  status: string
  // local ID of the status you want to reply to
  inReplyToId?: string
  // Array of media IDs to attach to the status (maximum 4)
  mediaIds?: Array<string>
  // Set this to mark the media of the status as NSFW
  sensitive?: boolean
  // Text to be shown as a warning before the actual content
  spoilerText?: string
  // Either "direct", "private", "unlisted" or "public"
  visibility?: string
  // ISO 639-2 language code of the toot, to skip automatic detection
  language?: string
}

async function postStatus (formData: postStatusFormData): Promise<{ data: mastodonentities.Status }> {
  const apiFormData: any = {}

  apiFormData.status = formData.status
  apiFormData.in_reply_to_id = formData.inReplyToId
  apiFormData.media_ids = formData.mediaIds
  apiFormData.sensitive = formData.sensitive
  apiFormData.spoiler_text = formData.spoilerText
  apiFormData.visibility = formData.visibility || VisibilityTypes.PUBLIC
  apiFormData.language = formData.language

  const config = {
    headers: {
      'Idempotency-Key': generateUniqueKey()
    }
  }

  return Vue.http.post(patchApiUri(`/api/v1/statuses`), apiFormData, config) as any
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

async function favouriteStatusById (id: string): Promise<{ data: mastodonentities.Status }> {
  return Vue.http.post(patchApiUri(`/api/v1/statuses/${id}/favourite`)) as any
}

async function unFavouriteStatusById (id: string): Promise<{ data: mastodonentities.Status }> {
  return Vue.http.post(patchApiUri(`/api/v1/statuses/${id}/unfavourite`)) as any
}

async function reblogStatusById (id: string): Promise<{ data: mastodonentities.Status }> {
  return Vue.http.post(patchApiUri(`/api/v1/statuses/${id}/reblog`)) as any
}

async function unReblogStatusById (id: string): Promise<{ data: mastodonentities.Status }> {
  return Vue.http.post(patchApiUri(`/api/v1/statuses/${id}/unreblog`)) as any
}

async function deleteStatusById (id: string) {
  return Vue.http.delete(patchApiUri(`/api/v1/statuses/${id}`)) as any
}

async function muteStatusById (id: string) {
  return Vue.http.post(patchApiUri(`/api/v1/statuses/${id}/mute`)) as any
}

async function unMuteStatusById (id: string) {
  return Vue.http.post(patchApiUri(`/api/v1/statuses/${id}/unmute`)) as any
}

async function getStatusCardInfoById (id: string): Promise<{ data: mastodonentities.Card }> {
  return Vue.http.get(patchApiUri(`/api/v1/statuses/${id}/card`)) as any
}

export {
  getStatusById,
  postStatus,
  getStatusContextById,
  getReBloggedAccountsById,
  getFavouritedAccountsById,
  favouriteStatusById,
  unFavouriteStatusById,
  reblogStatusById,
  unReblogStatusById,
  deleteStatusById,
  muteStatusById,
  unMuteStatusById,
  getStatusCardInfoById
}
