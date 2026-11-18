
import { escapeHtml } from "../fn/format.js";

import { renderTable } from "../layouts/tableLayout.js";

import { renderNotification } from "../layouts/notificationLayout.js";

import {
    getImagesByCourseCode
} from "../services/imageService.js";

import {
    t,
    getLanguage,
    getLocalizedValue,
    formatPrice,
    formatNumber
} from "../i18n/i18n.js";


// Хэлний утга сонгох
function lang(mn, en) {

    return getLanguage() === "mn" ? mn : en;

}


// Сургалтын хүснэгтүүд үүсгэх
export function renderCourseTables(items, selectedTypes) {

    if (!items.length) {

        return renderNotification(

            t("courses.noResults"),

            "warning"

        );

    }

    if (!selectedTypes.length) {

        return renderNotification(

            lang(
                "Харуулах мэдээллийн төрлөө сонгоно уу.",
                "Please select an information type."
            ),

            "warning"

        );

    }

    return selectedTypes

        .map(type => renderTableByType(type, items))

        .join("");

}


// Сургалтын өгөгдлийг бэлтгэх
function normalizeCourse(item) {

    return {

        ...item,

        id: item.id
            ?? item.code
            ?? item.course_code
            ?? "",

        name: getLocalizedValue(
            item.name
            ?? item.title
            ?? item.course_name
            ?? ""
        ),

        category: getLocalizedValue(
            item.category
        ),

        instructor: getLocalizedValue(
            item.instructor?.name
            ?? item.instructor
        ),

        description: getLocalizedValue(
            item.description
        )

    };

}


// Зураг харуулах товч
function renderImageButton(item) {

    const images = getImagesByCourseCode(item.id);

    const count = images.length;

    if (!count) {

        return "—";

    }

    return `

        <button

            type="button"

            class="button is-small is-primary
                   image-count-tag open-image-btn"

            data-coursecode="${escapeHtml(item.id)}"

            data-coursename="${escapeHtml(item.name)}"

            title="${lang(
                "Зураг үзэх",
                "View images"
            )}"

        >

            <span class="icon is-small">

                <i class="fa-solid fa-images"></i>

            </span>

            <span>${count}</span>

        </button>

    `;

}


// Мэдээллийн төрлөөр хүснэгт үүсгэх
function renderTableByType(type, items) {

    const rows = items.map(normalizeCourse);

    const nameColumn = {

        key: "name",

        label: lang(
            "Сургалтын нэр",
            "Course name"
        )

    };


    // ==============================
    // 1. Үндсэн мэдээлэл
    // ==============================

    if (type === "basic") {

        return renderTable({

            title: lang(
                "Сургалтын үндсэн мэдээлэл",
                "Basic course information"
            ),

            columns: [

                {
                    key: "id",
                    label: lang("Код", "Code")
                },

                nameColumn,

                {
                    key: "category",
                    label: lang("Ангилал", "Category")
                },

                {
                    key: "instructor",
                    label: t("courses.instructor")
                }

            ],

            rows

        });

    }


    // ==============================
    // 2. Үнийн мэдээлэл
    // ==============================

    if (type === "pricing") {

        return renderTable({

            title: lang(
                "Үнийн мэдээлэл",
                "Pricing information"
            ),

            columns: [

                nameColumn,

                {
                    key: "price",
                    label: t("courses.price"),

                    render: item =>

                        item.price != null

                            ? escapeHtml(
                                formatPrice(item.price)
                            )

                            : "—"
                },

                {
                    key: "originalPrice",

                    label: lang(
                        "Үндсэн үнэ",
                        "Original price"
                    ),

                    render: item => {

                        const price = item.originalPrice
                            ?? item.original_price;

                        return price != null

                            ? escapeHtml(
                                formatPrice(price)
                            )

                            : "—";

                    }
                },

                {
                    key: "discount",

                    label: t("cart.discount"),

                    render: item => {

                        const original = Number(
                            item.originalPrice
                            ?? item.original_price
                            ?? 0
                        );

                        const current = Number(
                            item.price ?? 0
                        );

                        if (original <= current || original <= 0) {

                            return "—";

                        }

                        return `${Math.round(

                            (original - current)
                            / original * 100

                        )}%`;

                    }
                }

            ],

            rows

        });

    }


    // ==============================
    // 3. Сургалтын дэлгэрэнгүй
    // ==============================

    if (type === "details") {

        return renderTable({

            title: lang(
                "Сургалтын дэлгэрэнгүй",
                "Course details"
            ),

            columns: [

                nameColumn,

                {
                    key: "level",

                    label: t("courses.level"),

                    render: item => {

                        const level = item.level;

                        const levels = [
                            "beginner",
                            "intermediate",
                            "advanced"
                        ];

                        return escapeHtml(

                            levels.includes(level)

                                ? t(`courses.${level}`)

                                : getLocalizedValue(level)

                        );

                    }
                },

                {
                    key: "duration",
                    label: t("courses.duration"),

                    render: item => escapeHtml(

                        getLocalizedValue(
                            item.duration
                        )
                        || String(item.duration ?? "—")

                    )
                },

                {
                    key: "lessons",
                    label: t("courses.lessons")
                }

            ],

            rows

        });

    }


    // ==============================
    // 4. Үнэлгээ
    // ==============================

    if (type === "rating") {

        return renderTable({

            title: lang(
                "Үнэлгээ болон суралцагчид",
                "Ratings and students"
            ),

            columns: [

                nameColumn,

                {
                    key: "rating",

                    label: t("courses.rating"),

                    render: item => {

                        if (item.rating == null) {

                            return "—";

                        }

                        return `

                            <span class="has-text-warning">

                                <i class="fa-solid fa-star"></i>

                            </span>

                            ${escapeHtml(String(item.rating))}

                        `;

                    }
                },

                {
                    key: "students",

                    label: t("courses.students"),

                    render: item =>

                        item.students != null

                            ? escapeHtml(
                                formatNumber(item.students)
                            )

                            : "—"
                }

            ],

            rows

        });

    }


    // ==============================
    // 5. Тайлбар
    // ==============================

    if (type === "description") {

        return renderTable({

            title: lang(
                "Сургалтын тайлбар",
                "Course description"
            ),

            columns: [

                nameColumn,

                {
                    key: "description",

                    label: lang(
                        "Тайлбар",
                        "Description"
                    )
                }

            ],

            rows

        });

    }


    // ==============================
    // 6. Сургалтын зургууд
    // ==============================

    if (type === "images") {

        return renderTable({

            title: lang(
                "Сургалтын зургууд",
                "Course images"
            ),

            columns: [

                nameColumn,

                {
                    key: "cover",

                    label: lang(
                        "Үндсэн зураг",
                        "Cover image"
                    ),

                    render: item => {

                        const images =
                            getImagesByCourseCode(item.id);

                        if (!images.length) {

                            return "—";

                        }

                        return `

                            <img

                                src="${escapeHtml(images[0])}"

                                alt="${escapeHtml(item.name)}"

                                loading="lazy"

                                class="course-table-image"

                                width="120"

                            >

                        `;

                    }
                },

                {
                    key: "number_of_images",

                    label: lang(
                        "Зургийн тоо",
                        "Number of images"
                    ),

                    render: renderImageButton
                }

            ],

            rows

        });

    }


    return "";

}
