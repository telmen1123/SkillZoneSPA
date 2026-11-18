
import {
    getCurrentUser
} from "../services/authService.js";

import {
    getCheckoutCourses,
    calculateOrder,
    createOrder
} from "../services/orderService.js";

import {
    loadImages,
    getCourseCover
} from "../services/imageService.js";

import {
    getLanguage,
    getLocalizedValue,
    formatPrice
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


// CHECKOUT STEPS

function renderSteps(success = false) {

    return `
        <div class="checkout-steps">

            <div class="checkout-step is-completed">

                <span>
                    <i class="fa-solid fa-check"></i>
                </span>

                ${lang("Сагс", "Cart")}

            </div>

            <div class="checkout-step-line"></div>

            <div class="checkout-step
                        ${success ? "is-completed" : "is-active"}">

                <span>
                    <i class="fa-solid ${
                        success ? "fa-check" : "fa-credit-card"
                    }"></i>
                </span>

                ${lang("Төлбөр", "Payment")}

            </div>

            <div class="checkout-step-line"></div>

            <div class="checkout-step
                        ${success ? "is-completed" : ""}">

                <span>
                    <i class="fa-solid fa-check"></i>
                </span>

                ${lang("Баталгаажуулалт", "Confirmation")}

            </div>

        </div>
    `;

}


// PAYMENT OPTION

function renderPaymentOption({
    id,
    icon,
    title,
    description
}) {

    return `
        <label class="checkout-payment-option">

            <input
                type="radio"
                name="paymentMethod"
                value="${id}"
                ${id === "qpay" ? "checked" : ""}>

            <div class="checkout-payment-icon">

                <i class="fa-solid ${icon}"></i>

            </div>

            <div class="checkout-payment-info">

                <strong>${title}</strong>

                <small>${description}</small>

            </div>

            <span class="checkout-radio"></span>

        </label>
    `;

}


// COURSE ITEM

function renderCourseItem(course) {

    const id = getCourseId(course);

    const title = getLocalizedValue(
        course.title ?? course.name
    );

    const image = getCourseCover(id);

    return `
        <article class="checkout-course">

            <div class="checkout-course-image">

                ${image
                    ? `<img
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(title)}">`

                    : `<i class="fa-solid fa-book-open"></i>`
                }

            </div>

            <div class="checkout-course-info">

                <h3>${escapeHtml(title)}</h3>

                <span>
                    ${escapeHtml(
                        getLocalizedValue(course.instructor)
                    )}
                </span>

            </div>

            <strong>
                ${formatPrice(course.price)}
            </strong>

        </article>
    `;

}


// ORDER SUMMARY

function renderOrderSummary(courses) {

    const totals = calculateOrder(courses);

    return `
        <aside class="checkout-card checkout-summary">

            <h2>
                ${lang(
                    "Захиалгын мэдээлэл",
                    "Order summary"
                )}
            </h2>

            <div class="checkout-course-list">

                ${courses.map(renderCourseItem).join("")}

            </div>

            <div class="checkout-prices">

                <div>

                    <span>
                        ${lang("Үндсэн үнэ", "Subtotal")}
                    </span>

                    <strong>
                        ${formatPrice(totals.subtotal)}
                    </strong>

                </div>

                <div>

                    <span>
                        ${lang("Хөнгөлөлт", "Discount")}
                    </span>

                    <strong class="checkout-discount">
                        -${formatPrice(totals.discount)}
                    </strong>

                </div>

            </div>

            <div class="checkout-total">

                <span>
                    ${lang("Нийт төлөх", "Total")}
                </span>

                <strong>
                    ${formatPrice(totals.total)}
                </strong>

            </div>

            <label class="checkout-agreement">

                <input
                    type="checkbox"
                    id="checkoutAgreement"
                    required>

                <span>
                    ${lang(
                        "Энэ нь туршилтын захиалга гэдгийг зөвшөөрч байна.",
                        "I understand this is a demo order."
                    )}
                </span>

            </label>

            <div
                id="checkoutMessage"
                class="checkout-message"
                role="alert"
                hidden>
            </div>

            <button
                type="submit"
                id="checkoutSubmit"
                class="checkout-submit">

                <i class="fa-solid fa-lock"></i>

                ${lang(
                    "Төлбөр баталгаажуулах",
                    "Confirm demo payment"
                )}

            </button>

            <p class="checkout-safe-text">

                <i class="fa-solid fa-circle-info"></i>

                ${lang(
                    "Demo систем — бодит төлбөр хийгдэхгүй.",
                    "Demo system — no actual payment."
                )}

            </p>

        </aside>
    `;

}


// CHECKOUT CONTENT

function renderCheckoutContent(user, courses) {

    const methods = [
        {
            id: "qpay",
            icon: "fa-qrcode",
            title: "QPay",
            description: lang(
                "Банкны аппликейшн",
                "Banking application"
            )
        },
        {
            id: "card",
            icon: "fa-credit-card",
            title: lang("Банкны карт", "Bank card"),
            description: "Visa / Mastercard"
        },
        {
            id: "transfer",
            icon: "fa-building-columns",
            title: lang(
                "Дансаар шилжүүлэх",
                "Bank transfer"
            ),
            description: lang(
                "Банкны шилжүүлэг",
                "Direct bank transfer"
            )
        }
    ];

    return `

        ${renderSteps()}

        <form
            id="checkoutForm"
            class="checkout-layout">

            <div class="checkout-main">

                <!-- USER INFORMATION -->

                <section class="checkout-card">

                    <h2>

                        <i class="fa-regular fa-user"></i>

                        ${lang(
                            "Хэрэглэгчийн мэдээлэл",
                            "Customer information"
                        )}

                    </h2>

                    <div class="checkout-field">

                        <label for="checkoutName">
                            ${lang("Овог нэр", "Full name")}
                        </label>

                        <input
                            type="text"
                            id="checkoutName"
                            value="${escapeHtml(user.name)}"
                            readonly>

                    </div>

                    <div class="checkout-field">

                        <label for="checkoutEmail">
                            ${lang("И-мэйл хаяг", "Email address")}
                        </label>

                        <input
                            type="email"
                            id="checkoutEmail"
                            value="${escapeHtml(user.email)}"
                            readonly>

                    </div>

                </section>


                <!-- PAYMENT METHODS -->

                <section class="checkout-card">

                    <h2>

                        <i class="fa-solid fa-wallet"></i>

                        ${lang(
                            "Төлбөрийн хэлбэр",
                            "Payment method"
                        )}

                    </h2>

                    <div class="checkout-payment-list">

                        ${methods.map(renderPaymentOption).join("")}

                    </div>

                    <div class="checkout-demo-notice">

                        <i class="fa-solid fa-circle-info"></i>

                        <p>
                            ${lang(
                                "Та төлбөрийн хэлбэр сонгон турших боломжтой. Банкны мэдээлэл оруулах шаардлагагүй.",
                                "Select a payment method for testing. No banking information is required."
                            )}
                        </p>

                    </div>

                </section>

            </div>

            ${renderOrderSummary(courses)}

        </form>
    `;

}


// SUCCESS PAGE

function renderCheckoutSuccess(order) {

    return `

        ${renderSteps(true)}

        <section class="checkout-success">

            <div class="checkout-success-icon">

                <i class="fa-solid fa-check"></i>

            </div>

            <span class="checkout-success-badge">
                DEMO ORDER
            </span>

            <h1>

                ${lang(
                    "Захиалга амжилттай!",
                    "Order successful!"
                )}

            </h1>

            <p>

                ${lang(
                    "Таны сургалтуудыг суралцах жагсаалтад нэмлээ.",
                    "Your courses have been added to your learning list."
                )}

            </p>

            <div class="checkout-success-details">

                <div>

                    <span>
                        ${lang("Захиалгын дугаар", "Order ID")}
                    </span>

                    <strong>
                        ${escapeHtml(order.id)}
                    </strong>

                </div>

                <div>

                    <span>
                        ${lang("Сургалтын тоо", "Courses")}
                    </span>

                    <strong>
                        ${order.courses.length}
                    </strong>

                </div>

                <div>

                    <span>
                        ${lang("Нийт дүн", "Total")}
                    </span>

                    <strong>
                        ${formatPrice(order.total)}
                    </strong>

                </div>

            </div>

            <div class="checkout-success-actions">

                <a href="#/profile"
                   class="checkout-submit">

                    <i class="fa-solid fa-table-columns"></i>

                    Dashboard

                </a>

                <a href="#/courses"
                   class="checkout-secondary-button">

                    ${lang(
                        "Бусад сургалт үзэх",
                        "Browse courses"
                    )}

                </a>

            </div>

        </section>
    `;

}


// EMPTY CHECKOUT

function renderEmptyCheckout() {

    return `
        <div class="checkout-success">

            <div class="checkout-success-icon is-empty">

                <i class="fa-solid fa-cart-shopping"></i>

            </div>

            <h2>
                ${lang(
                    "Захиалах сургалт байхгүй байна.",
                    "No courses to purchase."
                )}
            </h2>

            <p>
                ${lang(
                    "Сагсаа шалгах эсвэл шинэ сургалт сонгоно уу.",
                    "Check your cart or select another course."
                )}
            </p>

            <a href="#/cart" class="checkout-submit">

                ${lang("Сагс руу буцах", "Back to cart")}

            </a>

        </div>
    `;

}


// PAGE

export function renderCheckoutPage() {

    return `
        <section class="checkout-page">

            <div class="app-container">

                <a href="#/cart" class="checkout-back">

                    <i class="fa-solid fa-arrow-left"></i>

                    ${lang("Сагс руу буцах", "Back to cart")}

                </a>

                <div class="checkout-heading">

                    <h1>

                        ${lang(
                            "Захиалга баталгаажуулах",
                            "Checkout"
                        )}

                    </h1>

                    <p>

                        ${lang(
                            "Суралцах шинэ аяллаа эхлүүлээрэй.",
                            "Start your new learning journey."
                        )}

                    </p>

                </div>

                <div id="checkoutContent">

                    <p>
                        ${lang("Уншиж байна...", "Loading...")}
                    </p>

                </div>

            </div>

        </section>
    `;

}


// BIND EVENT

export async function bindCheckoutPage() {

    const user = getCurrentUser();

    if (!user) {

        window.location.hash = "/login";

        return;

    }

    const container = document.getElementById(
        "checkoutContent"
    );

    if (!container) return;

    try {

        const [courses] = await Promise.all([

            getCheckoutCourses(),

            loadImages().catch(console.warn)

        ]);

        if (!container.isConnected) return;

        if (!courses.length) {

            container.innerHTML = renderEmptyCheckout();

            return;

        }

        container.innerHTML =
            renderCheckoutContent(user, courses);


        const form = document.getElementById(
            "checkoutForm"
        );

        const submit = document.getElementById(
            "checkoutSubmit"
        );

        const message = document.getElementById(
            "checkoutMessage"
        );

        let processing = false;


        form.addEventListener("submit", async event => {

            event.preventDefault();

            if (processing) return;


            const paymentMethod = new FormData(form)
                .get("paymentMethod");

            processing = true;

            submit.disabled = true;

            message.hidden = true;

            submit.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                ${lang("Баталгаажуулж байна...", "Processing...")}
            `;

            try {

                const result = await createOrder(
                    paymentMethod
                );

                if (!container.isConnected) return;

                if (result.success) {

                    container.innerHTML =
                        renderCheckoutSuccess(result.order);

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                    return;

                }

                message.hidden = false;

                message.textContent = lang(
                    "Захиалга баталгаажуулах боломжгүй байна. Сагсаа шалгана уу.",
                    "Unable to complete the order. Please check your cart."
                );

            } catch (error) {

                console.error("Checkout error:", error);

                if (message.isConnected) {

                    message.hidden = false;

                    message.textContent = lang(
                        "Алдаа гарлаа. Захиалгын мэдээллээ шалгана уу.",
                        "An error occurred. Please check your order."
                    );

                }

            } finally {

                processing = false;

                if (submit.isConnected) {

                    submit.disabled = false;

                    submit.innerHTML = `
                        <i class="fa-solid fa-lock"></i>
                        ${lang(
                            "Төлбөр баталгаажуулах",
                            "Confirm demo payment"
                        )}
                    `;

                }

            }

        });

    } catch (error) {

        console.error("Checkout load error:", error);

        if (container.isConnected) {

            container.textContent = lang(
                "Захиалгын мэдээлэл ачаалагдсангүй.",
                "Unable to load checkout."
            );

        }

    }

}
