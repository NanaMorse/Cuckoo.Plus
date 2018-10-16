import Vue from 'vue'
import Router, { Route } from 'vue-router'
import store from '../store'
import { RoutersInfo, TimeLineTypes } from '@/constant'
import * as api from '@/api'
import { isBaseTimeLine } from '@/util'

import TimeLinesPage from '@/components/pages/Timelines.vue'
import OAuthPage from '@/components/pages/OAuth.vue'

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
      path: RoutersInfo.timelines.path,
      name: RoutersInfo.timelines.name,
      component: TimeLinesPage,
      children: [
        {
          path: RoutersInfo.defaulttimelines.path,
          name: RoutersInfo.defaulttimelines.name
        },
        {
          path: RoutersInfo.tagtimelines.path,
          name: RoutersInfo.tagtimelines.name
        },
        {
          path: RoutersInfo.listtimelines.path,
          name: RoutersInfo.listtimelines.name
        }
      ],
    },

    {
      path: RoutersInfo.oauth.path,
      name: RoutersInfo.oauth.name,
      component: OAuthPage,
      beforeEnter (to, from, next) {
        if (!checkShouldReRegisterApplication(to, from)) {
          next(RoutersInfo.empty.path)
        }

        next()
      },
      meta: {
        hideHeader: true
      }
    }
  ]
} as any);

function checkShouldReRegisterApplication (to, from): boolean {
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

  return !(clientId && clientSecret && code)
}

const beforeEachHooks = {
  // children routes can't use in-router guide...
  beforeDefaultTimeLines (to: Route, from, next) {
    if (to.name === RoutersInfo.defaulttimelines.name) {
      if (!isBaseTimeLine(to.params.timeLineType)) {
        return next(homePath)
      }
    }

    next()
  }
}

router.beforeEach(async (to, from, next) => {

  const shouldReRegisterApplication = checkShouldReRegisterApplication(to, from)

  if (to.name !== RoutersInfo.oauth.name) {
    // need register
    if (shouldReRegisterApplication) {
      localStorage.clear()
      return next(RoutersInfo.oauth.path)
    }

    // should get accessToken
    if (!store.state.OAuthInfo.accessToken) {
      try {
        const result = await api.oauth.fetchOAuthToken()
        store.commit('updateOAuthAccessToken', result.data.access_token)
      } catch (e) {
        localStorage.clear()
        return next(RoutersInfo.oauth.path)
      }
    }

    // todo access token expired

    // should get currentUserAccount
    if (!store.state.currentUserAccount) {
      try {
        const result = await api.accounts.fetchCurrentUserAccountInfo()
        store.commit('updateCurrentUserAccount', result.data)
      } catch (e) {

      }
    }
  }

  next()
});

Object.keys(beforeEachHooks).forEach(key => {
  router.beforeEach(beforeEachHooks[key])
})

export default router
