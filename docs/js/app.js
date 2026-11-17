
import {
    renderNavbar,
    bindNavbarEvents
} from "./components/navbar.js";

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

const navbar = document.querySelector("#navbar");
const footer = document.querySelector("#footer");

function renderLayout() {

    navbar.innerHTML = renderNavbar();

    footer.innerHTML = renderFooter();

    bindNavbarEvents();

    document.documentElement.lang = getLanguage();

    document.title = getLanguage() === "mn"
        ? `${t("brand")} | Цахим сургалтын платформ`
        : `${t("brand")} | Online Learning Platform`;

}

function initApp() {

    renderLayout();

    initRouter(routes);

    window.addEventListener("languagechange", () => {

        renderLayout();

        console.info(
            "Language changed:",
            getLanguage()
        );

    });

    console.info(
        "SkillZone SPA амжилттай эхэллээ."
    );

}

initApp();
