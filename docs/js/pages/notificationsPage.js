import {
    getCurrentUser
} from "../services/authService.js";

import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications
} from "../services/notificationService.js";

import {
    getLanguage,
    getLocalizedValue
} from "../i18n/i18n.js";

import {
    escapeHtml
} from "../fn/format.js";


function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}

function getNotificationIcon(type) {

    const icons = {
        order: "fa-bag-shopping",
        lesson: "fa-circle-check",
        certificate: "fa-award",
        calendar: "fa-calendar-days",
        info: "fa-bell"
    };

    return icons[type] ?? icons.info;
}

function formatTime(value) {

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const minutes = Math.max(
        0,
        Math.floor((Date.now() - date.getTime()) / 60000)
    );

    if (minutes < 1) {
        return lang("Саяхан", "Just now");
    }

    if (minutes < 60) {
        return lang(
            `${minutes} минутын өмнө`,
            `${minutes} min ago`
        );
    }

    if (minutes < 1440) {

        const hours = Math.floor(minutes / 60);

        return lang(
            `${hours} цагийн өмнө`,
            `${hours} hours ago`
        );
    }

    return date.toLocaleDateString(
        getLanguage() === "mn" ? "mn-MN" : "en-US"
    );
}

function renderNotification(item) {

    return `
        <article class="sz-notification
            ${item.read ? "" : "is-unread"}">

            <div class="sz-notification-icon">

                <i class="fa-solid ${getNotificationIcon(item.type)}"></i>

            </div>

            <button
                type="button"
                class="sz-notification-body"
                data-notification-open="${escapeHtml(item.id)}">

                <h3>
                    ${escapeHtml(getLocalizedValue(item.title))}
                </h3>

                <p>
                    ${escapeHtml(getLocalizedValue(item.message))}
                </p>

                <small>
                    <i class="fa-regular fa-clock"></i>
                    ${escapeHtml(formatTime(item.createdAt))}
                </small>

            </button>

            ${!item.read
                ? `<span class="sz-notification-dot"></span>`
                : ""
            }

            <button
                type="button"
                class="sz-notification-delete"
                data-notification-delete="${escapeHtml(item.id)}"
                aria-label="${lang("Устгах", "Delete")}">

                <i class="fa-regular fa-trash-can"></i>

            </button>

        </article>
    `;
}

function renderEmpty() {

    return `
        <div class="sz-notification-empty">

            <i class="fa-regular fa-bell"></i>

            <h3>
                ${lang(
                    "Мэдэгдэл байхгүй байна",
                    "No notifications"
                )}
            </h3>

            <p>
                ${lang(
                    "Шинэ мэдэгдлүүд энд харагдана.",
                    "New notifications will appear here."
                )}
            </p>

        </div>
    `;
}

export function renderNotificationsPage() {

    return `
        <section class="sz-notifications-page">

            <div class="app-container">

                <a href="#/profile"
                   class="sz-notifications-back">

                    <i class="fa-solid fa-arrow-left"></i>
                    Dashboard

                </a>

                <div class="sz-notifications-hero">

                    <div>

                        <span>SKILLZONE NOTIFICATIONS</span>

                        <h1>
                            ${lang("Мэдэгдлүүд", "Notifications")}
                        </h1>

                        <p>
                            ${lang(
                                "Сургалтын шинэ мэдээллээ цаг алдалгүй аваарай.",
                                "Stay updated with your learning activity."
                            )}
                        </p>

                    </div>

                    <i class="fa-regular fa-bell"></i>

                </div>

                <div class="sz-notifications-panel">

                    <div class="sz-notifications-toolbar">

                        <div class="sz-notifications-tabs">

                            <button
                                type="button"
                                class="is-active"
                                data-notification-filter="all">

                                ${lang("Бүгд", "All")}

                            </button>

                            <button
                                type="button"
                                data-notification-filter="unread">

                                ${lang("Уншаагүй", "Unread")}

                                <span id="notificationUnreadCount">0</span>

                            </button>

                        </div>

                        <div class="sz-notifications-actions">

                            <button
                                type="button"
                                id="markAllNotifications">

                                <i class="fa-solid fa-check-double"></i>

                                ${lang("Бүгдийг унших", "Mark all read")}

                            </button>

                            <button
                                type="button"
                                id="clearNotifications">

                                <i class="fa-regular fa-trash-can"></i>

                                ${lang("Цэвэрлэх", "Clear all")}

                            </button>

                        </div>

                    </div>

                    <div id="notificationsContent"></div>

                </div>

            </div>

        </section>
    `;
}

export function bindNotificationsPage() {

    const user = getCurrentUser();

    if (!user) {
        window.location.hash = "/login";
        return;
    }

    const page = document.querySelector(
        ".sz-notifications-page"
    );

    if (!page) return;

    const content = page.querySelector(
        "#notificationsContent"
    );

    let filter = "all";

    function render() {

        const items = getNotifications().filter(
            item => filter === "all" || !item.read
        );

        content.innerHTML = items.length
            ? items.map(renderNotification).join("")
            : renderEmpty();

        page.querySelector(
            "#notificationUnreadCount"
        ).textContent = getUnreadCount();

        page.querySelectorAll(
            "[data-notification-filter]"
        ).forEach(button => {

            const active =
                button.dataset.notificationFilter === filter;

            button.classList.toggle("is-active", active);

            button.setAttribute("aria-pressed", String(active));
        });
    }

    page.addEventListener("click", event => {

        if (getCurrentUser()?.id !== user.id) {
            window.location.hash = "/login";
            return;
        }

        const filterButton = event.target.closest(
            "[data-notification-filter]"
        );

        if (filterButton) {
            filter = filterButton.dataset.notificationFilter;
            render();
            return;
        }

        const openButton = event.target.closest(
            "[data-notification-open]"
        );

        if (openButton) {

            const id = openButton.dataset.notificationOpen;

            const item = getNotifications().find(
                item => item.id === id
            );

            markAsRead(id);
            render();

            const link = item?.link;

            if (
                typeof link === "string" &&
                link.startsWith("#/") &&
                link !== "#/notifications"
            ) {
                window.location.hash = link.slice(1);
            }

            return;
        }

        const deleteButton = event.target.closest(
            "[data-notification-delete]"
        );

        if (deleteButton) {

            deleteNotification(
                deleteButton.dataset.notificationDelete
            );

            render();
            return;
        }

        if (event.target.closest("#markAllNotifications")) {
            markAllAsRead();
            render();
            return;
        }

        if (event.target.closest("#clearNotifications")) {

            if (window.confirm(
                lang(
                    "Бүх мэдэгдлийг устгах уу?",
                    "Delete all notifications?"
                )
            )) {
                clearNotifications();
                render();
            }
        }
    });

    render();
}