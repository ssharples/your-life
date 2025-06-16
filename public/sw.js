// Service Worker for handling push notifications
const CACHE_NAME = 'life-os-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(self.clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  event.notification.close();

  // Focus or open the app
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // If app is already open, focus it
      for (const client of clients) {
        if (client.url.includes(self.location.origin)) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      return self.clients.openWindow('/');
    })
  );
});

// Background sync for scheduling notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, scheduledTime } = event.data;
    
    const now = Date.now();
    const delay = scheduledTime - now;
    
    if (delay > 0) {
      setTimeout(() => {
        self.registration.showNotification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          requireInteraction: true,
          actions: [
            {
              action: 'start-review',
              title: 'Start Review'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ]
        });
      }, delay);
    }
  }
});
