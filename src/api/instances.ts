import Vue from 'vue'
import { mastodonentities } from '@/interface'
import { patchApiUri } from '@/util'

async function getCustomEmojis (): Promise<{ data: Array<mastodonentities.Emoji> }> {
  return Vue.http.get(patchApiUri('/api/v1/custom_emojis')) as any
}

export {
  getCustomEmojis
}
