
import { renderCourseCard } from "./courseCard.js";

import {
    t,
    getLanguage,
    formatNumber
} from "../i18n/i18n.js";

import {
    renderNotification
} from "../layouts/notificationLayout.js";


// Хэл сонгох
function lang(mn, en) {

    return getLanguage() === "mn" ? mn : en;

}


// Grid / Table харагдац сонгох
export function renderCourseToolbar(
    total = 0,
    view = "grid"
) {

    return `

        <div class="course-grid-header">

            <div class="course-grid-count">

                ${lang("Нийт", "Total")}

                <strong>
                    ${formatNumber(total)}
                </strong>

                ${lang("сургалт", "courses")}

            </div>


            <div class="course-grid-toolbar">

                <div
                    class="course-view-switch"
                    role="group"
                    aria-label="${lang("Харагдац", "View mode")}"
                >

                    <button
                        type="button"
                        class="course-view-button
                        ${view === "grid" ? "is-active" : ""}"
                        data-view="grid"
                        aria-pressed="${view === "grid"}"
                        aria-label="${lang("Карт", "Grid")}"
                        title="${lang("Картаар харах", "Grid view")}"
                    >

                        <i class="fa-solid fa-border-all"></i>

                    </button>


                    <button
                        type="button"
                        class="course-view-button
                        ${view === "table" ? "is-active" : ""}"
                        data-view="table"
                        aria-pressed="${view === "table"}"
                        aria-label="${lang("Хүснэгт", "Table")}"
                        title="${lang("Хүснэгтээр харах", "Table view")}"
                    >

                        <i class="fa-solid fa-list"></i>

                    </button>

                </div>

            </div>

        </div>

    `;

}


// Сургалтын Grid үүсгэх
export function renderCourseGrid(courses = []) {

    // Өгөгдөл шалгах
    if (!Array.isArray(courses) || !courses.length) {

        return renderNotification(

            t("courses.noResults"),

            "warning"

        );

    }


    // Сургалт бүрийг карт болгох
    const cardsHTML = courses

        .map(course => renderCourseCard(course))

        .join("");


    // Grid HTML буцаах
    return `

        <div class="course-grid">

            ${cardsHTML}

        </div>

    `;

}


// Харагдацын товчнуудыг холбох
export function bindCourseViewEvents(
    onViewChange
) {

    const container = document.getElementById(
        "courseToolbar"
    );

    if (!container) return;


    container.onclick = event => {

        const button = event.target.closest(
            "[data-view]"
        );

        if (!button) return;


        const view = button.dataset.view;


        if (!["grid", "table"].includes(view)) {

            return;

        }


        // Харагдац өөрчлөх
        onViewChange?.(view);

    };

}
