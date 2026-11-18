const STORAGE_KEY = "skillzone-theme";


export function getTheme() {

    try {

        return localStorage.getItem(STORAGE_KEY) === "dark"

            ? "dark"

            : "light";

    } catch {

        return "light";

    }

}


export function setTheme(theme) {

    const value = theme === "dark"
        ? "dark"
        : "light";

    document.documentElement.setAttribute(
        "data-theme",
        value
    );

    document.documentElement.style.colorScheme = value;

    try {

        localStorage.setItem(STORAGE_KEY, value);

    } catch (error) {

        console.warn("Theme storage error:", error);

    }

    window.dispatchEvent(

        new CustomEvent("themechange", {

            detail: { theme: value }

        })

    );

    return value;

}


export function toggleTheme() {

    const current =
        document.documentElement.dataset.theme
        ?? getTheme();

    return setTheme(

        current === "dark"
            ? "light"
            : "dark"

    );

}


export function initTheme() {

    setTheme(getTheme());

}