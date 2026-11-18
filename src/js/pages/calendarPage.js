import {
    getCurrentUser
} from "../services/authService.js";

import {
    getLearningData
} from "../services/learningService.js";

import {
    getCourses
} from "../services/courseService.js";

import {
    getDateKey,
    getPlans,
    addPlan,
    updatePlan,
    deletePlan,
    togglePlan,
    getDailyPlans,
    getCalendarStats
} from "../services/calendarService.js";

import {
    getLanguage,
    getLocalizedValue
} from "../i18n/i18n.js";

import {
    escapeHtml
} from "../fn/format.js";


// Language

function lang(mn, en) {

    return getLanguage() === "mn"
        ? mn
        : en;

}


// Course ID

function getCourseId(course) {

    return String(

        course.code ??
        course.courseCode ??
        course.course_code ??
        course.id ??
        ""

    );

}


// Course title

function getCourseTitle(course) {

    return getLocalizedValue(
        course.title ?? course.name
    );

}


// Statistics

function renderStatistics() {

    const stats = getCalendarStats();

    const items = [

        {

            icon: "fa-calendar-days",

            value: stats.total,

            title: lang(
                "Нийт төлөвлөгөө",
                "Total plans"
            )

        },

        {

            icon: "fa-circle-check",

            value: stats.completed,

            title: lang(
                "Биелүүлсэн",
                "Completed"
            )

        },

        {

            icon: "fa-clock",

            value: `${stats.hours} ${lang("цаг", "h")}`,

            title: lang(
                "Төлөвлөсөн хугацаа",
                "Planned time"
            )

        },

        {

            icon: "fa-chart-pie",

            value: `${stats.progress}%`,

            title: lang(
                "Биелэлт",
                "Completion"
            )

        }

    ];

    return `

        <div class="calendar-stats">

            ${items.map(item => `

                <div class="calendar-stat">

                    <div class="calendar-stat-icon">

                        <i class="fa-solid ${item.icon}"></i>

                    </div>

                    <strong>${item.value}</strong>

                    <span>${item.title}</span>

                </div>

            `).join("")}

        </div>

    `;

}


// Calendar grid

function renderCalendar(year, month, selectedDate) {

    const firstDay = new Date(
        year,
        month,
        1
    );

    const offset =
        (firstDay.getDay() + 6) % 7;

    const totalDays = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const today = getDateKey();

    const plans = getPlans();

    const monthTitle = firstDay.toLocaleDateString(

        getLanguage() === "mn"
            ? "mn-MN"
            : "en-US",

        {

            year: "numeric",
            month: "long"

        }

    );

    const weekDays = getLanguage() === "mn"

        ? ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"]

        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


    const emptyDays = Array.from(

        { length: offset },

        () => `<div class="calendar-day-empty"></div>`

    ).join("");


    const days = Array.from(

        { length: totalDays },

        (_, index) => {

            const day = index + 1;

            const date = getDateKey(
                new Date(year, month, day)
            );

            const count = plans.filter(
                plan => plan.date === date
            ).length;

            return `

                <button
                    type="button"

                    class="calendar-day
                        ${date === today ? "is-today" : ""}
                        ${date === selectedDate ? "is-selected" : ""}
                        ${count ? "has-plans" : ""}"

                    data-calendar-date="${date}"

                    aria-label="${date}"

                    aria-pressed="${date === selectedDate}">

                    <strong>${day}</strong>

                    ${count

                        ? `<small>${count}</small>`

                        : ""

                    }

                </button>

            `;

        }

    ).join("");


    return `

        <section class="calendar-panel">

            <div class="calendar-panel-header">

                <h2>${escapeHtml(monthTitle)}</h2>

                <div class="calendar-navigation">

                    <button
                        type="button"
                        data-calendar-action="previous"
                        aria-label="${lang("Өмнөх сар", "Previous month")}">

                        <i class="fa-solid fa-chevron-left"></i>

                    </button>

                    <button
                        type="button"
                        data-calendar-action="today">

                        ${lang("Өнөөдөр", "Today")}

                    </button>

                    <button
                        type="button"
                        data-calendar-action="next"
                        aria-label="${lang("Дараагийн сар", "Next month")}">

                        <i class="fa-solid fa-chevron-right"></i>

                    </button>

                </div>

            </div>


            <div class="calendar-weekdays">

                ${weekDays.map(day => `

                    <span>${day}</span>

                `).join("")}

            </div>


            <div class="calendar-grid">

                ${emptyDays}

                ${days}

            </div>


            <div class="calendar-legend">

                <span>

                    <i class="calendar-dot"></i>

                    ${lang(
                        "Төлөвлөгөөтэй өдөр",
                        "Scheduled day"
                    )}

                </span>

            </div>

        </section>

    `;

}


