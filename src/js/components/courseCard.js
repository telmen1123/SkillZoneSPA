
import {
    getCourseCover
} from "../services/imageService.js";

import {
    isInCart
} from "../services/cartService.js";

import {
    isInWishlist
} from "../services/wishlistService.js";

import {
    getLocalizedValue,
    getLanguage,
    formatPrice,
    formatNumber,
    t
} from "../i18n/i18n.js";

import {
    escapeHtml
} from "../fn/format.js";


function lang(mn, en) {

    return getLanguage() === "mn" ? mn : en;

}


export function renderCourseCard(course) {

    const code = String(
        course.code ??
        course.courseCode ??
        course.course_code ??
        course.id ??
        ""
    ).trim();

    const name =
        getLocalizedValue(course.name ?? course.title);

    const instructor =
        getLocalizedValue(
            course.instructor?.name ??
            course.instructor
        );

    const category =
        course.category?.code ??
        course.category?.id ??
        getLocalizedValue(course.category);

    const categoryName =
        t(`categories.${category}`);

    const image =
        getCourseCover(code) || course.image;

    const price = Number(course.price ?? 0);

    const originalPrice = Number(
        course.originalPrice ??
        course.original_price ??
        price
    );

    const rating = Number(course.rating ?? 0);

    const students = Number(
        course.students ??
        course.studentCount ??
        0
    );

    const lessons =
        course.lessons ?? course.lessonCount;

    const lessonCount =
        Array.isArray(lessons)
            ? lessons.length
            : lessons ?? "—";

    const durationValue =
        course.duration ?? course.hours;

    const duration =
        typeof durationValue === "object"
            ? getLocalizedValue(durationValue)
            : durationValue ?? "—";

    const inCart = isInCart(code);

    const inWishlist = isInWishlist(code);

    const detailsUrl =
        `#/course?id=${encodeURIComponent(code)}`;

    const cartLabel = inCart

        ? lang("Сагснаас хасах", "Remove from cart")

        : lang("Сагсанд нэмэх", "Add to cart");

    const wishlistLabel = inWishlist

        ? lang(
            "Дуртай сургалтаас хасах",
            "Remove from wishlist"
        )

        : lang(
            "Дуртай сургалтад нэмэх",
            "Add to wishlist"
        );


    return `

        <article class="course-card">

            <div class="course-card-media">

                <a href="${detailsUrl}"
                   class="course-card-image-link">

                    ${image ? `

                        <img
                            src="${escapeHtml(image)}"
                            alt="${escapeHtml(name)}"
                            loading="lazy"
                            decoding="async"
                        >

                    ` : `

                        <div class="course-card-placeholder">

                            <i class="fa-solid fa-graduation-cap"></i>

                        </div>

                    `}

                </a>


                <span class="course-card-category">

                    ${escapeHtml(categoryName)}

                </span>


                <button

                    type="button"

                    class="course-card-wishlist
                    ${inWishlist ? "is-active" : ""}"

                    data-wishlist-code="${escapeHtml(code)}"

                    aria-label="${escapeHtml(wishlistLabel)}"

                    aria-pressed="${inWishlist}"

                    title="${escapeHtml(wishlistLabel)}"

                >

                    <i class="${inWishlist
                        ? "fa-solid"
                        : "fa-regular"} fa-heart"></i>

                </button>

            </div>


            <div class="course-card-body">

                <h3 class="course-card-title">

                    <a href="${detailsUrl}"
                       class="course-card-title-link">

                        ${escapeHtml(name)}

                    </a>

                </h3>


                <div class="course-card-author">

                    <span>

                        <i class="fa-regular fa-user"></i>

                        ${escapeHtml(instructor)}

                    </span>

                    <span class="course-card-rating">

                        <i class="fa-solid fa-star"></i>

                        ${rating.toFixed(1)}

                    </span>

                </div>


                <div class="course-card-stats">

                    <span>

                        <i class="fa-solid fa-video"></i>

                        ${escapeHtml(String(lessonCount))}

                        ${lang("видео", "videos")}

                    </span>

                    <span>

                        <i class="fa-regular fa-clock"></i>

                        ${escapeHtml(String(duration))}

                        ${lang("цаг", "hours")}

                    </span>

                    <span>

                        <i class="fa-solid fa-users"></i>

                        ${formatNumber(students)}

                    </span>

                </div>


                <div class="course-card-footer">

                    <div class="course-card-prices">

                        ${originalPrice > price ? `

                            <del class="course-card-old-price">

                                ${formatPrice(originalPrice)}

                            </del>

                        ` : ""}

                        <strong class="course-card-price">

                            ${price === 0
                                ? t("courses.free")
                                : formatPrice(price)}

                        </strong>

                    </div>


                    <button

                        type="button"

                        class="course-card-cart
                        ${inCart ? "is-active" : ""}"

                        data-cart-code="${escapeHtml(code)}"

                        aria-label="${escapeHtml(cartLabel)}"

                        aria-pressed="${inCart}"

                        title="${escapeHtml(cartLabel)}"

                    >

                        <i class="fa-solid ${inCart
                            ? "fa-check"
                            : "fa-cart-shopping"}"></i>

                    </button>

                </div>

            </div>

        </article>

    `;

}
