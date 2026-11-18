import {
    renderNavbar,
    bindNavbarEvents
} from "./components/navbar.js";

import {
    bindNavbarAuthEvents
} from "./components/navbarAuth.js";

import {
    renderFooter
} from "./components/footer.js";

import {
    initRouter
} from "./router.js";

import {
    routes
} from "./routes.js";

import {
    getLanguage,
    t
} from "./i18n/i18n.js";

import {
    updateCartCount
} from "./fn/cartEvents.js";

import {
    updateWishlistCount
} from "./fn/wishlistEvents.js";

import {
    updateNotificationCount,
    bindNotificationEvents
} from "./fn/notificationEvents.js";

import {
    addNotification
} from "./services/notificationService.js";

import {
    initTheme,
    getTheme,
    setTheme
} from "./services/themeService.js";

import {
    bindThemeToggle,
    initBackToTop
} from "./components/themeToggle.js";


const navbar = document.getElementById("navbar");

const footer = document.getElementById("footer");


// UPDATE COUNTERS

function updateNavbarCounts() {

    updateCartCount();

    updateWishlistCount();

    updateNotificationCount();

}


// RENDER LAYOUT

function renderLayout() {

    if (navbar) {

        navbar.innerHTML = renderNavbar();

        bindNavbarEvents();

        bindNavbarAuthEvents();

        bindThemeToggle();

        updateNavbarCounts();

    }

    if (footer) {

        footer.innerHTML = renderFooter();

    }

    const language = getLanguage();

    document.documentElement.lang = language;

    document.title = `${t("brand")} | ${
        language === "mn"
            ? "Цахим сургалтын платформ"
            : "Online Learning Platform"
    }`;

}


// ORDER NOTIFICATION

function bindOrderNotifications() {

    window.addEventListener("orderchange", event => {

        const order = event.detail?.order;

        if (!order) return;

        addNotification({

            type: "order",

            title: {
                mn: "Сургалт амжилттай авлаа",
                en: "Course purchase successful"
            },

            message: {
                mn: "Таны сургалт суралцах хэсэгт нэмэгдлээ.",
                en: "Your courses have been added to My Learning."
            },

            link: "#/my-learning"

        });

    });

}


// LESSON NOTIFICATION

function bindLessonNotifications() {

    window.addEventListener("lessoncompleted", event => {

        const data = event.detail;

        if (!data) return;

        addNotification({

            type: "lesson",

            title: {
                mn: "Хичээл амжилттай дууслаа",
                en: "Lesson completed"
            },

            message: {
                mn: "Таны сургалтын явц шинэчлэгдлээ.",
                en: "Your learning progress has been updated."
            },

            link: "#/my-learning"

        });


        if (data.completedCourse) {

            addNotification({

                type: "certificate",

                title: {
                    mn: "Баяр хүргэе!",
                    en: "Congratulations!"
                },

                message: {
                    mn: "Та сертификат авах эрхтэй боллоо.",
                    en: "You are eligible for a certificate."
                },

                link: "#/certificates"

            });

        }

    });

}


// INIT APP

function initApp() {

    initTheme();

    renderLayout();

    initRouter(routes);

    initBackToTop();

    bindNotificationEvents();

    bindOrderNotifications();

    bindLessonNotifications();


    window.addEventListener("languagechange", () => {

        renderLayout();

    });


    window.addEventListener("authchange", () => {

        renderLayout();

    });


    window.addEventListener(
        "cartchange",
        updateCartCount
    );


    window.addEventListener(
        "wishlistchange",
        updateWishlistCount
    );


    window.addEventListener("storage", event => {

        if (event.key === "skillzone-theme") {

            setTheme(getTheme());

        }


        if (
            event.key === "skillzone-cart" ||
            event.key === "skillzone-wishlist"
        ) {

            updateNavbarCounts();

        }


        if (
            event.key?.startsWith(
                "skillzone-notifications-"
            )
        ) {

            updateNotificationCount();

        }


        if (
            event.key === "skillzone-session" ||
            event.key === "skillzone-users" ||
            event.key === null
        ) {

            renderLayout();


            const protectedPages = [

                "#/profile",

                "#/my-learning",

                "#/player",

                "#/certificates",

                "#/calendar",

                "#/notifications",

                "#/settings",

                "#/orders"

            ];


            const currentPage =
                window.location.hash.split("?")[0];


            if (protectedPages.includes(currentPage)) {

                window.location.reload();

            }

        }

    });


    console.log(

        "SkillZone SPA initialized successfully."

    );

}


initApp();