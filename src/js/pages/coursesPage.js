
import {
    getCourses
} from "../services/courseService.js";

import {
    t,
    getLanguage,
    getLocalizedValue,
    formatPrice,
    formatNumber
} from "../i18n/i18n.js";

// Сургалтын үндсэн хуудас
export function renderCoursesPage() {

    return `
        <section class="section">

            <div class="app-container">

                <h1 class="title is-2">
                    ${t("courses.title")}
                </h1>

                <div id="coursesResult"
                     class="app-card">

                    <p class="has-text-centered">

                        <i class="fa-solid
                                  fa-spinner
                                  fa-spin"></i>

                        ${t("common.loading")}

                    </p>

                </div>

            </div>

        </section>
    `;
}

// Өгөгдөл уншиж харуулах
export async function bindCoursesPage() {

    const result =
        document.querySelector("#coursesResult");

    if (!result) return;

    try {

        const courses = await getCourses();

        // Хуудас солигдсон эсэхийг шалгах
        if (!result.isConnected) return;

        const language = getLanguage();

        const heading = language === "mn"
            ? "Нийт сургалт"
            : "Total courses";

        if (courses.length === 0) {

            result.textContent =
                t("courses.noResults");

            return;
        }

        const list = document.createElement("div");

        list.className = "columns is-multiline";

        courses.forEach(course => {

            const column =
                document.createElement("div");

            column.className =
                "column is-half-tablet is-one-third-desktop";

            const card =
                document.createElement("article");

            card.className =
                "app-card is-flex is-flex-direction-column";

            card.style.height = "100%";

            const code =
                document.createElement("span");

            code.className =
                "tag is-primary is-light mb-3";

            code.textContent = course.id;

            const title =
                document.createElement("h2");

            title.className = "title is-5 mb-3";

            title.textContent =
                getLocalizedValue(course.title);

            const category =
                document.createElement("p");

            category.className = "mb-2";

            category.textContent =
                t(`categories.${course.category}`);

            const instructor =
                document.createElement("p");

            instructor.className = "mb-2";

            instructor.textContent =
                `${t("courses.instructor")}: ${course.instructor}`;

            const rating =
                document.createElement("p");

            rating.className = "mb-2";

            rating.textContent =
                `⭐ ${course.rating} (${formatNumber(course.students)})`;

            const price =
                document.createElement("p");

            price.className =
                "has-text-primary has-text-weight-bold mt-auto";

            price.textContent =
                formatPrice(course.price);

            card.append(
                code,
                title,
                category,
                instructor,
                rating,
                price
            );

            column.append(card);

            list.append(column);

        });

        const total = document.createElement("p");

        total.className =
            "has-text-weight-semibold mb-5";

        total.textContent =
            `${heading}: ${formatNumber(courses.length)}`;

        result.replaceChildren(total, list);

    } catch (error) {

        if (!result.isConnected) return;

        result.innerHTML = `
            <div class="notification is-danger is-light">

                <i class="fa-solid
                          fa-triangle-exclamation"></i>

                ${t("common.error")}

            </div>
        `;

        console.error(
            "Failed to load courses:",
            error
        );

    }

}
