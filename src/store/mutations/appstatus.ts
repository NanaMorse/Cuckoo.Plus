import Vue from 'vue'
import { getTargetStatusesList } from '@/util'
import { ThemeNames } from '@/constant'
import { cuckoostore, mastodonentities } from '@/interface'
import ThemeManager from '@/themes'

export default {
  updateDrawerOpenStatus (state: cuckoostore.stateInfo, isDrawerOpened: boolean) {
    state.appStatus.isDrawerOpened = isDrawerOpened
  },

  updateNotificationsPanelStatus (state: cuckoostore.stateInfo, isNotificationsPanelOpened: boolean) {
    state.appStatus.isNotificationsPanelOpened = isNotificationsPanelOpened
  },

  updatePostStatusDialogStatus (state: cuckoostore.stateInfo, isPostStatusDialogOpened: boolean) {
    state.appStatus.isPostStatusDialogOpened = isPostStatusDialogOpened

    if (!isPostStatusDialogOpened) {
      Vue.set(state.appStatus.postStatusDialogExternalInfo, 'reblog', null)
    }
  },

  updatePostStatusDialogExternalInfo (state: cuckoostore.stateInfo, externalInfo: {
    reblog: mastodonentities.Status
  }) {
    if (!externalInfo) return
    Vue.set(state.appStatus.postStatusDialogExternalInfo, 'reblog', externalInfo.reblog)
  },

  updateUnreadNotificationCount (state: cuckoostore.stateInfo, count: number) {
    state.appStatus.unreadNotificationCount = count
  },

  updateDocumentWidth (state: cuckoostore.stateInfo) {
    state.appStatus.documentWidth = document.body.clientWidth
  },

  updateTheme (state: cuckoostore.stateInfo, newThemeName: string) {
    if (!Object.keys(ThemeNames).some(key => ThemeNames[key] === newThemeName)) return
    state.appStatus.settings.theme = newThemeName

    ThemeManager.setTheme(newThemeName)

    localStorage.setItem('theme', newThemeName)
  },

  updateTags (state: cuckoostore.stateInfo, newTags: Array<string>) {
    Vue.set(state.appStatus.settings, 'tags', newTags)
    localStorage.setItem('tags', JSON.stringify(newTags))
  },

  updateMultiLineMode (state: cuckoostore.stateInfo, newMode: boolean) {
    state.appStatus.settings.multiLineMode = newMode
    localStorage.setItem('multiLineMode', JSON.stringify(newMode))
  },

  updateShowSensitiveContentMode (state: cuckoostore.stateInfo, newMode: boolean) {
    state.appStatus.settings.showSensitiveContentMode = newMode
    localStorage.setItem('showSensitiveContentMode', JSON.stringify(newMode))
  },

  updateRealTimeLoadStatusMode (state: cuckoostore.stateInfo, newMode: boolean) {
    state.appStatus.settings.realTimeLoadStatusMode = newMode
    localStorage.setItem('realTimeLoadStatusMode', JSON.stringify(newMode))
  },

  updateLocale (state: cuckoostore.stateInfo, newLocale: string) {
    state.appStatus.settings.locale = newLocale
    localStorage.setItem('locale', newLocale)
  },

  unShiftStreamStatusesPool (state: cuckoostore.stateInfo, { newStatusIdList, timeLineType, hashName }) {
    const targetStatusesPool = getTargetStatusesList(state.appStatus.streamStatusesPool, timeLineType, hashName)
    newStatusIdList = newStatusIdList.filter(id => {
      return targetStatusesPool.indexOf(id) === -1
    })

    targetStatusesPool.unshift(...newStatusIdList)
  },

  clearStreamStatusesPool (state: cuckoostore.stateInfo, { timeLineType, hashName }) {
    const targetStatusesPool = getTargetStatusesList(state.appStatus.streamStatusesPool, timeLineType, hashName)
    targetStatusesPool.splice(0, targetStatusesPool.length)
  },

  updatePostPrivacy (state: cuckoostore.stateInfo, newPostPrivacy: string) {
    state.appStatus.settings.postPrivacy = newPostPrivacy
    localStorage.setItem('postPrivacy', newPostPrivacy)
  },

  updatePostMediaAsSensitiveMode (state: cuckoostore.stateInfo, newMode: boolean) {
    state.appStatus.settings.postMediaAsSensitiveMode = newMode
    localStorage.setItem('postMediaAsSensitiveMode', JSON.stringify(newMode))
  },

  updateOnlyMentionTargetUserMode (state: cuckoostore.stateInfo, newMode: boolean) {
    state.appStatus.settings.onlyMentionTargetUserMode = newMode
    localStorage.setItem('onlyMentionTargetUserMode', JSON.stringify(newMode))
  },

  updateMaximumNumberOfColumnsInMultiLineMode (state: cuckoostore.stateInfo, newNumber: number) {
    state.appStatus.settings.maximumNumberOfColumnsInMultiLineMode = newNumber
    localStorage.setItem('maximumNumberOfColumnsInMultiLineMode', JSON.stringify(newNumber))
  },

  updateEmulateGPlusLikeReBlogMode (state: cuckoostore.stateInfo, newMode: boolean) {
    state.appStatus.settings.emulateGPlusLikeReBlogMode = newMode
    localStorage.setItem('emulateGPlusLikeReBlogMode', JSON.stringify(newMode))
  }
}
