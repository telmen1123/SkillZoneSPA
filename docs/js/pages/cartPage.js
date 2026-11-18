
import {
    getCourses
} from "../services/courseService.js";

import {
    loadImages,
    getCourseCover
} from "../services/imageService.js";

import {
    getCart,
    removeFromCart,
    clearCart
} from "../services/cartService.js";

import {
    updateCartCount
} from "../fn/cartEvents.js";

import {
    getLanguage,
    getLocalizedValue,
    formatPrice
} from "../i18n/i18n.js";

import {
    escapeHtml
} from "../fn/format.js";


// Language

function lang(mn, en) {

    return getLanguage() === "mn" ? mn : en;

}


// Course ID

function getCourseId(course) {

    return String(
        course.code ??
        course.courseCode ??
        course.course_code ??
        course.id ??
        ""
    ).trim();

}


// EMPTY CART

function renderEmptyCart() {

    return `

        <div class="cart-empty">

            <div class="cart-empty-icon">

                <i class="fa-solid fa-cart-shopping"></i>

            </div>

            <h2>

                ${lang(
                    "Таны сагс хоосон байна",
                    "Your cart is empty"
                )}

            </h2>

            <p>

                ${lang(
                    "Өөрт тохирох сургалтаа сонгон суралцаж эхлээрэй.",
                    "Explore courses and start learning today."
                )}

            </p>

            <a href="#/courses" class="app-button">

                <i class="fa-solid fa-book-open"></i>

                ${lang(
                    "Сургалтууд үзэх",
                    "Browse courses"
                )}

            </a>

        </div>

    `;

}


// CART ITEM

function renderCartItem(course) {

    const id = getCourseId(course);

    const title = getLocalizedValue(
        course.title ?? course.name
    );

    const instructor = getLocalizedValue(
        course.instructor
    );

    const image = getCourseCover(id);

    const price = Number(course.price) || 0;

    const originalPrice =
        Number(course.originalPrice) || price;

    const rating = Number(course.rating) || 0;


    return `

        <article class="cart-item">


            <!-- Course image -->

            <a

                href="#/course?id=${encodeURIComponent(id)}"

                class="cart-item-image"

            >

                ${image

                    ? `<img

                        src="${escapeHtml(image)}"

                        alt="${escapeHtml(title)}"

                        loading="lazy"

                    >`

                    : `<i class="fa-solid fa-book-open"></i>`

                }

            </a>


            <!-- Course information -->

            <div class="cart-item-info">

                <a href="#/course?id=${encodeURIComponent(id)}">

                    <h3 class="cart-item-title">

                        ${escapeHtml(title)}

                    </h3>

                </a>


                <p class="cart-item-instructor">

                    <i class="fa-regular fa-user"></i>

                    ${escapeHtml(instructor)}

                </p>


                <div class="cart-item-rating">

                    <i class="fa-solid fa-star"></i>

                    <strong>

                        ${rating.toFixed(1)}

                    </strong>

                </div>


                <div class="cart-item-meta">

                    <span>

                        <i class="fa-solid fa-circle-play"></i>

                        ${Number(course.lessons) || 0}

                        ${lang("хичээл", "lessons")}

                    </span>


                    <span>

                        <i class="fa-regular fa-clock"></i>

                        ${Number(course.duration) || 0}

                        ${lang("цаг", "hours")}

                    </span>

                </div>

            </div>


            <!-- Price -->

            <div class="cart-item-price">

                <strong class="cart-current-price">

                    ${formatPrice(price)}

                </strong>


                ${originalPrice > price

                    ? `<del class="cart-original-price">

                        ${formatPrice(originalPrice)}

                       </del>`

                    : ""

                }

            </div>


            <!-- Remove -->

            <button

                type="button"

                class="cart-remove-button"

                data-remove-cart="${escapeHtml(id)}"

                title="${lang(
                    "Сагснаас хасах",
                    "Remove from cart"
                )}"

                aria-label="${lang(
                    "Сагснаас хасах",
                    "Remove from cart"
                )}"

            >

                <i class="fa-regular fa-trash-can"></i>

            </button>

        </article>

    `;

}


// CART SUMMARY

