const Loading = require('muse-ui-loading').default
import Vue from 'vue'
import Router, { Route } from 'vue-router'
import store from '../store'
import { RoutersInfo } from '@/constant'
import * as Api from '@/api'
import { isBaseTimeLine } from '@/util'

import TimeLinesPage from '@/pages/Timelines'
import OAuthPage from '@/pages/OAuth'
import StatusesPage from '@/pages/Statuses'
import Settings from '@/pages/Settings'

Vue.use(Router)

const homePath = '/timelines/home'

const router = new Router({
  routes: [

    {
      path: RoutersInfo.empty.path,
      redirect: homePath
    },

    {
      path: RoutersInfo.timelines.path,
      redirect: homePath
    },

    {
      path: RoutersInfo.statuses.path,
      name: RoutersInfo.statuses.name,
      component: StatusesPage
    },

    {
      path: RoutersInfo.timelines.path,
      name: RoutersInfo.timelines.name,
      component: TimeLinesPage,
      meta: {
        needOAuth: true
      },
      children: [
        {
          path: RoutersInfo.defaulttimelines.path,
          name: RoutersInfo.defaulttimelines.name,
          meta: {
            keepAlive: true,
            needOAuth: true
          }
        },
        {
          path: RoutersInfo.tagtimelines.path,
          name: RoutersInfo.tagtimelines.name,
          meta: {
            keepAlive: true,
            needOAuth: true
          }
        },
        {
          path: RoutersInfo.listtimelines.path,
          name: RoutersInfo.listtimelines.name,
          meta: {
            keepAlive: true,
            needOAuth: true
          }
        }
      ]
    },

    {
      path: RoutersInfo.oauth.path,
      name: RoutersInfo.oauth.name,
      component: OAuthPage,
      beforeEnter (to, from, next) {
        if (!checkShouldRegisterApplication(to, from)) {
          next(RoutersInfo.empty.path)
        }

        next()
      },
      meta: {
        hideHeader: true,
        hideDrawer: true
      }
    },

    {
      path: RoutersInfo.settings.path,
      name: RoutersInfo.settings.name,
      component: Settings,
      meta: {
        needOAuth: true
      }
    }
  ]
} as any);

function checkShouldRegisterApplication (to, from): boolean {
  // should have clientId/clientSecret/code
  const { clientId, clientSecret } = store.state.OAuthInfo

  let code = store.state.OAuthInfo.code
  if (from.path === '/' && !code) {
    if (location.href.indexOf("?code=") !== -1) {
      code = location.href.replace(location.origin + location.pathname + "?code=", "")
      code = code.replace('#/', '')
      // todo maybe shouldn't put this here?
      store.commit('updateOAuthCode', code)
    }
  }

  return !(clientId && clientSecret && store.state.mastodonServerUri && code)
}

const statusInitManager = new class {

  private hasInitFetchNotifications: boolean = false

  private hasInitStreamConnection: boolean = false

  private hasUpdateOAuthAccessToken: boolean = false

  private hasUpdateCurrentUserAccount: boolean = false

  private hasUpdateCustomEmojis: boolean = false

  private loadingInstance = null

  private loadingProcessList = []

  private startLoading (process: string) {
    this.loadingProcessList.push(process)
    this.loadingInstance = Loading() || this.loadingInstance
  }

  private endLoading () {
    if (this.loadingProcessList.every(process => this[process])) {
      try {
        this.loadingInstance && this.loadingInstance.close()
      } catch (e) {

      }
    }
  }

  public initFetchNotifications () {
    if (!store.state.notifications.length && !this.hasInitFetchNotifications) {
      store.dispatch('updateNotifications')
      this.hasInitFetchNotifications = true
    }
  }

  public initStreamConnection () {
    if (!this.hasInitStreamConnection) {
      Api.streaming.openUserConnection()
      this.hasInitStreamConnection = true
    }
  }

  public async updateCurrentUserAccount () {
    if (!this.hasUpdateCurrentUserAccount) {

      if (!store.state.currentUserAccount) {
        this.startLoading('hasUpdateCurrentUserAccount')
        await store.dispatch('updateCurrentUserAccount')
      } else {
        store.dispatch('updateCurrentUserAccount')
      }

      this.hasUpdateCurrentUserAccount = true
      this.endLoading()
    }
  }

  public async updateOAuthAccessToken () {
    if (!store.state.OAuthInfo.accessToken && !this.hasUpdateOAuthAccessToken) {
      this.startLoading('updateOAuthAccessToken')
      const result = await Api.oauth.fetchOAuthToken()
      store.commit('updateOAuthAccessToken', result.data.access_token)
      this.hasUpdateOAuthAccessToken = true
      this.endLoading()
    }
  }

  public async updateCustomEmojis () {
    if (!this.hasUpdateCustomEmojis) {

      if (!store.state.customEmojis.length) {
        this.startLoading('hasUpdateCustomEmojis')
        await store.dispatch('updateCustomEmojis')
      } else {
        store.dispatch('updateCustomEmojis')
      }

      this.hasUpdateCustomEmojis = true
      this.endLoading()
    }
  }


}

let hasUpdateCurrentUserAccount = false

const beforeEachHooks = {
  async beforeEachRoute (to, from, next) {

    await statusInitManager.updateCustomEmojis()

    next()
  },

  // children routes can't use in-router guide...
  beforeDefaultTimeLines (to: Route, from, next) {
    if (to.name === RoutersInfo.defaulttimelines.name) {
      if (!isBaseTimeLine(to.params.timeLineType)) {
        return next(homePath)
      }
    }

    next()
  },

  async beforeNeedOAuthRoutes (to, from, next) {
    if (to.meta.needOAuth) {

      // check if need to register
      if (checkShouldRegisterApplication(to, from)) {
        store.commit('clearAllOAuthInfo')
        return next(RoutersInfo.oauth.path)
      }

      // check if need to get token

      // check if should to be blocked by user fetch
      try {
        await statusInitManager.updateOAuthAccessToken()
        await statusInitManager.updateCurrentUserAccount()
      } catch (e) {
        store.commit('clearAllOAuthInfo')
        return next(RoutersInfo.oauth.path)
      }

      // should fetch notifications
      statusInitManager.initFetchNotifications()
    }

    next()
  },

  beforeHomeTimeLine (to, from, next) {
    if (to.path === homePath) {
      statusInitManager.initStreamConnection()
    }

    next()
  }
}

Object.keys(beforeEachHooks).forEach(key => {
  router.beforeEach(beforeEachHooks[key])
})

export default router
