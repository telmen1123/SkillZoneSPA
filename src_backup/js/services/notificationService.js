import { getCurrentUser } from "./authService.js";

const STORAGE_KEY = "skillzone-notifications";

function getStorageKey() {
    const user = getCurrentUser();

    return user
        ? `${STORAGE_KEY}-${user.id}`
        : null;
}

export function getNotifications() {
    const key = getStorageKey();

    if (!key) return [];

    try {
        const data = JSON.parse(
            localStorage.getItem(key) ?? "[]"
        );

        return Array.isArray(data) ? data : [];

    } catch (error) {
        console.error("Notification error:", error);
        return [];
    }
}

function saveNotifications(items) {
    const key = getStorageKey();

    if (!key) return false;

    localStorage.setItem(key, JSON.stringify(items));

    window.dispatchEvent(
        new CustomEvent("notificationchange")
    );

    return true;
}

export function addNotification({
    type = "info",
    title,
    message,
    link = "#/notifications"
}) {
    if (!getStorageKey()) return false;

    const items = getNotifications();

    items.unshift({
        id: crypto.randomUUID(),
        type,
        title,
        message,
        link,
        read: false,
        createdAt: new Date().toISOString()
    });

    return saveNotifications(items);
}

export function getUnreadCount() {
    return getNotifications().filter(
        item => !item.read
    ).length;
}

export function markAsRead(id) {
    const items = getNotifications();

    const item = items.find(
        item => item.id === id
    );

    if (!item) return false;

    item.read = true;

    return saveNotifications(items);
}

export function markAllAsRead() {
    const items = getNotifications().map(item => ({
        ...item,
        read: true
    }));

    return saveNotifications(items);
}

export function deleteNotification(id) {
    const items = getNotifications().filter(
        item => item.id !== id
    );

    return saveNotifications(items);
}

export function clearNotifications() {
    return saveNotifications([]);
}