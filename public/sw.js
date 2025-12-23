const CACHE_VERSION = "v1";
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;
const RUNTIME_CACHE = `app-runtime-${CACHE_VERSION}`;
const OFFLINE_URL = "/";

// Files to cache on install (app shell)
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json"];

// Install event - cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch((error) => {
          console.warn("Failed to cache some assets:", error);
          // Continue even if some assets fail to cache
          return cache.add(OFFLINE_URL);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes(CACHE_VERSION)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - network first for dynamic content, cache first for static
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // API routes - network first with timeout
  if (url.pathname.startsWith("/api/") || url.pathname.includes("supabase")) {
    event.respondWith(fetchWithTimeout(request, 10000));
    return;
  }

  // HTML pages - network first with fallback to cache
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response.ok) return createOfflineResponse();
          // Cache successful HTML responses
          const cache = caches.open(RUNTIME_CACHE);
          cache.then((c) => c.put(request, response.clone()));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || createOfflineResponse();
          });
        })
    );
    return;
  }

  // Static assets - cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (!response.ok) return cached;

          // Clone response before using it (important!)
          const responseToCache = response.clone();
          const cache = caches.open(RUNTIME_CACHE);

          if (response.ok && response.status === 200) {
            cache.then((c) => c.put(request, responseToCache));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});

// Helper: Fetch with timeout
function fetchWithTimeout(request, timeout) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("fetch timeout")), timeout)
    ),
  ]).catch((error) => {
    console.warn("Fetch failed:", error);
    return caches.match(request) || createOfflineResponse();
  });
}

// Helper: Create offline response
function createOfflineResponse() {
  return new Response(
    '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f5f5f0;color:#333}div{text-align:center}</style></head><body><div><h1>Offline</h1><p>You appear to be offline. Please check your connection.</p></div></body></html>',
    {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 503,
      statusText: "Service Unavailable",
    }
  );
}

// Background sync - for form submissions when back online
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-bookings") {
    event.waitUntil(syncBookings());
  }
});

async function syncBookings() {
  try {
    // Implementation would sync pending bookings from IndexedDB
    console.log("Syncing bookings...");
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

// Push notifications (for future implementation)
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const options = {
    body: data.body || "New notification",
    icon: "/icon-192.png",
    badge: "/badge-72.png",
    tag: "notification",
    requireInteraction: false,
  };
  event.waitUntil(
    self.registration.showNotification(data.title || "Dr. Enas", options)
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      // Open new window if none exist
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
