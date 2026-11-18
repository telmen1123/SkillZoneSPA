
import { renderPageLayout } from "./pageLayout.js";
import { t, getLanguage } from "../i18n/i18n.js";

export function renderSidebarPageLayout({

    sidebarContent = "",
    mainContent = "",

    pageId = "",
    pageTitle = "",
    pageSubtitle = "",
    actions = "",

    sidebarId = "docsSidebar",
    overlayId = "sidebarOverlay",
    openButtonId = "openSidebar",
    closeButtonId = "closeSidebar"

} = {}) {

    const isMN = getLanguage() === "mn";

    const renderedMainContent = renderPageLayout({

        id: pageId,
        title: pageTitle,
        subtitle: pageSubtitle,
        content: mainContent,
        actions: actions,

        sectionClass: "app-page",
        containerClass: "app-inner-container"

    });

    return `

        <div class="app-container app-sidebar-layout">

            <!-- Mobile sidebar button -->
            <div class="app-mobile-sidebar">

                <button
                    id="${openButtonId}"
                    class="app-sidebar-icon-btn"
                    type="button"
                    aria-controls="${sidebarId}"
                    aria-expanded="false"
                    aria-label="${t("courses.filter")}">

                    <i class="fa-solid fa-sliders"></i>

                    <span>${t("courses.filter")}</span>

                </button>

            </div>

            <!-- Mobile overlay -->
            <div
                id="${overlayId}"
                class="app-sidebar-overlay"
                aria-hidden="true">
            </div>

            <!-- Main layout -->
            <div class="app-shell">

                <!-- Left sidebar -->
                <aside
                    id="${sidebarId}"
                    class="app-sidebar"
                    aria-label="${t("courses.filter")}">

                    <div class="app-sidebar-mobile-head">

                        <h2>
                            ${t("courses.filter")}
                        </h2>

                        <button
                            id="${closeButtonId}"
                            class="app-sidebar-icon-btn"
                            type="button"
                            aria-label="${t("common.close")}">

                            <i class="fa-solid fa-xmark"></i>

                        </button>

                    </div>

                    <div class="sidebar-heading">

                        <i class="fa-solid fa-sliders"></i>

                        <h2>
                            ${t("courses.filter")}
                        </h2>

                    </div>

                    <div class="sidebar-description">

                        ${isMN
                            ? "Өөрт тохирох сургалтаа олоорой."
                            : "Find the right course for you."}

                    </div>

                    <div class="menu app-sidebar-menu">

                        ${sidebarContent}

                    </div>

                </aside>

                <!-- Right content -->
                <div class="app-main-content">

                    ${renderedMainContent}

                </div>

            </div>

        </div>

    `;

}