// Plan card

function renderPlan(plan, courseMap) {

    const course = courseMap.get(plan.courseId);

    const title = course

        ? getCourseTitle(course)

        : plan.courseId;


    return `

        <article class="calendar-plan
            ${plan.completed ? "is-completed" : ""}">

            <button
                type="button"
                class="calendar-plan-check"
                data-plan-toggle="${escapeHtml(plan.id)}"
                aria-pressed="${plan.completed}"
                aria-label="${lang("Биелэлт өөрчлөх", "Toggle completion")}">

                <i class="${
                    plan.completed
                        ? "fa-solid fa-circle-check"
                        : "fa-regular fa-circle"
                }"></i>

            </button>


            <div class="calendar-plan-info">

                <h3>${escapeHtml(title)}</h3>

                <div class="calendar-plan-meta">

                    <span>

                        <i class="fa-regular fa-clock"></i>

                        ${escapeHtml(plan.time)}

                    </span>

                    <span>

                        ${plan.minutes}

                        ${lang("минут", "min")}

                    </span>

                </div>

                ${plan.notes

                    ? `<p>${escapeHtml(plan.notes)}</p>`

                    : ""

                }

            </div>


            <div class="calendar-plan-actions">

                <button
                    type="button"
                    data-plan-edit="${escapeHtml(plan.id)}"
                    aria-label="${lang("Засах", "Edit")}">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    type="button"
                    data-plan-delete="${escapeHtml(plan.id)}"
                    aria-label="${lang("Устгах", "Delete")}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        </article>

    `;

}


// Daily plans

function renderDailyPlans(date, courseMap) {

    const plans = getDailyPlans(date);

    return `

        <section class="calendar-panel">

            <div class="calendar-panel-header">

                <div>

                    <h2>

                        ${lang(
                            "Өдрийн төлөвлөгөө",
                            "Daily schedule"
                        )}

                    </h2>

                    <p>${escapeHtml(date)}</p>

                </div>

                <button
                    type="button"
                    class="calendar-primary-button"
                    data-calendar-action="add">

                    <i class="fa-solid fa-plus"></i>

                    ${lang("Нэмэх", "Add")}

                </button>

            </div>


            <div class="calendar-plan-list">

                ${plans.length

                    ? plans.map(plan =>

                        renderPlan(plan, courseMap)

                    ).join("")

                    : `

                        <div class="calendar-empty">

                            <i class="fa-regular fa-calendar"></i>

                            <h3>

                                ${lang(
                                    "Төлөвлөгөө байхгүй",
                                    "No plans"
                                )}

                            </h3>

                            <p>

                                ${lang(
                                    "Энэ өдөр суралцах төлөвлөгөө нэмээрэй.",
                                    "Add a study plan for this day."
                                )}

                            </p>

                        </div>

                    `

                }

            </div>

        </section>

    `;

}


// Modal

