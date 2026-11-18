import {
    getCurrentUser
} from "../services/authService.js";

import {
    getCourseReviews,
    getMyReview,
    canReview,
    saveReview,
    deleteReview,
    getReviewStats
} from "../services/reviewService.js";

import {
    getLanguage
} from "../i18n/i18n.js";

import {
    escapeHtml
} from "../fn/format.js";


function lang(mn, en) {

    return getLanguage() === "mn" ? mn : en;

}


function renderStars(rating) {

    return Array.from({ length: 5 }, (_, index) => `

        <i class="${
            index < Math.round(rating)
                ? "fa-solid"
                : "fa-regular"
        } fa-star"></i>

    `).join("");

}


function getRatingLabel(rating) {

    const labels = [

        lang("Үнэлгээ сонгоно уу", "Select rating"),

        lang("Маш муу", "Very poor"),

        lang("Муу", "Poor"),

        lang("Дундаж", "Average"),

        lang("Сайн", "Good"),

        lang("Маш сайн", "Excellent")

    ];

    return labels[rating] ?? labels[0];

}


function renderReviewStats(courseId) {

    const stats = getReviewStats(courseId);

    return `

        <div class="review-summary">

            <div class="review-score">

                <strong>

                    ${stats.average.toFixed(1)}

                </strong>

                <div class="review-stars">

                    ${renderStars(stats.average)}

                </div>

                <span>

                    ${stats.total}

                    ${lang("үнэлгээ", "reviews")}

                </span>

            </div>


            <div class="review-distribution">

                ${stats.distribution.map(item => `

                    <div class="review-bar-row">

                        <span>${item.star}</span>

                        <i class="fa-solid fa-star"></i>

                        <div class="review-bar">

                            <div style="width:${item.percentage}%"></div>

                        </div>

                        <small>${item.percentage}%</small>

                    </div>

                `).join("")}

            </div>

        </div>

    `;

}


function renderReviewForm(courseId) {

    const user = getCurrentUser();

    if (!user) {

        return `

            <div class="review-notice">

                <i class="fa-solid fa-circle-info"></i>

                ${lang(
                    "Үнэлгээ өгөхийн тулд нэвтэрнэ үү.",
                    "Please log in to leave a review."
                )}

                <a href="#/login">

                    ${lang("Нэвтрэх", "Login")}

                </a>

            </div>

        `;

    }


    if (!canReview(courseId)) {

        return `

            <div class="review-notice">

                <i class="fa-solid fa-lock"></i>

                ${lang(
                    "Зөвхөн сургалт авсан хэрэглэгч үнэлгээ өгөх боломжтой.",
                    "Only enrolled students can leave a review."
                )}

            </div>

        `;

    }


    const review = getMyReview(courseId);

    const rating = review?.rating ?? 0;

    return `

        <form id="courseReviewForm" class="review-form">

            <h3>

                ${review

                    ? lang("Үнэлгээ засах", "Edit review")

                    : lang("Үнэлгээ өгөх", "Leave a review")

                }

            </h3>


            <div class="review-star-input">

                ${[1, 2, 3, 4, 5].map(star => `

                    <button
                        type="button"
                        data-review-star="${star}"
                        aria-label="${star} / 5"
                        aria-pressed="${star <= rating}"
                        class="${star <= rating ? "is-active" : ""}">

                        <i class="${
                            star <= rating
                                ? "fa-solid"
                                : "fa-regular"
                        } fa-star"></i>

                    </button>

                `).join("")}

            </div>


            <p id="reviewRatingLabel">

                ${getRatingLabel(rating)}

            </p>


            <input
                type="hidden"
                name="rating"
                value="${rating}">


            <textarea
                name="comment"
                rows="4"
                minlength="3"
                maxlength="1000"
                required
                placeholder="${lang(
                    "Сургалтын талаарх сэтгэгдлээ бичнэ үү...",
                    "Write your thoughts about this course..."
                )}">${escapeHtml(review?.comment ?? "")}</textarea>


            <p id="reviewMessage" role="status" hidden></p>


            <div class="review-form-actions">

                ${review ? `

                    <button
                        type="button"
                        id="deleteReview"
                        class="review-delete-button">

                        <i class="fa-solid fa-trash"></i>

                        ${lang("Устгах", "Delete")}

                    </button>

                ` : ""}


                <button
                    type="submit"
                    class="review-submit-button">

                    <i class="fa-solid fa-floppy-disk"></i>

                    ${lang(
                        "Үнэлгээ хадгалах",
                        "Save review"
                    )}

                </button>

            </div>

        </form>

    `;

}


function renderReviewCard(review) {

    const initial = String(
        review.userName ?? "U"
    ).charAt(0).toUpperCase();

    const date = new Date(review.updatedAt);

    const dateText = Number.isNaN(date.getTime())
        ? "-"
        : date.toLocaleDateString(
            getLanguage() === "mn" ? "mn-MN" : "en-US"
        );

    return `

        <article class="review-card">

            <div class="review-card-header">

                <div class="review-avatar">

                    ${escapeHtml(initial)}

                </div>

                <div class="review-user">

                    <strong>

                        ${escapeHtml(review.userName)}

                    </strong>

                    <div class="review-stars">

                        ${renderStars(review.rating)}

                    </div>

                </div>

                <small>${dateText}</small>

            </div>

            <p>

                ${escapeHtml(review.comment)}

            </p>

        </article>

    `;

}


