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

let hasInitFetchNotifications = false
let hasInitStreamConnection = false

const beforeEachHooks = {
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
      if (!store.state.OAuthInfo.accessToken) {
        try {
          const loading = Loading()
          const result = await Api.oauth.fetchOAuthToken()
          store.commit('updateOAuthAccessToken', result.data.access_token)
          loading.close()
        } catch (e) {
          store.commit('clearAllOAuthInfo')
          return next(RoutersInfo.oauth.path)
        }
      }

      // check if should to be blocked by user fetch
      try {
        if (!store.state.currentUserAccount) {
          const loading = Loading()
          await store.dispatch('updateCurrentUserAccount')
          loading.close()
        } else {
          store.dispatch('updateCurrentUserAccount')
        }
      } catch (e) {
        if (e.status === 401) {
          store.commit('clearAllOAuthInfo')
          return next(RoutersInfo.oauth.path)
        }
      }

      // should fetch notifications
      if (!store.state.notifications.length && !hasInitFetchNotifications) {
        store.dispatch('updateNotifications')
        hasInitFetchNotifications = true
      }
    }

    next()
  },

  beforeHomeTimeLine (to, from, next) {
    if (to.path === homePath) {
      if (!hasInitStreamConnection) {
        Api.streaming.openUserConnection()
        hasInitStreamConnection = true
      }
    }

    next()
  }
}

Object.keys(beforeEachHooks).forEach(key => {
  router.beforeEach(beforeEachHooks[key])
})

export default router
