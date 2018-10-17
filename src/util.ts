import store from '@/store'
import { TimeLineTypes, RoutersInfo } from '@/constant'
import { Route } from "vue-router";
import { insertHtmlDelsToText } from "./formatter"

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

export function insertHtmlDelsToHtml(html: string): string {
  const parentNode = parseHtmlToParentNode(html)
  const node = parentNode.content

  // https://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
  let n
  const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false)
  while (n = walk.nextNode()) {
    n.nodeValue = insertHtmlDelsToText(n.nodeValue)
  }

  return serializeParentNode(parentNode)
}

// https://stackoverflow.com/questions/10585029/parse-an-html-string-with-js/10585079
function parseHtmlToParentNode(html) {
  var t = document.createElement('template');
  t.innerHTML = html;
  return t
}

// https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
const DomParser = new DOMParser()
function serializeParentNode(node) {
  const doc = DomParser.parseFromString(node.innerHTML, "text/html")
  return doc.documentElement.textContent
}