function renderCartSummary(courses) {

    const subtotal = courses.reduce(

        (sum, course) => {

            const price =
                Number(course.price) || 0;

            const originalPrice =
                Number(course.originalPrice) || price;

            return sum + Math.max(
                originalPrice,
                price
            );

        },

        0

    );


    const total = courses.reduce(

        (sum, course) =>

            sum + (Number(course.price) || 0),

        0

    );


    const discount = subtotal - total;


    return `

        <aside class="cart-summary">


            <h2>

                ${lang(
                    "Захиалгын мэдээлэл",
                    "Order summary"
                )}

            </h2>


            <div class="cart-summary-row">

                <span>

                    ${lang(
                        "Сургалтын тоо",
                        "Courses"
                    )}

                </span>

                <strong>

                    ${courses.length}

                </strong>

            </div>


            <div class="cart-summary-row">

                <span>

                    ${lang(
                        "Үндсэн үнэ",
                        "Subtotal"
                    )}

                </span>

                <strong>

                    ${formatPrice(subtotal)}

                </strong>

            </div>


            <div class="cart-summary-row">

                <span>

                    ${lang(
                        "Хөнгөлөлт",
                        "Discount"
                    )}

                </span>

                <strong class="cart-discount">

                    -${formatPrice(discount)}

                </strong>

            </div>


            <div class="cart-summary-divider"></div>


            <div class="cart-summary-total">

                <span>

                    ${lang(
                        "Нийт төлөх",
                        "Total"
                    )}

                </span>

                <strong>

                    ${formatPrice(total)}

                </strong>

            </div>


            <!-- CHECKOUT BUTTON -->

            <button

                type="button"

                id="checkoutBtn"

                class="cart-checkout-button"

            >

                <i class="fa-solid fa-credit-card"></i>

                ${lang(
                    "Төлбөр төлөх",
                    "Checkout"
                )}

                <i class="fa-solid fa-arrow-right"></i>

            </button>


            <div class="cart-secure-info">

                <i class="fa-solid fa-circle-info"></i>

                ${lang(
                    "Туршилтын төлбөрийн систем",
                    "Demo payment system"
                )}

            </div>


            <a

                href="#/courses"

                class="cart-continue-button"

            >

                <i class="fa-solid fa-arrow-left"></i>

                ${lang(
                    "Үргэлжлүүлэн сургалт үзэх",
                    "Continue shopping"
                )}

            </a>

        </aside>

    `;

}


// CART CONTENT

function renderCartContent(courses) {

    if (!courses.length) {

        return renderEmptyCart();

    }


    return `

        <div class="cart-layout">


            <!-- CART LIST -->

            <div class="cart-main">


                <div class="cart-list-header">

                    <h2>

                        ${courses.length}

                        ${lang(
                            "сургалт сагсанд байна",
                            "courses in your cart"
                        )}

                    </h2>


                    <button

                        type="button"

                        id="clearCartBtn"

                        class="cart-clear-button"

                    >

                        <i class="fa-regular fa-trash-can"></i>

                        ${lang(
                            "Сагс цэвэрлэх",
                            "Clear cart"
                        )}

                    </button>

                </div>


                <div class="cart-list">

                    ${courses.map(renderCartItem).join("")}

                </div>

            </div>


            <!-- SUMMARY -->

            ${renderCartSummary(courses)}


        </div>

    `;

}


// RENDER PAGE

export function renderCartPage() {

    return `

        <section class="cart-page">

            <div class="app-container">


                <div class="cart-heading">

                    <h1>

                        <i class="fa-solid fa-cart-shopping"></i>

                        ${lang(
                            "Миний сагс",
                            "Shopping cart"
                        )}

                    </h1>


                    <p>

                        ${lang(
                            "Сонгосон сургалтуудаа шалгаж, захиалгаа баталгаажуулна уу.",
                            "Review your selected courses and complete your order."
                        )}

                    </p>

                </div>


                <div id="cartContent">

                    <div class="has-text-centered py-6">

                        <i class="fa-solid fa-spinner fa-spin"></i>

                        ${lang(
                            "Уншиж байна...",
                            "Loading..."
                        )}

                    </div>

                </div>

            </div>

        </section>

    `;

}


// BIND CART PAGE

export async function bindCartPage() {

    const container = document.getElementById(
        "cartContent"
    );

    if (!container) return;


    try {

        const [allCourses] = await Promise.all([

            getCourses(),

            loadImages().catch(error => {

                console.warn(
                    "Image load error:",
                    error
                );

            })

        ]);


        if (!container.isConnected) return;


        // Cart шинэчлэх

        function renderCart() {

            if (!container.isConnected) return;

            const cart = getCart();


            const courses = allCourses.filter(

                course => cart.includes(
                    getCourseId(course)
                )

            );


            container.innerHTML =
                renderCartContent(courses);


            updateCartCount();

        }


        // Event delegation

        container.onclick = event => {


            // Сургалтыг сагснаас хасах

            const removeButton = event.target.closest(
                "[data-remove-cart]"
            );


            if (removeButton) {

                const id =
                    removeButton.dataset.removeCart;

                removeFromCart(id);

                renderCart();

                return;

            }


            // Сагс цэвэрлэх

            const clearButton = event.target.closest(
                "#clearCartBtn"
            );


            if (clearButton) {

                const confirmed = window.confirm(

                    lang(
                        "Та сагсаа цэвэрлэх үү?",
                        "Do you want to clear your cart?"
                    )

                );


                if (!confirmed) return;


                clearCart();

                renderCart();

                return;

            }


            // CHECKOUT PAGE

            const checkoutButton = event.target.closest(
                "#checkoutBtn"
            );


            if (checkoutButton) {

                if (!getCart().length) return;


                window.location.hash = "/checkout";

            }

        };


        // Initial render

        renderCart();


    } catch (error) {

        console.error(
            "Cart page error:",
            error
        );


        if (!container.isConnected) return;


        container.innerHTML = `

            <div class="notification is-danger is-light">

                ${lang(
                    "Сагсны мэдээлэл ачаалахад алдаа гарлаа.",
                    "Unable to load cart information."
                )}

            </div>

        `;

    }

}
