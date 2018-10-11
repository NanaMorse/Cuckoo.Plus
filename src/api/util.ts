import store from '@/store'

export function patchApiUri (uri: string): string {
  return `${store.state.mastodonServerUri}${uri}`
}
