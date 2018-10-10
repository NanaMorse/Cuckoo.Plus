import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import HomePage from '@/components/pages/Home.vue'
import WelcomePage from '@/components/pages/Welcome.vue'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'empty',
      component: HomePage
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: WelcomePage
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

  if (to.path === '/welcome') {
    if (!shouldReRegisterApplication) next('/')
  } else {
    if (shouldReRegisterApplication) {
      localStorage.clear()
      next('/welcome')
    }
  }

  next();
});

export default router
