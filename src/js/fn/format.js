
export function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

}


export function safeValue(value) {

    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {
        return "-";
    }

    return escapeHtml(value);

}

// JSON түлхүүрийг гарчиг болгох
export function titleFromKey(key) {

    return escapeHtml(
        String(key ?? "")
            .replaceAll("_", " ")
            .replaceAll("-", " ")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/\b\w/g, ch => ch.toUpperCase())
    );

}

// Хайлтын текстийг стандарт хэлбэрт оруулах
export function normalizeText(value) {

    return String(value ?? "")
        .normalize("NFC")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

}

// Сургалтын хөнгөлөлтийн хувь тооцох
export function calculateDiscount(price, originalPrice) {

    const current = Number(price);
    const original = Number(originalPrice);

    if (
        !Number.isFinite(current) ||
        !Number.isFinite(original) ||
        current < 0 ||
        original <= 0 ||
        current >= original
    ) {
        return 0;
    }

    return Math.round(
        ((original - current) / original) * 100
    );

}

// Сургалтын хугацааг форматлах
export function formatDuration(hours, language = "mn") {

    const totalHours = Number(hours);

    if (
        hours == null ||
        hours === "" ||
        !Number.isFinite(totalHours) ||
        totalHours < 0
    ) {
        return "-";
    }

    const unit = language === "mn"
        ? "цаг"
        : "h";

    return `${totalHours} ${unit}`;

}