function renderPlanModal(courses, date, plan = null) {

    return `

        <dialog
            id="calendarDialog"
            class="calendar-dialog">

            <form id="calendarForm">

                <div class="calendar-modal-header">

                    <h2>

                        ${plan

                            ? lang(
                                "Төлөвлөгөө засах",
                                "Edit plan"
                            )

                            : lang(
                                "Төлөвлөгөө нэмэх",
                                "Add study plan"
                            )

                        }

                    </h2>

                    <button
                        type="button"
                        class="calendar-modal-close"
                        data-calendar-action="close"
                        aria-label="${lang("Хаах", "Close")}">

                        <i class="fa-solid fa-xmark"></i>

                    </button>

                </div>


                <input
                    type="hidden"
                    name="id"
                    value="${escapeHtml(plan?.id ?? "")}">


                <label class="calendar-field">

                    <span>

                        ${lang("Сургалт", "Course")}

                    </span>

                    <select name="courseId" required>

                        ${courses.map(course => {

                            const id = getCourseId(course);

                            return `

                                <option
                                    value="${escapeHtml(id)}"
                                    ${plan?.courseId === id ? "selected" : ""}>

                                    ${escapeHtml(
                                        getCourseTitle(course)
                                    )}

                                </option>

                            `;

                        }).join("")}

                    </select>

                </label>


                <label class="calendar-field">

                    <span>

                        ${lang("Огноо", "Date")}

                    </span>

                    <input
                        type="date"
                        name="date"
                        value="${escapeHtml(plan?.date ?? date)}"
                        required>

                </label>


                <div class="calendar-form-row">

                    <label class="calendar-field">

                        <span>

                            ${lang("Эхлэх цаг", "Start time")}

                        </span>

                        <input
                            type="time"
                            name="time"
                            value="${escapeHtml(plan?.time ?? "18:00")}"
                            required>

                    </label>


                    <label class="calendar-field">

                        <span>

                            ${lang(
                                "Хугацаа (минут)",
                                "Duration (min)"
                            )}

                        </span>

                        <input
                            type="number"
                            name="minutes"
                            min="5"
                            max="720"
                            step="1"
                            value="${plan?.minutes ?? 60}"
                            required>

                    </label>

                </div>


                <label class="calendar-field">

                    <span>

                        ${lang("Тэмдэглэл", "Notes")}

                    </span>

                    <textarea
                        name="notes"
                        rows="3"
                        maxlength="500">${escapeHtml(plan?.notes ?? "")}</textarea>

                </label>


                <p
                    id="calendarFormError"
                    class="calendar-form-error"
                    role="alert"
                    hidden>
                </p>


                <div class="calendar-modal-actions">

                    <button
                        type="button"
                        class="calendar-secondary-button"
                        data-calendar-action="close">

                        ${lang("Болих", "Cancel")}

                    </button>

                    <button
                        type="submit"
                        class="calendar-primary-button">

                        <i class="fa-solid fa-floppy-disk"></i>

                        ${lang("Хадгалах", "Save")}

                    </button>

                </div>

            </form>

        </dialog>

    `;

}


// Render page

export function renderCalendarPage() {

    return `

        <section class="calendar-page">

            <div class="app-container">

                <a
                    href="#/profile"
                    class="calendar-back">

                    <i class="fa-solid fa-arrow-left"></i>

                    Dashboard

                </a>


                <section class="calendar-hero">

                    <div>

                        <span>SKILLZONE PLANNER</span>

                        <h1>

                            ${lang(
                                "Суралцах хуваарь",
                                "Learning calendar"
                            )}

                        </h1>

                        <p>

                            ${lang(
                                "Өдөр бүр зорилгодоо нэг алхам ойрт.",
                                "Get one step closer to your goal every day."
                            )}

                        </p>

                    </div>

                    <i class="fa-solid fa-calendar-days"></i>

                </section>


                <div id="calendarContent">

                    <div class="has-text-centered py-6">

                        <i class="fa-solid fa-spinner fa-spin"></i>

                        ${lang("Уншиж байна...", "Loading...")}

                    </div>

                </div>


                <div id="calendarModalHost"></div>

            </div>

        </section>

    `;

}


// Bind page

