const version = '0.2.0'
const CACHE = version + ':CP'
const offlineURL = ''
const cacheFilePaths = [
  '/',
  '/manifest.json',
  '/dist/bundle.js',

  'https://fonts.loli.net/css?family=Open+Sans',
  'https://fonts.loli.net/icon?family=Material+Icons',
  'https://cdnjs.loli.net/ajax/libs/moment.js/2.22.2/moment.min.js',
  'https://cdnjs.loli.net/ajax/libs/moment.js/2.22.2/locale/zh-cn.js',
  'https://cdnjs.loli.net/ajax/libs/moment.js/2.22.2/locale/zh-hk.js',
  'https://cdnjs.loli.net/ajax/libs/moment.js/2.22.2/locale/zh-tw.js',
  'https://cdnjs.loli.net/ajax/libs/moment.js/2.22.2/locale/ja.js',
  'https://cdnjs.loli.net/ajax/libs/underscore.js/1.9.1/underscore-min.js',
  'https://unpkg.com/muse-ui/dist/muse-ui.css',
  'https://gstatic.loli.net/s/materialicons/v46/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
].concat(offlineURL)

const swContext = this

class SW {

  constructor () {
    this.initInstallEventListener()
    this.initActivateEventListener()
    this.initFetchEventListener()
  }

  initInstallEventListener () {
    swContext.addEventListener('install', event => {
      event.waitUntil(this.installFiles().then(() => swContext.skipWaiting()))
    })
  }

  installFiles () {
    return caches.open(CACHE).then(cache => {
      return cache.addAll(cacheFilePaths)
    })
  }

  initActivateEventListener () {
    swContext.addEventListener('activate', event => {
      // delete old caches
      event.waitUntil(this.clearOldCaches().then(() => swContext.clients.claim()))
    });
  }

  clearOldCaches () {
    return caches.keys().then(keylist => {
      return Promise.all(keylist.filter(key => key !== CACHE).map(key => caches.delete(key)))
    })
  }

  initFetchEventListener () {
    swContext.addEventListener('fetch', event => {
      // abandon non-GET requests
      if (event.request.method !== 'GET') return

      const url = event.request.url
      event.respondWith(caches.open(CACHE).then(cache => {
        return cache.match(event.request).then(response => {

          if (response) {
            // return cached file
            return response
          }

          // make network request
          return fetch(event.request).then(newreq => {
            if (newreq.ok) cache.put(event.request, newreq.clone())

            return newreq
          }).catch(e => console.log(e))

        });
      }));
    });
  }
}

new SW()