function renderReviewList(courseId) {

    const reviews = getCourseReviews(courseId);

    if (!reviews.length) {

        return `

            <div class="review-empty">

                <i class="fa-regular fa-comment-dots"></i>

                <p>

                    ${lang(
                        "Одоогоор сэтгэгдэл байхгүй байна.",
                        "No reviews yet."
                    )}

                </p>

            </div>

        `;

    }

    return reviews.map(renderReviewCard).join("");

}


export function renderCourseReviews(courseId) {

    return `

        <section
            class="course-reviews"
            data-review-course="${escapeHtml(String(courseId))}">

            <h2>

                <i class="fa-solid fa-star"></i>

                ${lang(
                    "Сургалтын үнэлгээ",
                    "Course reviews"
                )}

            </h2>


            ${renderReviewStats(courseId)}


            ${renderReviewForm(courseId)}


            <h3 class="review-list-title">

                ${lang(
                    "Суралцагчдын сэтгэгдэл",
                    "Student feedback"
                )}

            </h3>


            <div class="review-list">

                ${renderReviewList(courseId)}

            </div>

        </section>

    `;

}


export function bindCourseReviews(courseId) {

    const section = document.querySelector(
        ".course-reviews"
    );

    if (!section) return;

    if (section.dataset.reviewCourse !== String(courseId)) {
        return;
    }

    const form = section.querySelector(
        "#courseReviewForm"
    );

    if (!form) return;

    if (form.dataset.bound === "true") return;

    form.dataset.bound = "true";


    const ratingInput = form.querySelector(
        '[name="rating"]'
    );

    const label = form.querySelector(
        "#reviewRatingLabel"
    );

    const message = form.querySelector(
        "#reviewMessage"
    );


    function showError(text) {

        message.hidden = false;

        message.textContent = text;

        message.className = "review-message is-error";

    }


    function refresh(messageText) {

        if (!section.isConnected) return;

        section.outerHTML = renderCourseReviews(courseId);

        bindCourseReviews(courseId);

        const newMessage = document.querySelector(
            "#reviewMessage"
        );

        if (newMessage) {

            newMessage.hidden = false;

            newMessage.className =
                "review-message is-success";

            newMessage.textContent = messageText;

        }

    }


    form.querySelectorAll("[data-review-star]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const rating = Number(
                    button.dataset.reviewStar
                );

                ratingInput.value = rating;

                label.textContent =
                    getRatingLabel(rating);

                form.querySelectorAll("[data-review-star]")
                    .forEach(star => {

                        const active =
                            Number(star.dataset.reviewStar) <= rating;

                        star.classList.toggle(
                            "is-active",
                            active
                        );

                        star.setAttribute(
                            "aria-pressed",
                            String(active)
                        );

                        star.innerHTML = `

                            <i class="${
                                active
                                    ? "fa-solid"
                                    : "fa-regular"
                            } fa-star"></i>

                        `;

                    });

            });

        });


    form.addEventListener("submit", event => {

        event.preventDefault();

        const data = Object.fromEntries(
            new FormData(form)
        );

        const result = saveReview(

            courseId,

            data.rating,

            data.comment

        );

        if (result.success) {

            refresh(

                lang(
                    "Үнэлгээ амжилттай хадгалагдлаа.",
                    "Review saved successfully."
                )

            );

            return;

        }


        const errors = {

            INVALID_RATING: lang(
                "1–5 одоор үнэлнэ үү.",
                "Select a rating from 1 to 5."
            ),

            INVALID_COMMENT: lang(
                "Сэтгэгдэл 3–1000 тэмдэгт байна.",
                "Comment must be 3–1000 characters."
            ),

            NOT_ENROLLED: lang(
                "Та энэ сургалтыг аваагүй байна.",
                "You are not enrolled in this course."
            ),

            NOT_AUTHENTICATED: lang(
                "Дахин нэвтэрнэ үү.",
                "Please log in again."
            )

        };

        showError(

            errors[result.error] ?? lang(
                "Мэдээлэл хадгалах үед алдаа гарлаа.",
                "Unable to save review."
            )

        );

    });


    form.querySelector("#deleteReview")
        ?.addEventListener("click", () => {

            if (!window.confirm(

                lang(
                    "Сэтгэгдлээ устгах уу?",
                    "Delete your review?"
                )

            )) return;


            if (deleteReview(courseId)) {

                refresh(

                    lang(
                        "Сэтгэгдэл устгагдлаа.",
                        "Review deleted."
                    )

                );

            } else {

                showError(

                    lang(
                        "Устгах үед алдаа гарлаа.",
                        "Unable to delete review."
                    )

                );

            }

        });

}