import { getCourses } from "../services/courseService.js";

import {
    loadImages,
    getCourseCover
} from "../services/imageService.js";

import {
    bindCartEvents
} from "../fn/cartEvents.js";

import {
    bindWishlistEvents
} from "../fn/wishlistEvents.js";

import {
    isInCart
} from "../services/cartService.js";

import {
    isInWishlist
} from "../services/wishlistService.js";

import {
    renderPageLayout
} from "../layouts/pageLayout.js";

import {
    renderNotification
} from "../layouts/notificationLayout.js";

import {
    renderCourseGrid
} from "../components/courseGrid.js";

import {
    renderCourseReviews,
    bindCourseReviews
} from "../components/courseReviews.js";

import {
    t,
    getLanguage,
    getLocalizedValue,
    formatPrice,
    formatNumber
} from "../i18n/i18n.js";

import {
    escapeHtml
} from "../fn/format.js";


function lang(mn, en) {

    return getLanguage() === "mn" ? mn : en;

}


// INITIAL PAGE

export function renderCourseDetailsPage() {

    return renderPageLayout({

        pageId: "course-details",

        pageTitle: t("courses.details"),

        content: renderNotification(
            t("common.loading"),
            "loading"
        )

    });

}


// COURSE DETAILS

function renderCourseDetails(course, courses) {

    const code = String(course.id);

    const title = getLocalizedValue(course.title);

    const description =
        getLocalizedValue(course.description);

    const category =
        t(`categories.${course.category}`);

    const level =
        t(`courses.${course.level}`);

    const image =
        getCourseCover(code) || course.image;

    const price = Number(course.price ?? 0);

    const originalPrice =
        Number(course.originalPrice ?? price);

    const discount = originalPrice > price

        ? Math.round(
            (originalPrice - price) /
            originalPrice * 100
        )

        : 0;

    const inCart = isInCart(code);

    const inWishlist = isInWishlist(code);


    // RELATED COURSES

    const relatedCourses = courses.filter(item =>

        item.id !== course.id &&
        item.category === course.category

    ).slice(0, 4);


    return `

        <div class="course-details-page">

            <!-- BREADCRUMB -->

            <div class="details-breadcrumb">

                <a href="#/">
                    ${t("nav.home")}
                </a>

                <i class="fa-solid fa-chevron-right"></i>

                <a href="#/courses">
                    ${t("nav.courses")}
                </a>

                <i class="fa-solid fa-chevron-right"></i>

                <span>
                    ${escapeHtml(title)}
                </span>

            </div>


            <div class="details-layout">

                <main class="details-main">


                    <!-- COURSE HERO -->

                    <section class="details-hero">

                        <span class="details-category">
                            ${escapeHtml(category)}
                        </span>

                        <h1>
                            ${escapeHtml(title)}
                        </h1>

                        <p>
                            ${escapeHtml(description)}
                        </p>

                        <div class="details-hero-meta">

                            <span class="details-rating">

                                <i class="fa-solid fa-star"></i>

                                ${Number(course.rating).toFixed(1)}

                            </span>

                            <span>

                                <i class="fa-solid fa-users"></i>

                                ${formatNumber(course.students)}

                                ${lang("суралцагч", "students")}

                            </span>

                            <span>

                                <i class="fa-solid fa-signal"></i>

                                ${escapeHtml(level)}

                            </span>

                        </div>


                        <div class="details-hero-instructor">

                            <i class="fa-regular fa-user"></i>

                            ${t("courses.instructor")}:

                            <strong>
                                ${escapeHtml(course.instructor)}
                            </strong>

                        </div>

                    </section>


                    <!-- DESCRIPTION -->

                    <section class="details-section">

                        <h2>

                            <i class="fa-solid fa-book-open"></i>

                            ${lang(
                                "Сургалтын тухай",
                                "About this course"
                            )}

                        </h2>

                        <p>
                            ${escapeHtml(description)}
                        </p>

                    </section>


                    <!-- COURSE INFORMATION -->

                    <section class="details-section">

                        <h2>

                            <i class="fa-solid fa-circle-info"></i>

                            ${lang(
                                "Сургалтын мэдээлэл",
                                "Course information"
                            )}

                        </h2>


                        <div class="details-info-grid">

                            <div class="details-info-item">

                                <i class="fa-solid fa-video"></i>

                                <div>

                                    <span>
                                        ${t("courses.lessons")}
                                    </span>

                                    <strong>
                                        ${course.lessons}
                                    </strong>

                                </div>

                            </div>


                            <div class="details-info-item">

                                <i class="fa-regular fa-clock"></i>

                                <div>

                                    <span>
                                        ${t("courses.duration")}
                                    </span>

                                    <strong>

                                        ${course.duration}

                                        ${lang("цаг", "hours")}

                                    </strong>

                                </div>

                            </div>


                            <div class="details-info-item">

                                <i class="fa-solid fa-signal"></i>

                                <div>

                                    <span>
                                        ${t("courses.level")}
                                    </span>

                                    <strong>
                                        ${escapeHtml(level)}
                                    </strong>

                                </div>

                            </div>


                            <div class="details-info-item">

                                <i class="fa-solid fa-users"></i>

                                <div>

                                    <span>
                                        ${t("courses.students")}
                                    </span>

                                    <strong>
                                        ${formatNumber(course.students)}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </section>


                    <!-- CURRICULUM -->

                    <section class="details-section">

                        <h2>

                            <i class="fa-solid fa-list"></i>

                            ${lang(
                                "Сургалтын хөтөлбөр",
                                "Course curriculum"
                            )}

                        </h2>


                        <div class="details-curriculum">

                            <i class="fa-solid fa-circle-play"></i>

                            <div>

                                <strong>

                                    ${course.lessons}

                                    ${lang(
                                        "видео хичээл",
                                        "video lessons"
                                    )}

                                </strong>

                                <p>

                                    ${lang(
                                        "Нийт үргэлжлэх хугацаа:",
                                        "Total duration:"
                                    )}

                                    ${course.duration}

                                    ${lang("цаг", "hours")}

                                </p>

                            </div>

                        </div>


                        <p class="details-muted">

                            ${lang(
                                "Хичээл тус бүрийн дэлгэрэнгүй хөтөлбөр хараахан нэмэгдээгүй байна.",
                                "The detailed lesson curriculum has not been added yet."
                            )}

                        </p>

                    </section>


                    <!-- INSTRUCTOR -->

                    <section class="details-section">

                        <h2>

                            <i class="fa-solid fa-chalkboard-user"></i>

                            ${t("courses.instructor")}

                        </h2>


                        <div class="details-instructor">

                            <div class="details-avatar">

                                <i class="fa-solid fa-user"></i>

                            </div>

                            <div>

                                <h3>
                                    ${escapeHtml(course.instructor)}
                                </h3>

                                <p>
                                    ${escapeHtml(category)}
                                </p>

                            </div>

                        </div>

                    </section>


                    <!-- COURSE REVIEWS -->

                    ${renderCourseReviews(code)}


                </main>


                <!-- PURCHASE SIDEBAR -->

                <aside class="details-sidebar">

                    <div class="details-purchase-card">

                        <div class="details-cover">

                            ${image ? `

                                <img
                                    src="${escapeHtml(image)}"
                                    alt="${escapeHtml(title)}"
                                >

                            ` : `

                                <i class="fa-solid fa-graduation-cap"></i>

                            `}


                            ${discount > 0 ? `

                                <span class="details-discount">

                                    -${discount}%

                                </span>

                            ` : ""}

                        </div>


                        <div class="details-purchase-body">

                            <div class="details-prices">

                                <strong>

                                    ${price === 0
                                        ? t("courses.free")
                                        : formatPrice(price)}

                                </strong>


                                ${discount > 0 ? `

                                    <del>
                                        ${formatPrice(originalPrice)}
                                    </del>

                                ` : ""}

                            </div>


                            ${discount > 0 ? `

                                <p class="details-saving">

                                    ${formatPrice(originalPrice - price)}

                                    ${lang("хэмнэлт", "saved")}

                                </p>

                            ` : ""}


                            <!-- CART BUTTON -->

                            <button
                                type="button"
                                class="details-cart-button
                                ${inCart ? "is-active" : ""}"
                                data-cart-code="${escapeHtml(code)}"
                                aria-pressed="${inCart}"
                            >

                                <i class="fa-solid ${inCart
                                    ? "fa-check"
                                    : "fa-cart-shopping"}"></i>

                            </button>


                            <!-- WISHLIST BUTTON -->

                            <button
                                type="button"
                                class="details-wishlist-button
                                ${inWishlist ? "is-active" : ""}"
                                data-wishlist-code="${escapeHtml(code)}"
                                aria-pressed="${inWishlist}"
                            >

                                <i class="${inWishlist
                                    ? "fa-solid"
                                    : "fa-regular"} fa-heart"></i>

                            </button>


                            <a href="#/cart"
                               class="details-view-cart">

                                ${lang(
                                    "Миний сагс",
                                    "View cart"
                                )}

                                <i class="fa-solid fa-arrow-right"></i>

                            </a>


                            <!-- COURSE FEATURES -->

                            <div class="details-purchase-info">

                                <h3>

                                    ${lang(
                                        "Сургалтын үзүүлэлт",
                                        "Course features"
                                    )}

                                </h3>

                                <p>

                                    <i class="fa-solid fa-video"></i>

                                    ${course.lessons}

                                    ${lang("видео хичээл", "video lessons")}

                                </p>


                                <p>

                                    <i class="fa-regular fa-clock"></i>

                                    ${course.duration}

                                    ${lang("цаг", "hours")}

                                </p>


                                <p>

                                    <i class="fa-solid fa-signal"></i>

                                    ${escapeHtml(level)}

                                </p>


                                <p>

                                    <i class="fa-solid fa-tag"></i>

                                    ${escapeHtml(category)}

                                </p>

                            </div>

                        </div>

                    </div>

                </aside>

            </div>


            <!-- RELATED COURSES -->

            ${relatedCourses.length ? `

                <section class="details-related">

                    <h2>

                        ${lang(
                            "Төстэй сургалтууд",
                            "Related courses"
                        )}

                    </h2>

                    ${renderCourseGrid(relatedCourses)}

                </section>

            ` : ""}

        </div>

    `;

}


