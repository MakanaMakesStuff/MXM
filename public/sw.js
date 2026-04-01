// public/sw.js

self.addEventListener('push', function (event) {
    if (!event.data) {
        console.log('Push event received but no data found.');
        return;
    }

    let data;
    try {
        // Laravel WebPush usually sends a JSON string
        data = event.data.json();
    } catch (e) {
        console.error('JSON Parse Error in SW:', e);
        // Fallback to plain text if JSON fails
        data = {
            title: 'New Message',
            body: event.data.text(),
            data: { url: '/chat' }
        };
    }

    const options = {
        body: data.body || 'You have a new message!',
        icon: '/logo.png',   // Ensure these exist in your /public folder
        badge: '/badge.png', // The small icon in the Android status bar
        vibrate: [100, 50, 100],
        data: {
            // Laravel often nests the URL inside a 'data' attribute
            url: data.data?.url || data.url || '/chat'
        },
        // Ensures the notification stays until the user interacts with it
        requireInteraction: true 
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'New Notification', options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const targetUrl = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // 1. If a tab is already open, focus it instead of opening a new one
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }
            // 2. If no tab is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});