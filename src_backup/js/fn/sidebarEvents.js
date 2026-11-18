
let sidebarController;


export function bindSidebar() {

    sidebarController?.abort();

    sidebarController = new AbortController();

    const signal = sidebarController.signal;

    const sidebar = document.querySelector(
        ".app-sidebar"
    );

    const overlay = document.querySelector(
        ".app-sidebar-overlay"
    );

    const openBtn = document.querySelector(
        ".app-mobile-sidebar .app-sidebar-icon-btn"
    );

    const closeBtn = document.querySelector(
        ".app-sidebar-mobile-head .app-sidebar-icon-btn"
    );

    if (!sidebar || !overlay) return;

    // Sidebar нээх
    function openSidebar() {

        sidebar.classList.add("is-open");

        overlay.classList.add("is-active");

        openBtn?.setAttribute(
            "aria-expanded",
            "true"
        );

        closeBtn?.focus();

    }

    // Sidebar хаах
    function closeSidebar(restoreFocus = true) {

        sidebar.classList.remove("is-open");

        overlay.classList.remove("is-active");

        openBtn?.setAttribute(
            "aria-expanded",
            "false"
        );

        if (restoreFocus) {

            openBtn?.focus();

        }

    }

    // Нээх товч
    openBtn?.addEventListener(
        "click",
        openSidebar,
        { signal }
    );

    // Хаах товч
    closeBtn?.addEventListener(
        "click",
        () => closeSidebar(),
        { signal }
    );

    // Sidebar-ийн гадна дарахад хаах
    overlay.addEventListener(
        "click",
        () => closeSidebar(),
        { signal }
    );

    // Escape товч дарахад хаах
    document.addEventListener(
        "keydown",
        event => {

            if (!sidebar.isConnected) return;

            if (
                event.key === "Escape" &&
                sidebar.classList.contains("is-open")
            ) {

                closeSidebar();

            }

        },
        { signal }
    );

    // Desktop горимд шилжих үед хаах
    const mobileScreen = window.matchMedia(
        "(width <= 768px)"
    );

    mobileScreen.addEventListener(
        "change",
        event => {

            if (!event.matches) {

                closeSidebar(false);

            }

        },
        { signal }
    );

}


// Ангиллын event controller
let menuController;


// Ангиллын жагсаалт дэлгэх, хураах
export function bindMenuListToggle() {

    menuController?.abort();

    menuController = new AbortController();

    const signal = menuController.signal;

    document.querySelectorAll(
        ".app-toggle-sublist"
    ).forEach(toggle => {

        toggle.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const li = toggle.closest("li");

                const sublist = li?.querySelector(
                    ".app-sublist"
                );

                if (!sublist) return;

                // Жагсаалтыг дэлгэх эсвэл нуух
                const isHidden =
                    sublist.classList.toggle("is-hidden");

                const isExpanded = !isHidden;

                // Идэвхтэй төлөв
                li.classList.toggle(
                    "is-active",
                    isExpanded
                );

                // Accessibility тохиргоо
                toggle.setAttribute(
                    "aria-expanded",
                    String(isExpanded)
                );

            },
            { signal }
        );

    });

}
