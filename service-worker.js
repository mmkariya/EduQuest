"use strict";

self.addEventListener("install", event => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {
    let payload = {};
    try {
        payload = event.data ? event.data.json() : {};
    } catch (error) {
        console.error("EduQuest: Push payload was not valid JSON.", error);
    }

    const title = payload.title || "EduQuest";
    const options = {
        body: payload.body || "Your learning adventure is ready.",
        icon: "/assets/eduquest-icon.svg",
        badge: "/assets/eduquest-icon.svg",
        data: { url: payload.url || "/index.html" },
        tag: payload.tag || "eduquest-update"
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
    event.notification.close();
    const target = new URL(event.notification.data.url || "/index.html", self.location.origin).href;

    event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clients => {
        const existing = clients.find(client => client.url === target);
        if (existing) return existing.focus();
        return self.clients.openWindow(target);
    }));
});
