
import { getCourses } from "../services/courseService.js";
import { loadImages } from "../services/imageService.js";

import {
    renderCourseGrid
} from "../components/courseGrid.js";

import {
    bindCartEvents
} from "../fn/cartEvents.js";

import {
    bindWishlistEvents
} from "../fn/wishlistEvents.js";

import {
    renderNotification
} from "../layouts/notificationLayout.js";

import {
    getLanguage,
    formatNumber,
    t
} from "../i18n/i18n.js";


// Хэлний тохиргоо

function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}


// Сургалтын ангиллууд

const categories = [
    {
        id: "programming",
        icon: "fa-code",
        color: "blue"
    },
    {
        id: "design",
        icon: "fa-pen-ruler",
        color: "purple"
    },
    {
        id: "ai",
        icon: "fa-robot",
        color: "green"
    },
    {
        id: "business",
        icon: "fa-briefcase",
        color: "orange"
    },
    {
        id: "marketing",
        icon: "fa-bullhorn",
        color: "pink"
    },
    {
        id: "language",
        icon: "fa-language",
        color: "cyan"
    },
    {
        id: "photography",
        icon: "fa-camera",
        color: "yellow"
    },
    {
        id: "personal",
        icon: "fa-chart-line",
        color: "indigo"
    }
];


// Нүүр хуудасны анхны загвар

export function renderHomePage() {

    return `
        <div class="home-page">

            ${renderHero()}

            <div id="homeContent">

                ${renderNotification(
                    t("common.loading"),
                    "loading"
                )}

            </div>

        </div>
    `;

}


// Hero section

function renderHero() {

    return `
        <section class="home-hero">

            <div class="app-container home-hero-layout">

                <div class="home-hero-content">

                    <span class="home-hero-badge">

                        <i class="fa-solid fa-graduation-cap"></i>

                        ${lang(
                            "Ирээдүйн ур чадвараа өнөөдөр",
                            "Build your future skills today"
                        )}

                    </span>

                    <h1>

                        ${lang(
                            "Шинэ мэдлэг.",
                            "New knowledge."
                        )}

                        <br>

                        <span>

                            ${lang(
                                "Шинэ боломж.",
                                "New opportunities."
                            )}

                        </span>

                    </h1>

                    <p>

                        ${lang(
                            "Мэргэжлийн багш нарын цахим сургалтаар өөрийгөө хөгжүүлж, хүссэн ур чадвараа эзэмшээрэй.",
                            "Learn from professional instructors and develop the skills you need."
                        )}

                    </p>

                    <form id="homeSearch"
                          class="home-search">

                        <i class="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="search"
                            id="homeSearchInput"
                            aria-label="${t("common.search")}"
                            placeholder="${t("nav.search")}"
                            required
                        >

                        <button type="submit">

                            ${t("common.search")}

                        </button>

                    </form>

                    <div class="home-hero-actions">

                        <a href="#/courses"
                           class="home-primary-button">

                            ${lang(
                                "Сургалт үзэх",
                                "Explore courses"
                            )}

                            <i class="fa-solid fa-arrow-right"></i>

                        </a>

                    </div>

                </div>

                <div class="home-hero-visual"
                     aria-hidden="true">

                    <div class="home-visual-circle"></div>

                    <div class="home-visual-main">

                        <i class="fa-solid fa-laptop-code"></i>

                        <h2>SkillZone</h2>

                        <p>Learn. Grow. Succeed.</p>

                    </div>

                    <div class="home-floating-card floating-code">

                        <i class="fa-solid fa-code"></i>

                        Programming

                    </div>

                    <div class="home-floating-card floating-ai">

                        <i class="fa-solid fa-robot"></i>

                        AI

                    </div>

                    <div class="home-floating-card floating-design">

                        <i class="fa-solid fa-pen-ruler"></i>

                        Design

                    </div>

                </div>

            </div>

        </section>
    `;

}


// Статистик

function renderStatistics(courses) {

    const totalStudents = courses.reduce(
        (sum, course) =>
            sum + Number(course.students ?? 0),
        0
    );

    const totalLessons = courses.reduce(
        (sum, course) =>
            sum + Number(course.lessons ?? 0),
        0
    );

    const totalInstructors = new Set(
        courses.map(course => course.instructor)
            .filter(Boolean)
    ).size;

    const statistics = [
        {
            icon: "fa-book-open",
            value: courses.length,
            label: lang("Сургалт", "Courses")
        },
        {
            icon: "fa-users",
            value: totalStudents,
            label: lang("Сургалтын бүртгэл", "Enrollments")
        },
        {
            icon: "fa-chalkboard-user",
            value: totalInstructors,
            label: lang("Багш", "Instructors")
        },
        {
            icon: "fa-circle-play",
            value: totalLessons,
            label: lang("Видео хичээл", "Video lessons")
        }
    ];

    return `
        <section class="home-statistics">

            ${statistics.map(item => `

                <div class="home-stat-item">

                    <div class="home-stat-icon">

                        <i class="fa-solid ${item.icon}"></i>

                    </div>

                    <div>

                        <strong>
                            ${formatNumber(item.value)}
                        </strong>

                        <span>
                            ${item.label}
                        </span>

                    </div>

                </div>

            `).join("")}

        </section>
    `;

}


// Ангилал

