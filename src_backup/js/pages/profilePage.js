
import {
    getCurrentUser,
    logoutUser
} from "../services/authService.js";

import {
    getLearningStats,
    getContinueLearning,
    getProgress
} from "../services/learningService.js";

import {
    getCourses
} from "../services/courseService.js";

import {
    loadImages,
    getCourseCover
} from "../services/imageService.js";

import {
    renderDashboardSidebar
} from "../components/dashboardSidebar.js";

import {
    renderDashboardCharts,
    destroyDashboardCharts
} from "../components/dashboardCharts.js";

import {
    getLanguage,
    getLocalizedValue
} from "../i18n/i18n.js";

import {
    escapeHtml
} from "../fn/format.js";


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


function getInitials(name) {
    return String(name ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join("") || "U";
}


// STAT CARD

function renderStatCard(icon, color, value, title) {
    return `
        <article class="dashboard-stat">

            <div class="dashboard-stat-icon ${color}">
                <i class="fa-solid ${icon}"></i>
            </div>

            <strong>${value}</strong>

            <span>${title}</span>

        </article>
    `;
}


// CONTINUE LEARNING CARD

function renderLearningCard(record, course) {

    const title = course
        ? getLocalizedValue(course.title ?? course.name)
        : record.courseId;

    const image = getCourseCover(record.courseId);

    const progress = getProgress(record);

    return `
        <article class="dashboard-course">

            <div class="dashboard-course-image">

                ${image
                    ? `<img src="${escapeHtml(image)}"
                            alt="${escapeHtml(title)}">`
                    : `<i class="fa-solid fa-book-open"></i>`
                }

            </div>

            <div class="dashboard-course-content">

                <h3>${escapeHtml(title)}</h3>

                <div class="dashboard-progress-label">

                    <span>
                        ${record.completedLessons} /
                        ${record.totalLessons}
                        ${lang("хичээл", "lessons")}
                    </span>

                    <strong>${progress}%</strong>

                </div>

                <div class="dashboard-progress-track"
                     role="progressbar"
                     aria-valuenow="${progress}"
                     aria-valuemin="0"
                     aria-valuemax="100">

                    <div style="width:${progress}%"></div>

                </div>

            </div>

            <a href="#/my-learning"
               class="dashboard-play"
               aria-label="${lang(
                   "Үргэлжлүүлэн сурах",
                   "Continue learning"
               )}">

                <i class="fa-solid fa-circle-play"></i>

            </a>

        </article>
    `;
}


// DASHBOARD

export function renderProfilePage() {

    const user = getCurrentUser();

    if (!user) {
        return `
            <section class="section">
                <div class="app-container">
                    <a href="#/login" class="app-button">
                        ${lang("Нэвтрэх", "Sign in")}
                    </a>
                </div>
            </section>
        `;
    }

    const stats = getLearningStats();

    const initials = getInitials(user.name);

    const firstName = user.name.trim().split(/\s+/)[0];

    const joinedDate = new Date(user.createdAt)
        .toLocaleDateString(
            getLanguage() === "mn" ? "mn-MN" : "en-US"
        );

    return `
        <section class="dashboard-page">

            <div class="dashboard-layout">

                ${renderDashboardSidebar()}

                <main class="dashboard-main">

                    <!-- TOP BAR -->

                    <header class="dashboard-topbar">

                        <div>

                            <h1>Dashboard</h1>

                            <p>
                                ${lang(
                                    "Таны суралцах орчин",
                                    "Your learning workspace"
                                )}
                            </p>

                        </div>

                        <div class="dashboard-topbar-actions">

                            <a href="#/notifications"
                               class="dashboard-bell"
                               aria-label="${lang(
                                   "Мэдэгдэл",
                                   "Notifications"
                               )}">

                                <i class="fa-regular fa-bell"></i>

                            </a>

                            <div class="dashboard-avatar">
                                ${escapeHtml(initials)}
                            </div>

                        </div>

                    </header>


                    <!-- WELCOME BANNER -->

                    <section class="dashboard-welcome">

                        <div class="dashboard-welcome-content">

                            <span>YOUR LEARNING JOURNEY</span>

                            <h2>

                                ${lang("Сайн уу", "Hello")},

                                ${escapeHtml(firstName)}! 👋

                            </h2>

                            <p>
                                ${lang(
                                    "Өнөөдөр шинэ зүйл сурч, зорилгодоо нэг алхам ойртоорой.",
                                    "Learn something new and get one step closer to your goals."
                                )}
                            </p>

                            <a href="#/my-learning"
                               class="dashboard-welcome-button">

                                ${lang(
                                    "Үргэлжлүүлэн сурах",
                                    "Continue learning"
                                )}

                                <i class="fa-solid fa-arrow-right"></i>

                            </a>

                        </div>

                        <div class="dashboard-welcome-art">

                            <i class="fa-solid fa-laptop-code"></i>

                            <span class="dashboard-art-star">
                                <i class="fa-solid fa-star"></i>
                            </span>

                            <span class="dashboard-art-book">
                                <i class="fa-solid fa-book-open"></i>
                            </span>

                        </div>

                    </section>


                    <!-- STATISTICS -->

                    <section class="dashboard-stats">

                        ${renderStatCard(
                            "fa-book-open",
                            "stat-blue",
                            stats.total,
                            lang("Миний сургалт", "My courses")
                        )}

                        ${renderStatCard(
                            "fa-circle-check",
                            "stat-green",
                            stats.completed,
                            lang("Дуусгасан", "Completed")
                        )}

                        ${renderStatCard(
                            "fa-clock",
                            "stat-purple",
                            `${stats.hours} ${lang("цаг", "h")}`,
                            lang(
                                "Суралцсан хугацаа",
                                "Study time"
                            )
                        )}

                        ${renderStatCard(
                            "fa-award",
                            "stat-orange",
                            stats.certificates,
                            lang("Сертификат", "Certificates")
                        )}

                    </section>


                    <!-- CHARTS -->

                    <section
                        class="dashboard-analytics"
                        id="dashboardAnalytics">

                        <article class="dashboard-card">

                            <div class="dashboard-card-heading">

                                <div>

                                    <h2>
                                        ${lang(
                                            "Суралцсан хугацаа",
                                            "Learning activity"
                                        )}
                                    </h2>

                                    <p>
                                        ${lang(
                                            "Сүүлийн 7 хоногийн үзүүлэлт",
                                            "Activity over the last 7 days"
                                        )}
                                    </p>

                                </div>

                                <span class="dashboard-period">
                                    ${lang("7 хоног", "7 days")}
                                </span>

                            </div>

                            <div class="dashboard-chart-area">

                                <canvas
                                    id="weeklyLearningChart"
                                    role="img"
                                    aria-label="${lang(
                                        "Суралцсан хугацааны график",
                                        "Weekly learning chart"
                                    )}">
                                </canvas>

                            </div>

                        </article>


                        <article class="dashboard-card">

                            <div class="dashboard-card-heading">

                                <div>

                                    <h2>
                                        ${lang(
                                            "Сургалтын ерөнхий явц",
                                            "Learning progress"
                                        )}
                                    </h2>

                                    <p>
                                        ${lang(
                                            "Таны сургалтуудын төлөв",
                                            "Your course status"
                                        )}
                                    </p>

                                </div>

                            </div>

                            <div class="dashboard-doughnut">

                                <div class="dashboard-chart-area">

                                    <canvas
                                        id="learningProgressChart"
                                        role="img"
                                        aria-label="${lang(
                                            "Сургалтын төлөвийн график",
                                            "Course status chart"
                                        )}">
                                    </canvas>

                                </div>

                                <div class="dashboard-chart-center">

                                    <strong>${stats.progress}%</strong>

                                    <span>
                                        ${lang("Нийт явц", "Overall")}
                                    </span>

                                </div>

                            </div>

                            <div class="dashboard-legend">

                                <div>
                                    <span class="legend-dot green"></span>
                                    ${lang("Дуусгасан", "Completed")}
                                    <strong>${stats.completed}</strong>
                                </div>

                                <div>
                                    <span class="legend-dot blue"></span>
                                    ${lang("Суралцаж байгаа", "In progress")}
                                    <strong>${stats.inProgress}</strong>
                                </div>

                                <div>
                                    <span class="legend-dot gray"></span>
                                    ${lang("Эхлээгүй", "Not started")}
                                    <strong>${stats.notStarted}</strong>
                                </div>

                            </div>

                        </article>

                    </section>


                    <!-- CONTINUE LEARNING -->

                    <section class="dashboard-card">

                        <div class="dashboard-card-heading">

                            <div>

                                <h2>
                                    ${lang(
                                        "Үргэлжлүүлэн сурах",
                                        "Continue learning"
                                    )}
                                </h2>

                                <p>
                                    ${lang(
                                        "Таны одоо суралцаж буй сургалтууд",
                                        "Pick up where you left off"
                                    )}
                                </p>

                            </div>

                            <a href="#/my-learning"
                               class="dashboard-view-all">

                                ${lang("Бүгдийг харах", "View all")}

                                <i class="fa-solid fa-arrow-right"></i>

                            </a>

                        </div>

                        <div id="dashboardCourses">
                            ${lang("Уншиж байна...", "Loading...")}
                        </div>

                    </section>


                    <!-- ACCOUNT INFORMATION -->

                    <section
                        class="dashboard-card"
                        id="dashboardAccount">

                        <div class="dashboard-card-heading">

                            <h2>
                                ${lang(
                                    "Хувийн мэдээлэл",
                                    "Personal information"
                                )}
                            </h2>

                        </div>

                        <div class="dashboard-account">

                            <div>
                                <span>${lang("Нэр", "Name")}</span>
                                <strong>${escapeHtml(user.name)}</strong>
                            </div>

                            <div>
                                <span>${lang("И-мэйл", "Email")}</span>
                                <strong>${escapeHtml(user.email)}</strong>
                            </div>

                            <div>
                                <span>
                                    ${lang(
                                        "Бүртгүүлсэн огноо",
                                        "Member since"
                                    )}
                                </span>
                                <strong>${escapeHtml(joinedDate)}</strong>
                            </div>

                        </div>

                    </section>

                </main>

            </div>

        </section>
    `;
}


// EVENT

export async function bindProfilePage() {

    const user = getCurrentUser();

    if (!user) {
        window.location.hash = "/login";
        return;
    }

    const page = document.querySelector(".dashboard-page");

    if (!page) return;

    window.removeEventListener(
        "hashchange",
        destroyDashboardCharts
    );

    window.addEventListener(
        "hashchange",
        destroyDashboardCharts,
        { once: true }
    );


    // Sidebar scroll

    page.querySelectorAll("[data-dashboard-target]")
        .forEach(button => {

            button.addEventListener("click", () => {

                document.getElementById(
                    button.dataset.dashboardTarget
                )?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });


    // Logout

    document.getElementById("logoutButton")
        ?.addEventListener("click", () => {

            const confirmed = window.confirm(
                lang(
                    "Та системээс гарах уу?",
                    "Do you want to sign out?"
                )
            );

            if (!confirmed) return;

            destroyDashboardCharts();

            logoutUser();

            window.location.hash = "/login";
        });


    // Render charts

    renderDashboardCharts();


    // Render enrolled courses

    const container = document.getElementById(
        "dashboardCourses"
    );

    if (!container) return;

    const learning = getContinueLearning().slice(0, 3);

    if (!learning.length) {

        container.innerHTML = `
            <div class="dashboard-empty">

                <i class="fa-solid fa-book-open"></i>

                <h3>
                    ${lang(
                        "Хараахан сургалт байхгүй байна.",
                        "No courses yet."
                    )}
                </h3>

                <p>
                    ${lang(
                        "Сонирхсон сургалтаа сонгон суралцаж эхлээрэй.",
                        "Find a course and start learning."
                    )}
                </p>

                <a href="#/courses"
                   class="dashboard-primary-button">
                    ${lang("Сургалт үзэх", "Browse courses")}
                </a>

            </div>
        `;

        return;
    }

    try {

        const [courses] = await Promise.all([
            getCourses(),
            loadImages().catch(console.warn)
        ]);

        if (!page.isConnected || !container.isConnected) {
            return;
        }

        container.innerHTML = learning.map(record => {

            const course = courses.find(
                item =>
                    getCourseId(item) === record.courseId
            );

            return renderLearningCard(record, course);

        }).join("");

    } catch (error) {

        console.error("Dashboard error:", error);

        if (container.isConnected) {
            container.textContent = lang(
                "Сургалтын мэдээлэл ачаалагдсангүй.",
                "Unable to load courses."
            );
        }

    }

}
