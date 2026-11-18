import {
    getTheme,
    toggleTheme
} from "../services/themeService.js";

import {
    getLanguage
} from "../i18n/i18n.js";


function lang(mn, en) {

    return getLanguage() === "mn" ? mn : en;

}


function updateThemeButton() {

    const button = document.getElementById("themeToggle");

    if (!button) return;

    const dark = document.documentElement.dataset.theme
        === "dark";

    const title = dark

        ? lang("Гэрэлтэй горим", "Light mode")

        : lang("Харанхуй горим", "Dark mode");

    button.innerHTML = `

        <i class="fa-solid ${dark
            ? "fa-sun"
            : "fa-moon"}"></i>

    `;

    button.title = title;

    button.setAttribute("aria-label", title);

    button.setAttribute("aria-pressed", String(dark));

}


export function bindThemeToggle() {

    const actions = document.querySelector(
        ".navbar-actions"
    );

    if (!actions) return;

    if (!document.getElementById("themeToggle")) {

        const button = document.createElement("button");

        button.id = "themeToggle";

        button.type = "button";

        button.className = "theme-toggle";

        actions.prepend(button);

        button.addEventListener("click", () => {

            toggleTheme();

        });

    }

    updateThemeButton();

    window.removeEventListener(
        "themechange",
        updateThemeButton
    );

    window.addEventListener(
        "themechange",
        updateThemeButton
    );

}


export function initBackToTop() {

    if (document.getElementById("backToTop")) return;

    const button = document.createElement("button");

    button.id = "backToTop";

    button.type = "button";

    button.className = "back-to-top";

    button.innerHTML = `

        <i class="fa-solid fa-arrow-up"></i>

    `;

    button.setAttribute(
        "aria-label",
        lang("Дээш буцах", "Back to top")
    );

    document.body.appendChild(button);


    function updateVisibility() {

        button.classList.toggle(

            "is-visible",

            window.scrollY > 400

        );

    }


    window.addEventListener(
        "scroll",
        updateVisibility,
        { passive: true }
    );


    window.addEventListener("languagechange", () => {

        button.setAttribute(
            "aria-label",
            lang("Дээш буцах", "Back to top")
        );

    });


    button.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "instant" : "smooth"

        });

    });

    updateVisibility();

}