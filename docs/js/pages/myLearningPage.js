import {
    getCurrentUser
} from "../services/authService.js";

import {
    getLearningData,
    getLearningStats,
    getProgress
} from "../services/learningService.js";

import {
    getCourses
} from "../services/courseService.js";

import {
    loadImages
} from "../services/imageService.js";

import {
    renderLearningCard
} from "../components/learningCard.js";

import {
    getLanguage,
    getLocalizedValue
} from "../i18n/i18n.js";


function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}


function getCourseId(course) {

    return String(
        course.code ??
        course.courseCode ??
        course.course_code ??
        course.id ??
        ""
    );

}


// Statistics

function renderLearningStats() {

    const stats = getLearningStats();

    const items = [

        {
            icon: "fa-book-open",
            value: stats.total,
            title: lang("Нийт сургалт", "Total courses")
        },

        {
            icon: "fa-circle-play",
            value: stats.inProgress,
            title: lang("Суралцаж буй", "In progress")
        },

        {
            icon: "fa-circle-check",
            value: stats.completed,
            title: lang("Дуусгасан", "Completed")
        },

        {
            icon: "fa-clock",
            value: `${stats.hours} ${lang("цаг", "h")}`,
            title: lang("Суралцсан хугацаа", "Study time")
        }

    ];

    return items.map(item => `

        <div class="learning-hero-stat">

            <i class="fa-solid ${item.icon}"></i>

            <strong>${item.value}</strong>

            <span>${item.title}</span>

        </div>

    `).join("");

}


// Empty state

function renderEmptyLearning(hasCourses) {

    return `

        <div class="learning-empty">

            <i class="fa-solid ${
                hasCourses
                    ? "fa-magnifying-glass"
                    : "fa-book-open"
            }"></i>

            <h2>

                ${hasCourses

                    ? lang(
                        "Сургалт олдсонгүй",
                        "No matching courses"
                    )

                    : lang(
                        "Танд одоогоор сургалт байхгүй байна",
                        "You have no courses yet"
                    )

                }

            </h2>

            <p>

                ${hasCourses

                    ? lang(
                        "Хайлтын нөхцөлөө өөрчилнө үү.",
                        "Try changing your filters."
                    )

                    : lang(
                        "Сонирхсон сургалтаа сонгон суралцаж эхлээрэй.",
                        "Find a course and start learning."
                    )

                }

            </p>

            ${!hasCourses

                ? `<a href="#/courses"
                      class="learning-primary-button">

                        ${lang(
                            "Сургалт үзэх",
                            "Browse courses"
                        )}

                   </a>`

                : ""

            }

        </div>

    `;

}


// Render page

export function renderMyLearningPage() {

    return `

        <section class="learning-page">

            <div class="app-container">


                <!-- Back button -->

                <a href="#/profile"
                   class="learning-back">

                    <i class="fa-solid fa-arrow-left"></i>

                    Dashboard

                </a>


                <!-- HERO -->

                <section class="learning-hero">

                    <div class="learning-hero-content">

                        <span>MY LEARNING SPACE</span>

                        <h1>

                            ${lang(
                                "Миний сургалтууд",
                                "My learning"
                            )}

                        </h1>

                        <p>

                            ${lang(
                                "Өдөр бүр шинэ мэдлэг, шинэ боломж.",
                                "New knowledge, new opportunities every day."
                            )}

                        </p>

                    </div>

                    <div class="learning-hero-art">

                        <i class="fa-solid fa-graduation-cap"></i>

                    </div>

                    <div class="learning-hero-stats">

                        ${renderLearningStats()}

                    </div>

                </section>


                <!-- TOOLBAR -->

                <section class="learning-toolbar">

                    <div class="learning-tabs">

                        <button
                            type="button"
                            class="learning-tab is-active"
                            data-learning-filter="all"
                            aria-pressed="true">

                            ${lang("Бүгд", "All")}

                        </button>

                        <button
                            type="button"
                            class="learning-tab"
                            data-learning-filter="active"
                            aria-pressed="false">

                            ${lang("Суралцаж буй", "In progress")}

                        </button>

                        <button
                            type="button"
                            class="learning-tab"
                            data-learning-filter="completed"
                            aria-pressed="false">

                            ${lang("Дуусгасан", "Completed")}

                        </button>

                        <button
                            type="button"
                            class="learning-tab"
                            data-learning-filter="new"
                            aria-pressed="false">

                            ${lang("Эхлээгүй", "Not started")}

                        </button>

                    </div>


                    <div class="learning-toolbar-actions">

                        <div class="learning-search">

                            <i class="fa-solid fa-magnifying-glass"></i>

                            <input
                                type="search"
                                id="learningSearch"
                                aria-label="${lang("Сургалт хайх", "Search courses")}"
                                placeholder="${lang(
                                    "Сургалтаас хайх...",
                                    "Search courses..."
                                )}">

                        </div>


                        <select
                            id="learningSort"
                            class="learning-sort"
                            aria-label="${lang("Эрэмбэлэх", "Sort")}">

                            <option value="recent">

                                ${lang(
                                    "Сүүлд суралцсан",
                                    "Recently accessed"
                                )}

                            </option>

                            <option value="progress-desc">

                                ${lang(
                                    "Явц ихээс бага",
                                    "Highest progress"
                                )}

                            </option>

                            <option value="progress-asc">

                                ${lang(
                                    "Явц багаас их",
                                    "Lowest progress"
                                )}

                            </option>

                            <option value="name">

                                ${lang(
                                    "Нэрээр эрэмбэлэх",
                                    "Name"
                                )}

                            </option>

                        </select>

                    </div>

                </section>


                <!-- RESULTS -->

                <div
                    id="learningResultCount"
                    class="learning-result-count"
                    aria-live="polite">
                </div>


                <div id="learningContent">

                    <div class="has-text-centered py-6">

                        <i class="fa-solid fa-spinner fa-spin"></i>

                        ${lang("Уншиж байна...", "Loading...")}

                    </div>

                </div>

            </div>

        </section>

    `;

}


