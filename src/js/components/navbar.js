
import {
    t,
    getLanguage,
    setLanguage
} from "../i18n/i18n.js";

const menus = [
    {
        key: "nav.home",
        path: "#/",
        icon: "fa-house"
    },
    {
        key: "nav.courses",
        path: "#/courses",
        icon: "fa-book-open"
    },
    {
        key: "nav.instructors",
        path: "#/instructors",
        icon: "fa-chalkboard-user"
    },
    {
        key: "nav.blog",
        path: "#/blog",
        icon: "fa-newspaper"
    }
];

// Navbar үүсгэх
export function renderNavbar() {

    const language = getLanguage();

    const currentPath =
        (window.location.hash || "#/").split("?")[0];

    const menuHTML = menus.map((menu) => `
        <a href="${menu.path}"
           class="nav-link
           ${currentPath === menu.path ? "is-active" : ""}">

            <i class="fa-solid ${menu.icon}"></i>

            <span>${t(menu.key)}</span>

        </a>
    `).join("");

    return `
        <nav class="skill-navbar">

            <div class="app-container nav-container">

                <!-- Logo -->
                <a href="#/" class="brand-logo">

                    <span class="brand-icon">
                        <i class="fa-solid fa-play"></i>
                    </span>

                    <span>SkillZone</span>

                </a>

                <!-- Mobile menu -->
                <button
                    class="mobile-toggle"
                    id="mobileToggle"
                    type="button"
                    aria-label="${language === "mn" ? "Цэс" : "Menu"}"
                    aria-controls="navContent"
                    aria-expanded="false">

                    <i class="fa-solid fa-bars"></i>

                </button>

                <div class="nav-content" id="navContent">

                    <!-- Navigation -->
                    <div class="nav-links">
                        ${menuHTML}
                    </div>

                    <!-- Search -->
                    <form class="nav-search"
                          id="navSearch">

                        <i class="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="search"
                            id="searchInput"
                            aria-label="${t("common.search")}"
                            placeholder="${t("nav.search")}"
                            autocomplete="off">

                    </form>

                    <!-- Actions -->
                    <div class="nav-actions">

                        <!-- Language -->
                        <div class="language-switch"
                             role="group"
                             aria-label="${t("common.language")}">

                            <button
                                type="button"
                                class="lang-button
                                ${language === "mn" ? "is-active" : ""}"
                                data-lang="mn"
                                aria-pressed="${language === "mn"}">

                                MN

                            </button>

                            <button
                                type="button"
                                class="lang-button
                                ${language === "en" ? "is-active" : ""}"
                                data-lang="en"
                                aria-pressed="${language === "en"}">

                                EN

                            </button>

                        </div>

                        <!-- Wishlist -->
                        <a href="#/wishlist"
                           class="nav-icon-button"
                           title="${t("nav.wishlist")}"
                           aria-label="${t("nav.wishlist")}">

                            <i class="fa-regular fa-heart"></i>

                        </a>

                        <!-- Cart -->
                        <a href="#/cart"
                           class="nav-icon-button"
                           title="${t("nav.cart")}"
                           aria-label="${t("nav.cart")}">

                            <i class="fa-solid fa-cart-shopping"></i>

                        </a>

                        <!-- Notifications -->
                        <a href="#/notifications"
                           class="nav-icon-button"
                           title="${t("nav.notifications")}"
                           aria-label="${t("nav.notifications")}">

                            <i class="fa-regular fa-bell"></i>

                        </a>

                        <!-- Login -->
                        <a href="#/login"
                           class="login-button">

                            <i class="fa-regular fa-user"></i>

                            <span>${t("nav.login")}</span>

                        </a>

                    </div>

                </div>

            </div>

        </nav>
    `;
}

// Идэвхтэй цэс тодруулах
function updateActiveMenu() {

    const currentPath =
        (window.location.hash || "#/").split("?")[0];

    document.querySelectorAll(".nav-link")
        .forEach((link) => {

            const isActive =
                link.getAttribute("href") === currentPath;

            link.classList.toggle(
                "is-active",
                isActive
            );

            if (isActive) {

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                link.removeAttribute("aria-current");

            }

        });

    document.querySelector("#navContent")
        ?.classList.remove("is-open");

    document.querySelector("#mobileToggle")
        ?.setAttribute("aria-expanded", "false");

}

// Navbar event холбох
export function bindNavbarEvents() {

    const mobileToggle =
        document.querySelector("#mobileToggle");

    const navContent =
        document.querySelector("#navContent");

    const searchForm =
        document.querySelector("#navSearch");

    // Mobile menu
    mobileToggle?.addEventListener("click", () => {

        const isOpen =
            navContent.classList.toggle("is-open");

        mobileToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });

    // Сургалт хайх
    searchForm?.addEventListener("submit", (event) => {

        event.preventDefault();

        const query = document
            .querySelector("#searchInput")
            .value.trim();

        if (!query) return;

        const params = new URLSearchParams({
            q: query
        });

        window.location.hash =
            `/courses?${params.toString()}`;

    });

    document.querySelectorAll(".lang-button")
        .forEach((button) => {

            button.addEventListener("click", () => {

                const language = button.dataset.lang;

                setLanguage(language);

            });

        });

    window.addEventListener(
        "hashchange",
        updateActiveMenu
    );

    updateActiveMenu();
}
