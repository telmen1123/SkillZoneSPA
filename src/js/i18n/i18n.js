
import { translations } from "./translations.js";

const STORAGE_KEY = "skillzone-language";

export const supportedLanguages = ["mn", "en"];

const DEFAULT_LANGUAGE = "mn";

const savedLanguage = localStorage.getItem(STORAGE_KEY);

let currentLanguage = supportedLanguages.includes(savedLanguage)
    ? savedLanguage
    : DEFAULT_LANGUAGE;

document.documentElement.lang = currentLanguage;

export function getLanguage() {
    return currentLanguage;
}

export function setLanguage(language) {

    if (!supportedLanguages.includes(language)) {
        return false;
    }

    if (currentLanguage === language) {
        return true;
    }

    currentLanguage = language;

    localStorage.setItem(
        STORAGE_KEY,
        currentLanguage
    );

    document.documentElement.lang =
        currentLanguage;

    window.dispatchEvent(
        new CustomEvent("languagechange", {
            detail: {
                language: currentLanguage
            }
        })
    );

    return true;
}

export function t(key) {

    const keys = key.split(".");

    const value = keys.reduce(
        (result, part) => result?.[part],
        translations[currentLanguage]
    );

    const fallback = keys.reduce(
        (result, part) => result?.[part],
        translations[DEFAULT_LANGUAGE]
    );

    return value ?? fallback ?? key;
}

export function getLocalizedValue(value) {

    if (typeof value === "string") {
        return value;
    }

    return value?.[currentLanguage]
        ?? value?.[DEFAULT_LANGUAGE]
        ?? value?.en
        ?? "";
}

export function formatNumber(value) {

    return new Intl.NumberFormat(
        currentLanguage === "mn"
            ? "mn-MN"
            : "en-US"
    ).format(value);
}

export function formatPrice(value) {

    return new Intl.NumberFormat(
        currentLanguage === "mn"
            ? "mn-MN"
            : "en-US",
        {
            style: "currency",
            currency: "MNT",
            currencyDisplay: "narrowSymbol",
            maximumFractionDigits: 0
        }
    ).format(value);
}

export function formatDate(value) {

    return new Intl.DateTimeFormat(
        currentLanguage === "mn"
            ? "mn-MN"
            : "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    ).format(new Date(value));
}
