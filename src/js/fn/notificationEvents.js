import {
    getUnreadCount
} from "../services/notificationService.js";


export function updateNotificationCount() {

    const count = getUnreadCount();

    const counters = document.querySelectorAll(
        "#notificationCount, [data-notification-count]"
    );

    counters.forEach(counter => {

        counter.textContent = count > 99
            ? "99+"
            : count;

        counter.hidden = count === 0;

    });

}


export function bindNotificationEvents() {

    window.removeEventListener(
        "notificationchange",
        updateNotificationCount
    );

    window.addEventListener(
        "notificationchange",
        updateNotificationCount
    );

    window.removeEventListener(
        "authchange",
        updateNotificationCount
    );

    window.addEventListener(
        "authchange",
        updateNotificationCount
    );

    updateNotificationCount();

}