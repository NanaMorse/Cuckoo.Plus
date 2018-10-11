declare module 'vue/types/vue' {
  interface routerInfo { path: string, name: string }

  interface Vue {
    $routersInfo: {
      empty: routerInfo
      home: routerInfo
      welcome: routerInfo
    }
  }
}

export const RoutersInfo = {
  empty: {
    path: '/',
    name: 'empty'
  },

  home: {
    path: '/home',
    name: 'home'
  },

  welcome: {
    path: '/welcome',
    name: 'welcome'
  }
};
