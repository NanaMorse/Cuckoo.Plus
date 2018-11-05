import Vue from 'vue'
import { mastodonentities } from '@/interface'
import { patchApiUri } from '@/util'

async function postMediaFile (formData): Promise<{ data: mastodonentities.Attachment }> {
  return Vue.http.post(patchApiUri('/api/v1/media'), formData) as any
}

export {
  postMediaFile
}