export async function bindCalendarPage() {

    const user = getCurrentUser();

    if (!user) {

        window.location.hash = "/login";

        return;

    }

    const page = document.querySelector(
        ".calendar-page"
    );

    if (!page) return;

    const content = page.querySelector(
        "#calendarContent"
    );

    const modalHost = page.querySelector(
        "#calendarModalHost"
    );


    const today = new Date();

    let year = today.getFullYear();

    let month = today.getMonth();

    let selectedDate = getDateKey(today);


    try {

        const courses = await getCourses();

        if (!page.isConnected) return;

        if (getCurrentUser()?.id !== user.id) {

            window.location.hash = "/login";

            return;

        }


        const enrolledIds = new Set(

            getLearningData().map(
                item => item.courseId
            )

        );


        const enrolledCourses = courses.filter(

            course => enrolledIds.has(
                getCourseId(course)
            )

        );


        const courseMap = new Map(

            courses.map(course => [

                getCourseId(course),

                course

            ])

        );


        // Render

        function render() {

            content.innerHTML = `

                ${renderStatistics()}

                <div class="calendar-layout">

                    ${renderCalendar(
                        year,
                        month,
                        selectedDate
                    )}

                    ${renderDailyPlans(
                        selectedDate,
                        courseMap
                    )}

                </div>

            `;

        }


        // Open modal

        function openModal(plan = null) {

            if (!enrolledCourses.length) {

                window.alert(

                    lang(
                        "Эхлээд сургалтад бүртгүүлнэ үү.",
                        "Please enroll in a course first."
                    )

                );

                return;

            }

            modalHost.innerHTML = renderPlanModal(

                enrolledCourses,

                selectedDate,

                plan

            );

            const dialog = modalHost.querySelector(
                "#calendarDialog"
            );

            const form = modalHost.querySelector(
                "#calendarForm"
            );

            dialog.addEventListener("close", () => {

                if (dialog.isConnected) {

                    modalHost.innerHTML = "";

                }

            });

            dialog.showModal();


            form.addEventListener("submit", event => {

                event.preventDefault();

                if (getCurrentUser()?.id !== user.id) {

                    dialog.close();

                    window.location.hash = "/login";

                    return;

                }


                const data = Object.fromEntries(

                    new FormData(form)

                );


                const id = data.id;


                const success = id

                    ? updatePlan(id, data)

                    : addPlan(data);


                if (!success) {

                    const error = form.querySelector(
                        "#calendarFormError"
                    );

                    error.hidden = false;

                    error.textContent = lang(
                        "Мэдээллээ шалгана уу.",
                        "Please check your information."
                    );

                    return;

                }


                selectedDate = data.date;

                const date = new Date(
                    `${selectedDate}T00:00:00`
                );

                year = date.getFullYear();

                month = date.getMonth();

                dialog.close();

                render();

            });

        }


        // Calendar events

        page.addEventListener("click", event => {

            if (getCurrentUser()?.id !== user.id) {

                window.location.hash = "/login";

                return;

            }


            const dateButton = event.target.closest(
                "[data-calendar-date]"
            );

            if (dateButton) {

                selectedDate =
                    dateButton.dataset.calendarDate;

                render();

                return;

            }


            const actionButton = event.target.closest(
                "[data-calendar-action]"
            );

            if (actionButton) {

                const action =
                    actionButton.dataset.calendarAction;


                if (
                    action === "previous" ||
                    action === "next"
                ) {

                    const date = new Date(

                        year,

                        month + (
                            action === "previous" ? -1 : 1
                        ),

                        1

                    );

                    year = date.getFullYear();

                    month = date.getMonth();

                    selectedDate = getDateKey(date);

                    render();

                }


                if (action === "today") {

                    const date = new Date();

                    year = date.getFullYear();

                    month = date.getMonth();

                    selectedDate = getDateKey(date);

                    render();

                }


                if (action === "add") {

                    openModal();

                }


                if (action === "close") {

                    modalHost.querySelector(
                        "#calendarDialog"
                    )?.close();

                }

                return;

            }


            // Complete plan

            const toggleButton = event.target.closest(
                "[data-plan-toggle]"
            );

            if (toggleButton) {

                togglePlan(
                    toggleButton.dataset.planToggle
                );

                render();

                return;

            }


            // Edit plan

            const editButton = event.target.closest(
                "[data-plan-edit]"
            );

            if (editButton) {

                const plan = getPlans().find(

                    item => item.id ===
                        editButton.dataset.planEdit

                );

                if (plan) {

                    openModal(plan);

                }

                return;

            }


            // Delete plan

            const deleteButton = event.target.closest(
                "[data-plan-delete]"
            );

            if (deleteButton) {

                const confirmed = window.confirm(

                    lang(
                        "Төлөвлөгөөг устгах уу?",
                        "Delete this study plan?"
                    )

                );

                if (!confirmed) return;

                deletePlan(
                    deleteButton.dataset.planDelete
                );

                render();

            }

        });


        render();


    } catch (error) {

        console.error("Calendar page error:", error);

        if (!page.isConnected) return;

        content.textContent = lang(

            "Хуваарийн мэдээлэл ачаалагдсангүй.",

            "Unable to load calendar."

        );

    }

}