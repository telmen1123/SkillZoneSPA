
import { escapeHtml } from "../fn/format.js";

import {
    t,
    getLanguage,
    getLocalizedValue
} from "../i18n/i18n.js";


export function buildCourseGroups(courses = []) {

    const grouped = Object.groupBy(
        courses,
        course => course.category
    );

    return Object.entries(grouped).map(
        ([category, items]) => ({

            id: category,

            groupName: t(`categories.${category}`),

            items: items

        })
    );

}

// Нэг ангиллын HTML бүтэц
function renderCourseGroup(group) {

    return `

        <li class="course-group">

            <button
                type="button"
                class="app-toggle-sublist"
                aria-expanded="false">

                <span>

                    ${escapeHtml(group.groupName)}

                </span>

                <span class="group-actions">

                    <span class="group-count">

                        ${group.items.length}

                    </span>

                    <i class="fa-solid fa-chevron-down"></i>

                </span>

            </button>

            <ul class="app-sublist is-hidden">

                ${group.items.map(item => `

                    <li>

                        <label class="app-sublist-item">

                            <input
                                type="checkbox"
                                name="coursecode"
                                value="${escapeHtml(item.id)}">

                            <span>

                                ${escapeHtml(
                                    getLocalizedValue(item.title)
                                )}

                            </span>

                        </label>

                    </li>

                `).join("")}

            </ul>

        </li>

    `;

}

// Бүх ангиллын жагсаалт
export function renderCourseGroupList(courseGroups = []) {

    const isMN = getLanguage() === "mn";

    const totalCourses = courseGroups.reduce(
        (total, group) => total + group.items.length,
        0
    );

    return `

        <div class="sidebar-section"
             id="courseGroupList">

            <p class="menu-label app-menu-label">

                <i class="fa-solid fa-layer-group"></i>

                ${isMN
                    ? "Сургалтын ангилал"
                    : "Course categories"}

            </p>

            <button
                type="button"
                class="category-button is-active"
                data-category="all"
                aria-pressed="true">

                <span>

                    ${t("categories.all")}

                </span>

                <span class="group-count">

                    ${totalCourses}

                </span>

            </button>

            <ul class="menu-list course-group-list">

                ${courseGroups.map(
                    renderCourseGroup
                ).join("")}

            </ul>

        </div>

    `;

}
