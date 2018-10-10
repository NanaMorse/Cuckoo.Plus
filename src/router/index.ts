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

router.beforeEach((to, from, next) => {

  // todo redirect logic, need code info

  const clientId = store.state.OAuthInfo.clientId

  if (to.path === '/welcome') {
    if (clientId) next('/')
  } else {
    if (!clientId) next('/welcome')
  }

  next();
});

export default router
