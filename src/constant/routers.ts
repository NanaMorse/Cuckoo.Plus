export const RoutersInfo = {
  empty: {
    path: '/',
    name: 'empty'
  },

  timelines: {
    path: '/timelines',
    name: 'timelines'
  },

  defaulttimelines: {
    path: ':timeType',
    name: 'defaulttimelines'
  },

  tagtimelines: {
    path: 'tag/:tagName',
    name: 'tagtimelines'
  },

  listtimelines: {
    path: 'list/:listName',
    name: 'listtimelines'
  },

  home: {
    path: '/home',
    name: 'home'
  },

  oauth: {
    path: '/oauth',
    name: 'oauth'
  }
};
