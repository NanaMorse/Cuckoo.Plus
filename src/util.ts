import store from '@/store'
import { TimeLineTypes } from '@/constant'

export function patchApiUri (uri: string): string {
  return `${store.state.mastodonServerUri}${uri}`
}

export function generateUniqueKey () {
  const toReplacedString = 'xxxxxxxy-yyxx-xxyx-yyxx-xxyyxxxxxyyy'

  return toReplacedString.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8)

    return v.toString(16)
  })
}

export function isBaseTimeLine (timeLineType: string): boolean {
  return [TimeLineTypes.HOME, TimeLineTypes.PUBLIC, TimeLineTypes.DIRECT].indexOf(timeLineType) !== -1
}