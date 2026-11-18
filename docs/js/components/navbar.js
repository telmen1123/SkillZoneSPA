import {
    t,
    getLanguage,
    setLanguage
} from "../i18n/i18n.js";

import {
    getCartCount
} from "../services/cartService.js";

import {
    getWishlistCount
} from "../services/wishlistService.js";

import {
    getUnreadCount
} from "../services/notificationService.js";

import {
    renderNavbarAuth
} from "./navbarAuth.js";


export function renderNavbar() {

    const language = getLanguage();

    const cartCount = getCartCount();

    const wishlistCount = getWishlistCount();

    const notificationCount = getUnreadCount();

    const menus = [

        {
            title: t("nav.home"),
            path: "#/",
            icon: "fa-house"
        },

        {
            title: t("nav.courses"),
            path: "#/courses",
            icon: "fa-book-open"
        },

        {
            title: t("nav.instructors"),
            path: "#/instructors",
            icon: "fa-chalkboard-user"
        },

        {
            title: t("nav.blog"),
            path: "#/blog",
            icon: "fa-newspaper"
        }

    ];


    return `

        <nav class="app-navbar">

            <div class="app-container navbar-container">

                <a href="#/" class="navbar-brand">

                    <span class="brand-logo">

                        <i class="fa-solid fa-play"></i>

                    </span>

                    <span class="brand-name">
                        SkillZone
                    </span>

                </a>


                <button
                    type="button"
                    id="mobileToggle"
                    class="mobile-toggle"
                    aria-label="Menu"
                    aria-expanded="false"
                    aria-controls="navContent">

                    <i class="fa-solid fa-bars"></i>

                </button>


                <div id="navContent" class="navbar-content">

                    <div class="navbar-menu-links">

                        ${menus.map(menu => `

                            <a
                                href="${menu.path}"
                                class="nav-link">

                                <i class="fa-solid ${menu.icon}"></i>

                                <span>${menu.title}</span>

                            </a>

                        `).join("")}

                    </div>


                    <form
                        id="navSearch"
                        class="navbar-search">

                        <input
                            type="search"
                            id="searchInput"
                            placeholder="${t("nav.search")}">

                        <button
                            type="submit"
                            aria-label="${t("nav.search")}">

                            <i class="fa-solid fa-magnifying-glass"></i>

                        </button>

                    </form>


                    <div class="navbar-actions">

                        <div class="language-switcher">

                            <button
                                type="button"
                                data-lang="mn"
                                class="language-button
                                    ${language === "mn" ? "is-active" : ""}">

                                MN

                            </button>

                            <button
                                type="button"
                                data-lang="en"
                                class="language-button
                                    ${language === "en" ? "is-active" : ""}">

                                EN

                            </button>

                        </div>


                        <a
                            href="#/wishlist"
                            class="nav-icon-button"
                            title="${t("nav.wishlist")}"
                            aria-label="${t("nav.wishlist")}">

                            <i class="fa-regular fa-heart"></i>

                            <span
                                id="wishlistCount"
                                class="nav-count"
                                data-wishlist-count
                                ${wishlistCount === 0 ? "hidden" : ""}>

                                ${wishlistCount}

                            </span>

                        </a>


                        <a
                            href="#/cart"
                            class="nav-icon-button"
                            title="${t("nav.cart")}"
                            aria-label="${t("nav.cart")}">

                            <i class="fa-solid fa-cart-shopping"></i>

                            <span
                                id="cartCount"
                                class="nav-count"
                                data-cart-count
                                ${cartCount === 0 ? "hidden" : ""}>

                                ${cartCount}

                            </span>

                        </a>


                        <a
                            href="#/notifications"
                            class="nav-icon-button"
                            title="${t("nav.notifications")}"
                            aria-label="${t("nav.notifications")}">

                            <i class="fa-regular fa-bell"></i>

                            <span
                                id="notificationCount"
                                data-notification-count
                                ${notificationCount === 0 ? "hidden" : ""}>

                                ${notificationCount > 99
                                    ? "99+"
                                    : notificationCount}

                            </span>

                        </a>


                        ${renderNavbarAuth()}

                    </div>

                </div>

            </div>

        </nav>

    `;

}


// ACTIVE MENU

export function updateActiveMenu() {

    const currentHash = (
        window.location.hash || "#/"
    ).split("?")[0];


    document.querySelectorAll(

        ".nav-link, .nav-icon-button, .login-button, .navbar-profile-link"

    ).forEach(link => {

        const href = link.getAttribute("href");

        const active = href === currentHash;

        link.classList.toggle(
            "is-active",
            active
        );

        if (active) {

            link.setAttribute(
                "aria-current",
                "page"
            );

        } else {

            link.removeAttribute("aria-current");

        }

    });


    const mobileToggle = document.getElementById(
        "mobileToggle"
    );

    const navContent = document.getElementById(
        "navContent"
    );

    navContent?.classList.remove("is-active");

    mobileToggle?.setAttribute(
        "aria-expanded",
        "false"
    );

}


// BIND NAVBAR EVENTS

export function bindNavbarEvents() {

    const mobileToggle = document.getElementById(
        "mobileToggle"
    );

    const navContent = document.getElementById(
        "navContent"
    );


    // MOBILE MENU

    mobileToggle?.addEventListener("click", () => {

        if (!navContent) return;

        const active = navContent.classList.toggle(
            "is-active"
        );

        mobileToggle.setAttribute(
            "aria-expanded",
            String(active)
        );

    });


    // SEARCH

    const searchForm = document.getElementById(
        "navSearch"
    );

    const searchInput = document.getElementById(
        "searchInput"
    );


    searchForm?.addEventListener("submit", event => {

        event.preventDefault();

        const query = searchInput?.value.trim() ?? "";

        window.location.hash = query

            ? `/courses?q=${encodeURIComponent(query)}`

            : "/courses";

        updateActiveMenu();

    });


    // LANGUAGE

    document.querySelectorAll(
        "[data-lang]"
    ).forEach(button => {

        button.addEventListener("click", () => {

            const language = button.dataset.lang;

            if (language !== getLanguage()) {

                setLanguage(language);

            }

        });

    });


    // ROUTE CHANGE

    window.removeEventListener(
        "hashchange",
        updateActiveMenu
    );

    window.addEventListener(
        "hashchange",
        updateActiveMenu
    );


    updateActiveMenu();

}