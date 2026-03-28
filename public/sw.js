const CACHE_NAME = 'mediatoolkit-v1'

const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/library',
  '/login',
  '/register',
  '/offline'
]

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Some pages might fail, that's ok
      })
    })
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

// Fetch — network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip API calls and external requests — always go to network
  if (url.pathname.startsWith('/api/') || url.origin !== self.location.origin) {
    return
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful page responses
        if (response.ok && request.method === 'GET') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone)
          })
        }
        return response
      })
      .catch(() => {
        // Offline — try cache
        return caches.match(request).then((cached) => {
          if (cached) return cached
          // If no cache, show offline page
          if (request.mode === 'navigate') {
            return caches.match('/offline')
          }
          return new Response('Offline', { status: 503 })
        })
      })
  )
})
