import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { RoutersInfo } from '@/constant/common'

import HomePage from '@/components/pages/Home.vue'
import OAuthPage from '@/components/pages/OAuth.vue'

Vue.use(Router);

const router = new Router({
  routes: [
    // todo timelines下的子路由
    {
      path: RoutersInfo.empty.path,
      name: RoutersInfo.empty.name,
      component: HomePage
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

router.beforeEach((to, from, next) => {

  const shouldReRegisterApplication = checkShouldReRegisterApplication(to)

  if (to.path === RoutersInfo.oauth.path) {
    if (!shouldReRegisterApplication) next(RoutersInfo.empty.path)
  } else {
    if (shouldReRegisterApplication) {
      localStorage.clear()
      next(RoutersInfo.oauth.path)
    }
  }

  next();
});

export default router
