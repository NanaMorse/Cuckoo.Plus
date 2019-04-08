import store from '@/store'
import { TimeLineTypes, RoutersInfo, I18nTags, VisibilityTypes } from '@/constant'
import { Route } from "vue-router"
import Formatter from "./formatter"
import { mastodonentities } from "@/interface"
import * as _ from 'underscore'

export function patchApiUri (uri: string): string {
  const targetServerUri = store.state.mastodonServerUri || 'https://pawoo.net'
  return `${targetServerUri}${uri}`
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
  return [TimeLineTypes.HOME, TimeLineTypes.PUBLIC, TimeLineTypes.DIRECT, TimeLineTypes.LOCAL].indexOf(timeLineType) !== -1
}

export function getTimeLineTypeAndHashName (route: Route) {
  let timeLineType = '', hashName = ''
  if (route.name === RoutersInfo.defaulttimelines.name) {
    timeLineType = route.params.timeLineType
  }
  else if (route.name === RoutersInfo.tagtimelines.name) {
    timeLineType = TimeLineTypes.TAG
    hashName = route.params.tagName
  }
  else if (route.name === RoutersInfo.listtimelines.name) {
    timeLineType = TimeLineTypes.LIST
    hashName = route.params.listName
  }

  return { timeLineType, hashName }
}

export function getTargetStatusesList (listMap, timeLineType, hashName) {
  let targetStatusesList
  if (isBaseTimeLine(timeLineType)) {
    targetStatusesList = listMap[timeLineType]
  } else {
    targetStatusesList = listMap[timeLineType][hashName]
  }

  return targetStatusesList || []
}

const visibilityTypeToDescMap = {
  [VisibilityTypes.PUBLIC]: {
    descTag: I18nTags.common.status_visibility_public_desc,
    icon: 'public'
  },
  [VisibilityTypes.UNLISTED]: {
    descTag: I18nTags.common.status_visibility_unlisted_desc,
    icon: 'lock_open'
  },
  [VisibilityTypes.PRIVATE]: {
    descTag: I18nTags.common.status_visibility_private_desc,
    icon: 'lock'
  },
  [VisibilityTypes.DIRECT]: {
    descTag: I18nTags.common.status_visibility_direct_desc,
    icon: 'email'
  }
}
export function getVisibilityDescInfo (visibilityType: string) {
  return visibilityTypeToDescMap[visibilityType]
}

export async function prepareRootStatus (status: mastodonentities.Status) {
  const contextMap = store.state.contextMap
  const statusMap = store.state.statusMap

  if (!contextMap[status.id]) {
    await store.dispatch('updateContextMap', status.id)
  }

  let targetStatus = status

  const targetStatusContext = contextMap[status.id]

  if (!targetStatusContext) return

  if (targetStatusContext.ancestors.length) {
    targetStatus = statusMap[targetStatusContext.ancestors[0]]
  }

  store.dispatch('updateContextMap', targetStatus.id)

  return targetStatus
}


let formatter
export function formatHtml(html: string, options: { externalEmojis } = { externalEmojis: [] }): string {
  if (!formatter) {
    formatter = new Formatter(store.state.customEmojis)
  }

  formatter.updateCustomEmojiMap(options.externalEmojis)

  // create a parent node to contain the input html
  const parentNode = document.createElement('template')
  parentNode.innerHTML = html

  walkTextNodes(parentNode.content, (parentNode, textNode) => {
    const spanNode = document.createElement('span')
    spanNode.innerHTML = formatter.format(_.escape(textNode.textContent))
    parentNode.replaceChild(spanNode, textNode)
  })

  return parentNode.innerHTML
}

export function formatAccountDisplayName (account: mastodonentities.Account) {
  return formatHtml(store.getters['getAccountDisplayName'](account), { externalEmojis: account.emojis })
}

export function extractText(html: string): string {
  let text = ""

  // create a parent node to contain the input html
  const parentNode = document.createElement('template')
  parentNode.innerHTML = html

  walkTextNodes(parentNode.content, (parentNode, textNode) => {
    text += (textNode.textContent + " ")
  })

  return text
}

const maxImageSize = 7.8 * 1024 * 1024
export async function resetImageFileSizeForUpload (file: File) {
  if (file.size < maxImageSize) return new Promise(r => r(file))

  const oldImage = new Image()
  oldImage.src = window.URL.createObjectURL(file)

  // todo set to 1280 width for now
  const newWidth = 1280

  return new Promise(resolve => {
    oldImage.onload = () => {
      const newHeight = oldImage.height * newWidth / oldImage.width
      const canvas = document.createElement('canvas')
      const canvasContext = canvas.getContext('2d')

      canvas.width = newWidth
      canvas.height = newHeight

      canvasContext.drawImage(oldImage, 0, 0, newWidth, newHeight)

      canvas.toBlob((blob) => {
        resolve(blob)
      })
    }
  })
}

function walkTextNodes(node, textNodeHandler) {
  if (node) {
    for (let i = 0; i < node.childNodes.length; ++i) {
      const childNode = node.childNodes[i]
      if (childNode.nodeType === 3) {
        textNodeHandler(node, childNode)
      } else if (childNode.nodeType === 1 || childNode.nodeType === 9 || childNode.nodeType === 11) {
        walkTextNodes(childNode, textNodeHandler)
      }
    }
  }
}

function easeInOutQuad (t, b, c, d) {
  t /= d/2
  if (t < 1) return c/2*t*t + b
  t--
  return -c/2 * (t*(t-2) - 1) + b
}

const requestAnimFrame = (function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(callback){window.setTimeout(callback,1000/60);};})()

export function animatedScrollTo (element: HTMLElement, to: number, duration: number, callback?) {
  const start = element.scrollTop,
    change = to - start,
    animationStart = +new Date()
  let animating = true
  let lastpos = null

  const animateScroll = function() {
    if (!animating) return

    requestAnimFrame(animateScroll)

    const now = +new Date()
    const val = Math.floor(easeInOutQuad(now - animationStart, start, change, duration))

    lastpos = val
    element.scrollTop = val

    if (now > animationStart + duration) {
      element.scrollTop = to

      animating = false
      if (callback) { callback() }
    }
  }

  requestAnimFrame(animateScroll)
}

export function isContentStatusForExperimentalReBlog (currentUserAccount, status: mastodonentities.Status) {
  // it's private status
  if (status.visibility !== VisibilityTypes.DIRECT) return false

  // only user self's reblog content should check out
  if (status.account.id !== currentUserAccount.id) return false

  if (status.in_reply_to_account_id !== currentUserAccount.id) return false
  // todo in some special situation?

  return true
}
