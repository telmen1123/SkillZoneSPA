
import { getCourses } from "../services/courseService.js";

import { loadImages } from "../services/imageService.js";

import {
    getWishlist,
    clearWishlist
} from "../services/wishlistService.js";

import {
    renderCourseGrid
} from "../components/courseGrid.js";

import {
    bindWishlistEvents,
    updateWishlistCount
} from "../fn/wishlistEvents.js";

import {
    bindCartEvents
} from "../fn/cartEvents.js";

import {
    renderPageLayout
} from "../layouts/pageLayout.js";

import {
    renderNotification
} from "../layouts/notificationLayout.js";

import {
    getLanguage,
    t
} from "../i18n/i18n.js";


// Хэл сонгох

function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}


// Сургалтын код авах

function getCourseCode(course) {

    return String(
        course.code ??
        course.courseCode ??
        course.course_code ??
        course.id ??
        ""
    ).trim();

}


// Анхны хуудас

export function renderWishlistPage() {

    return renderPageLayout({

        pageId: "wishlist",

        pageTitle: t("nav.wishlist"),

        content: renderNotification(
            t("common.loading"),
            "loading"
        )

    });

}


// Wishlist хоосон үед

function renderEmptyWishlist() {

    return `

        <div class="wishlist-empty">

            <div class="wishlist-empty-icon">

                <i class="fa-regular fa-heart"></i>

            </div>

            <h2>

                ${lang(
                    "Хадгалсан сургалт байхгүй",
                    "Your wishlist is empty"
                )}

            </h2>

            <p>

                ${lang(
                    "Та сонирхсон сургалтынхаа зүрхэн товчийг дарж хадгалаарай.",
                    "Save your favorite courses by clicking the heart button."
                )}

            </p>

            <a href="#/courses"
               class="cart-primary-button">

                ${lang(
                    "Сургалт үзэх",
                    "Browse courses"
                )}

                <i class="fa-solid fa-arrow-right"></i>

            </a>

        </div>

    `;

}


// Wishlist үндсэн агуулга

function renderWishlistContent(courses) {

    if (!courses.length) {

        return renderEmptyWishlist();

    }

    return `

        <section class="wishlist-page">

            <div class="wishlist-header">

                <div>

                    <h2>

                        ${lang(
                            "Миний хадгалсан сургалтууд",
                            "My saved courses"
                        )}

                    </h2>

                    <p>

                        ${lang("Нийт", "Total")}

                        <strong>${courses.length}</strong>

                        ${lang("сургалт", "courses")}

                    </p>

                </div>

                <button

                    type="button"

                    id="clearWishlistBtn"

                    class="wishlist-clear-button"

                >

                    <i class="fa-regular fa-trash-can"></i>

                    ${lang(
                        "Бүгдийг устгах",
                        "Clear wishlist"
                    )}

                </button>

            </div>

            <div class="wishlist-grid">

                ${renderCourseGrid(courses)}

            </div>

            <a href="#/courses"
               class="wishlist-continue-link">

                <i class="fa-solid fa-arrow-left"></i>

                ${lang(
                    "Бусад сургалт үзэх",
                    "Browse more courses"
                )}

            </a>

        </section>

    `;

}


// Хуудасны ажиллагаа

export async function bindWishlistPage() {

    const app = document.getElementById("app");

    if (!app) return;

    const currentHash = window.location.hash;

    let pageNode = app.firstElementChild;

    try {

        // Өгөгдөл болон зураг ачаалах

        const [courseData] = await Promise.all([

            getCourses(),

            loadImages().catch(error => {

                console.warn(
                    "Image load error:",
                    error
                );

            })

        ]);

        if (
            window.location.hash !== currentHash ||
            app.firstElementChild !== pageNode
        ) return;


        // Wishlist хуудас шинэчлэх

        function render() {

            const wishlist = getWishlist();

            const courses = courseData.filter(

                course => wishlist.includes(
                    getCourseCode(course)
                )

            );

            app.innerHTML = renderPageLayout({

                pageId: "wishlist",

                pageTitle: t("nav.wishlist"),

                content: renderWishlistContent(
                    courses
                )

            });

            pageNode = app.firstElementChild;

            bindCartEvents();

            bindWishlistEvents();

            updateWishlistCount();

            bindEvents();

        }


        // Event холбох

        function bindEvents() {

            document.getElementById("clearWishlistBtn")

                ?.addEventListener("click", () => {

                    const confirmed = window.confirm(

                        lang(
                            "Бүх хадгалсан сургалтыг устгах уу?",
                            "Remove all saved courses?"
                        )

                    );

                    if (!confirmed) return;

                    clearWishlist();

                });

        }


        // Wishlist өөрчлөгдөх үед

        function handleWishlistChange() {

            if (
                window.location.hash !== currentHash ||
                app.firstElementChild !== pageNode
            ) {

                cleanup();

                return;

            }

            render();

        }


        // Event цэвэрлэх

        function cleanup() {

            window.removeEventListener(
                "wishlistchange",
                handleWishlistChange
            );

            window.removeEventListener(
                "hashchange",
                cleanup
            );

            window.removeEventListener(
                "languagechange",
                cleanup
            );

        }


        // Анхны үр дүн

        render();


        // Wishlist event

        window.addEventListener(
            "wishlistchange",
            handleWishlistChange
        );


        // Хуудас солигдох үед event устгах

        window.addEventListener(
            "hashchange",
            cleanup,
            { once: true }
        );

        window.addEventListener(
            "languagechange",
            cleanup,
            { once: true }
        );


    } catch (error) {

        if (
            window.location.hash !== currentHash ||
            app.firstElementChild !== pageNode
        ) return;

        console.error(
            "Wishlist page error:",
            error
        );

        app.innerHTML = renderPageLayout({

            pageId: "wishlist",

            pageTitle: t("nav.wishlist"),

            content: renderNotification(
                t("common.error"),
                "danger"
            )

        });

    }

}
