import {
    getCurrentUser,
    logoutUser
} from "../services/authService.js";

import {
    getLanguage
} from "../i18n/i18n.js";

import {
    escapeHtml
} from "../fn/format.js";


function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}


function getInitials(name) {

    return String(name ?? "User")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word[0] ?? "")
        .join("")
        .toUpperCase();

}


function renderAvatar(user) {

    if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(user.avatar ?? "")) {

        return `
            <img
                src="${escapeHtml(user.avatar)}"
                alt="Profile">
        `;

    }

    return escapeHtml(getInitials(user.name));

}


export function renderNavbarAuth() {

    const user = getCurrentUser();

    if (!user) {

        return `

            <a href="#/login" class="login-button">

                <i class="fa-regular fa-user"></i>

                ${lang("Нэвтрэх", "Login")}

            </a>

        `;

    }

    return `

        <div class="navbar-auth" id="navbarAuth">

            <a href="#/profile"
               class="navbar-profile-link">

                <span class="navbar-auth-avatar">

                    ${renderAvatar(user)}

                </span>

                <span class="navbar-profile-name">

                    ${escapeHtml(user.name)}

                </span>

            </a>


            <button
                type="button"
                id="navbarAuthToggle"
                class="navbar-profile-toggle"
                aria-label="${lang("Хэрэглэгчийн цэс", "User menu")}"
                aria-expanded="false"
                aria-controls="navbarAuthDropdown">

                <i class="fa-solid fa-chevron-down"></i>

            </button>


            <div
                id="navbarAuthDropdown"
                class="navbar-profile-dropdown"
                hidden>

                <div class="navbar-profile-info">

                    <strong>${escapeHtml(user.name)}</strong>

                    <small>${escapeHtml(user.email)}</small>

                </div>


                <a href="#/profile">

                    <i class="fa-solid fa-table-columns"></i>

                    Dashboard

                </a>


                <a href="#/my-learning">

                    <i class="fa-solid fa-book-open"></i>

                    ${lang("Миний сургалтууд", "My learning")}

                </a>


                <a href="#/certificates">

                    <i class="fa-solid fa-award"></i>

                    ${lang("Сертификатууд", "Certificates")}

                </a>


                <a href="#/calendar">

                    <i class="fa-solid fa-calendar-days"></i>

                    ${lang("Сургалтын хуваарь", "Learning calendar")}

                </a>


                <a href="#/wishlist">

                    <i class="fa-regular fa-heart"></i>

                    ${lang("Хадгалсан сургалт", "Wishlist")}

                </a>


                <a href="#/orders">

                    <i class="fa-solid fa-receipt"></i>

                    ${lang(
                        "Худалдан авалтын түүх",
                        "Order history"
                    )}

                </a>


                <a href="#/settings">

                    <i class="fa-solid fa-gear"></i>

                    ${lang("Тохиргоо", "Settings")}

                </a>


                <button
                    type="button"
                    id="navbarLogout"
                    class="navbar-profile-logout">

                    <i class="fa-solid fa-right-from-bracket"></i>

                    ${lang("Гарах", "Logout")}

                </button>

            </div>

        </div>

    `;

}


let eventController;


export function bindNavbarAuthEvents() {

    eventController?.abort();

    eventController = new AbortController();

    const signal = eventController.signal;

    const auth = document.getElementById("navbarAuth");

    if (!auth) return;

    const toggle = document.getElementById(
        "navbarAuthToggle"
    );

    const dropdown = document.getElementById(
        "navbarAuthDropdown"
    );

    const logout = document.getElementById(
        "navbarLogout"
    );


    function closeDropdown() {

        dropdown.hidden = true;

        toggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    toggle.addEventListener("click", () => {

        dropdown.hidden = !dropdown.hidden;

        toggle.setAttribute(
            "aria-expanded",
            String(!dropdown.hidden)
        );

    }, { signal });


    document.addEventListener("click", event => {

        if (!auth.contains(event.target)) {

            closeDropdown();

        }

    }, { signal });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeDropdown();

        }

    }, { signal });


    auth.querySelectorAll("a").forEach(link => {

        link.addEventListener(
            "click",
            closeDropdown,
            { signal }
        );

    });


    window.addEventListener(
        "hashchange",
        closeDropdown,
        { signal }
    );


    logout.addEventListener("click", () => {

        if (!window.confirm(
            lang(
                "Системээс гарах уу?",
                "Are you sure you want to log out?"
            )
        )) return;

        logoutUser();

        window.location.hash = "/login";

    }, { signal });

}