// BIND PAGE EVENTS

export async function bindCourseDetailsPage(params) {

    const app = document.getElementById("app");

    if (!app) return;

    const currentHash = window.location.hash;

    const pageNode = app.firstElementChild;

    const query = params instanceof URLSearchParams

        ? params

        : new URLSearchParams(
            currentHash.split("?")[1] ?? ""
        );

    const courseId = query.get("id");


    try {

        const [courses] = await Promise.all([

            getCourses(),

            loadImages().catch(error => {

                console.warn(error);

            })

        ]);


        if (
            window.location.hash !== currentHash ||
            app.firstElementChild !== pageNode
        ) return;


        const course = courses.find(

            item => String(item.id) === courseId

        );


        // COURSE NOT FOUND

        if (!course) {

            app.innerHTML = renderPageLayout({

                pageId: "course-details",

                pageTitle: t("courses.details"),

                content: renderNotification(

                    lang(
                        "Сургалт олдсонгүй.",
                        "Course not found."
                    ),

                    "warning"

                )

            });

            return;

        }


        // RENDER COURSE DETAILS

        app.innerHTML = renderPageLayout({

            pageId: "course-details",

            pageTitle: t("courses.details"),

            content: renderCourseDetails(
                course,
                courses
            )

        });


        // CART EVENTS

        bindCartEvents();


        // WISHLIST EVENTS

        bindWishlistEvents();


        // COURSE REVIEW EVENTS

        bindCourseReviews(String(course.id));


        console.info(

            "Course details loaded:",

            courseId

        );


    } catch (error) {

        if (
            window.location.hash !== currentHash ||
            app.firstElementChild !== pageNode
        ) return;


        console.error(

            "Course details error:",

            error

        );


        app.innerHTML = renderPageLayout({

            pageId: "course-details",

            pageTitle: t("courses.details"),

            content: renderNotification(

                t("common.error"),

                "danger"

            )

        });

    }

}