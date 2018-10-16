import store from '@/store'
import { TimeLineTypes, RoutersInfo } from '@/constant'
import { Route } from "vue-router";

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

export function getTimeLineTypeAndHashName (route: Route) {
  let timeLineType = '', hashName = ''
  // @ts-ignore
  if (route.name === RoutersInfo.defaulttimelines.name) {
    timeLineType = route.params.timeLineType
  }
  // @ts-ignore
  else if (route.name === RoutersInfo.tagtimelines.name) {
    timeLineType = TimeLineTypes.TAG
    hashName = route.params.tagName
  }
  // @ts-ignore
  else if (route.name === RoutersInfo.listtimelines.name) {
    timeLineType = TimeLineTypes.LIST
    hashName = route.params.listName
  }

  return { timeLineType, hashName }
}
