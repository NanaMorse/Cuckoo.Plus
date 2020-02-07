const version = '0.3.21'
const CACHE = version + ':CP'
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
]

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

      const request = event.request
      const url = request.url

      const isRequestImage = event.request.destination === 'image'

      if (!this.isCacheFilePath(url) && !isRequestImage) return

      return event.respondWith(caches.open(CACHE).then(cache => {
        return cache.match(request).then(response => {
          if (response) return response

          return fetch(request).then(response => {
            if (response.ok) cache.put(request, response.clone())
            return response
          }).catch()
        })
      }))

    })
  }

  isCacheFilePath (url) {
    return cacheFilePaths.some(filePath => url.endsWith(filePath))
  }
}

new SW()
