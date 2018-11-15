import { getTargetStatusesList } from '@/util'
import { ThemeNames } from '@/constant'
import { cuckoostore } from '@/interface'
import ThemeManager from '@/themes'

export default {
  updateDrawerOpenStatus (state: cuckoostore.stateInfo, isDrawerOpened: boolean) {
    state.appStatus.isDrawerOpened = isDrawerOpened
  },

  updateNotificationsPanelStatus (state: cuckoostore.stateInfo, isNotificationsPanelOpened: boolean) {
    state.appStatus.isNotificationsPanelOpened = isNotificationsPanelOpened
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
  }
}