// Bind page

export async function bindMyLearningPage() {

    const user = getCurrentUser();

    if (!user) {

        window.location.hash = "/login";

        return;

    }

    const page = document.querySelector(
        ".learning-page"
    );

    if (!page) return;

    const content = page.querySelector(
        "#learningContent"
    );

    const resultCount = page.querySelector(
        "#learningResultCount"
    );

    const searchInput = page.querySelector(
        "#learningSearch"
    );

    const sortSelect = page.querySelector(
        "#learningSort"
    );

    let activeFilter = "all";


    try {

        const [courses] = await Promise.all([

            getCourses(),

            loadImages().catch(console.warn)

        ]);

        if (!page.isConnected) return;


        // Course map

        const courseMap = new Map(

            courses.map(course => [
                getCourseId(course),
                course
            ])

        );


        // Get course title

        function getTitle(record) {

            const course = courseMap.get(
                record.courseId
            );

            return String(

                course

                    ? getLocalizedValue(
                        course.title ?? course.name
                    )

                    : record.courseId

            );

        }


        // Render learning courses

        function renderCourses() {

            const records = getLearningData();

            const query = searchInput.value
                .trim()
                .toLowerCase();

            const sort = sortSelect.value;


            // Filter

            let filtered = records.filter(record => {

                const title = getTitle(record)
                    .toLowerCase();

                const course = courseMap.get(
                    record.courseId
                );

                const instructor = String(
                    getLocalizedValue(course?.instructor ?? "")
                ).toLowerCase();

                const matchesSearch =

                    title.includes(query) ||

                    instructor.includes(query) ||

                    record.courseId.toLowerCase().includes(query);


                const completed =
                    record.completedLessons >= record.totalLessons;

                const started =
                    record.completedLessons > 0;


                const matchesFilter =

                    activeFilter === "all" ||

                    (
                        activeFilter === "active" &&
                        started &&
                        !completed
                    ) ||

                    (
                        activeFilter === "completed" &&
                        completed
                    ) ||

                    (
                        activeFilter === "new" &&
                        !started
                    );


                return matchesSearch && matchesFilter;

            });


            // Sort

            filtered.sort((a, b) => {

                switch (sort) {

                    case "progress-desc":

                        return getProgress(b) -
                               getProgress(a);


                    case "progress-asc":

                        return getProgress(a) -
                               getProgress(b);


                    case "name":

                        return getTitle(a).localeCompare(
                            getTitle(b),
                            getLanguage() === "mn"
                                ? "mn"
                                : "en"
                        );


                    default:

                        return new Date(
                            b.updatedAt ?? b.enrolledAt
                        ) - new Date(
                            a.updatedAt ?? a.enrolledAt
                        );

                }

            });


            resultCount.textContent = lang(

                `${filtered.length} сургалт`,

                `${filtered.length} courses`

            );


            if (!filtered.length) {

                content.innerHTML =
                    renderEmptyLearning(records.length > 0);

                return;

            }


            content.innerHTML = `

                <div class="learning-grid">

                    ${filtered.map(record =>

                        renderLearningCard(

                            record,

                            courseMap.get(record.courseId)

                        )

                    ).join("")}

                </div>

            `;

        }


        // Filter events

        page.querySelectorAll("[data-learning-filter]")

            .forEach(button => {

                button.addEventListener("click", () => {

                    activeFilter =
                        button.dataset.learningFilter;

                    page.querySelectorAll(
                        "[data-learning-filter]"
                    ).forEach(item => {

                        const active = item === button;

                        item.classList.toggle(
                            "is-active",
                            active
                        );

                        item.setAttribute(
                            "aria-pressed",
                            String(active)
                        );

                    });

                    renderCourses();

                });

            });


        // Search event

        searchInput.addEventListener(
            "input",
            renderCourses
        );


        // Sort event

        sortSelect.addEventListener(
            "change",
            renderCourses
        );


        // Learning button event
        // Video Player руу шилжих

        content.addEventListener("click", event => {

            const button = event.target.closest(
                "[data-learning-id]"
            );

            if (!button) return;

            const courseId = button.dataset.learningId;

            const params = new URLSearchParams({
                id: courseId
            });

            window.location.hash =
                `/player?${params.toString()}`;

        });


        // Initial render

        renderCourses();


    } catch (error) {

        console.error("Learning page error:", error);

        if (!page.isConnected) return;

        content.textContent = lang(

            "Сургалтын мэдээлэл ачаалагдсангүй.",

            "Unable to load your courses."

        );

    }

}