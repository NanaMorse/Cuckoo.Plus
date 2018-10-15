import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { RoutersInfo, TimeLineTypes } from '@/constant'
import * as api from '@/api'

import TimeLinesPage from '@/components/pages/Timelines.vue'
import OAuthPage from '@/components/pages/OAuth.vue'

Vue.use(Router);

const router = new Router({
  routes: [

    {
      path: RoutersInfo.empty.path,
      redirect: '/timelines/home'
    },

    {
      path: RoutersInfo.timelines.path,
      redirect: '/timelines/home'
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
      ]
    },

    {
      path: RoutersInfo.oauth.path,
      name: RoutersInfo.oauth.name,
      component: OAuthPage
    }
  ]
} as any);

function checkShouldReRegisterApplication (to): boolean {
  // should have clientId/clientSecret/code
  const { clientId, clientSecret } = store.state.OAuthInfo

  let code = store.state.OAuthInfo.code
  if (to.path === '/' && !code) {
    if (location.href.indexOf("?code=") !== -1) {
      code = location.href.replace(location.origin + location.pathname + "?code=", "")
      code = code.replace('#/', '')
      // todo maybe shouldn't put this here?
      store.commit('updateOAuthCode', code)
    }
  }

  return !(clientId && clientSecret && code)
}

router.beforeEach(async (to, from, next) => {

  const shouldReRegisterApplication = checkShouldReRegisterApplication(to)

  // need not register
  if (to.path === RoutersInfo.oauth.path) {
    if (!shouldReRegisterApplication) {
      return next(RoutersInfo.empty.path)
    }
  }


  else {
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

export default router
