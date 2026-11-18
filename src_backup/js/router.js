
export function initRouter(routes) {

    const app = document.querySelector("#app");

    if (!app) return;

    function renderRoute(animate = true) {

        const hash =
            window.location.hash.slice(1) || "/";

        const [path, query = ""] = hash.split("?");

        const params = new URLSearchParams(query);

        const route = Object.hasOwn(routes, path)
            ? routes[path]
            : routes["/404"];

        if (!route) return;

        function updatePage() {

            if (typeof route === "function") {

                app.innerHTML = route(params);

            } else {

                app.innerHTML = route.render(params);

                route.bind?.(params);

            }

            if (animate) {

                window.scrollTo({
                    top: 0,
                    behavior: "instant"
                });

            }

        }

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (
            animate &&
            document.startViewTransition &&
            !reducedMotion
        ) {

            document.startViewTransition(updatePage);

        } else {

            updatePage();

        }

    }

    window.addEventListener("hashchange", () => {

        renderRoute();

    });

    window.addEventListener("languagechange", () => {

        renderRoute(false);

    });

    renderRoute(false);

}