function renderCategories(courses) {

    return `
        <section class="home-section">

            <div class="home-section-header">

                <div>

                    <span class="home-section-label">

                        ${lang("АНГИЛАЛ", "CATEGORIES")}

                    </span>

                    <h2>

                        ${lang(
                            "Сонирхсон чиглэлээ сонгоорой",
                            "Explore your interests"
                        )}

                    </h2>

                </div>

                <a href="#/courses"
                   class="home-view-all">

                    ${lang("Бүгдийг үзэх", "View all")}

                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            </div>

            <div class="home-category-grid">

                ${categories.map(category => {

                    const count = courses.filter(
                        course => course.category === category.id
                    ).length;

                    const categoryName =
                        t(`categories.${category.id}`);

                    const url =
                        `#/courses?q=${encodeURIComponent(category.id)}`;

                    return `
                        <a href="${url}"
                           class="home-category-card">

                            <div class="home-category-icon
                                        category-${category.color}">

                                <i class="fa-solid ${category.icon}"></i>

                            </div>

                            <h3>
                                ${categoryName}
                            </h3>

                            <p>

                                ${count}

                                ${lang("сургалт", "courses")}

                            </p>

                        </a>
                    `;

                }).join("")}

            </div>

        </section>
    `;

}


// Сургалтын хэсэг

function renderCourseSection(label, title, courses) {

    if (!courses.length) return "";

    return `
        <section class="home-section">

            <div class="home-section-header">

                <div>

                    <span class="home-section-label">

                        ${label}

                    </span>

                    <h2>
                        ${title}
                    </h2>

                </div>

                <a href="#/courses"
                   class="home-view-all">

                    ${lang("Бүгдийг үзэх", "View all")}

                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            </div>

            ${renderCourseGrid(courses)}

        </section>
    `;

}


// Давуу тал

function renderBenefits() {

    const benefits = [
        {
            icon: "fa-laptop",
            title: lang(
                "Онлайн сургалт",
                "Online learning"
            ),
            description: lang(
                "Сонирхсон сургалтаа нэг дороос олоорой.",
                "Discover courses in one place."
            )
        },
        {
            icon: "fa-chalkboard-user",
            title: lang(
                "Олон чиглэлийн багш",
                "Dedicated instructors"
            ),
            description: lang(
                "Өөрт тохирох чиглэл, багшийг сонгоорой.",
                "Find the subject and instructor you prefer."
            )
        },
        {
            icon: "fa-book-open",
            title: lang(
                "Төрөл бүрийн сургалт",
                "Diverse courses"
            ),
            description: lang(
                "Өөрийн сонирхолд тохирсон ур чадвараа хөгжүүлээрэй.",
                "Develop skills that match your interests."
            )
        },
        {
            icon: "fa-heart",
            title: lang(
                "Хувийн жагсаалт",
                "Personal wishlist"
            ),
            description: lang(
                "Сонирхсон сургалтуудаа хадгалж, дараа нь үзээрэй.",
                "Save your favorite courses for later."
            )
        }
    ];

    return `
        <section class="home-benefits">

            <div class="home-benefits-heading">

                <h2>

                    ${lang(
                        "Яагаад SkillZone гэж?",
                        "Why SkillZone?"
                    )}

                </h2>

            </div>

            <div class="home-benefits-grid">

                ${benefits.map(item => `

                    <article class="home-benefit-card">

                        <i class="fa-solid ${item.icon}"></i>

                        <h3>
                            ${item.title}
                        </h3>

                        <p>
                            ${item.description}
                        </p>

                    </article>

                `).join("")}

            </div>

        </section>
    `;

}


// Нүүр хуудасны event

export async function bindHomePage() {

    const container =
        document.getElementById("homeContent");

    if (!container) return;

    const currentHash = window.location.hash;

    const searchForm =
        document.getElementById("homeSearch");

    searchForm?.addEventListener("submit", event => {

        event.preventDefault();

        const keyword = (
            document.getElementById("homeSearchInput")?.value ?? ""
        ).trim();

        if (!keyword) return;

        const params = new URLSearchParams({
            q: keyword
        });

        window.location.hash =
            `/courses?${params.toString()}`;

    });

    try {

        const [courses] = await Promise.all([

            getCourses(),

            loadImages().catch(error => {
                console.warn(error);
            })

        ]);

        if (
            !container.isConnected ||
            window.location.hash !== currentHash
        ) return;


        // Онцлох сургалтууд

        const featuredCourses = courses.filter(
            course => course.featured === true
        ).slice(0, 4);


        // Шинээр нэмэгдсэн сургалтууд

        const latestCourses = [...courses].sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        ).slice(0, 4);


        container.innerHTML = `

            <div class="app-container">

                ${renderStatistics(courses)}

                ${renderCategories(courses)}

                ${renderCourseSection(
                    lang("ОНЦЛОХ", "FEATURED"),
                    lang(
                        "Онцлох сургалтууд",
                        "Featured courses"
                    ),
                    featuredCourses
                )}

                ${renderCourseSection(
                    lang("ШИНЭ", "LATEST"),
                    lang(
                        "Шинээр нэмэгдсэн сургалтууд",
                        "Latest courses"
                    ),
                    latestCourses
                )}

                ${renderBenefits()}

            </div>

        `;

        bindCartEvents();

        bindWishlistEvents();

        console.info(
            "SkillZone Home Page loaded."
        );

    } catch (error) {

        if (
            !container.isConnected ||
            window.location.hash !== currentHash
        ) return;

        console.error(
            "Home page error:",
            error
        );

        container.innerHTML = renderNotification(
            t("common.error"),
            "danger"
        );

    }

}
