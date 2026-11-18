import {
    getCurrentUser
} from "../services/authService.js";

import {
    getOrders
} from "../services/orderService.js";

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


// FORMAT DATE

function formatOrderDate(value) {

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString(

        getLanguage() === "mn"
            ? "mn-MN"
            : "en-US",

        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }

    );

}


// PAYMENT METHOD

function getPaymentMethod(method) {

    const methods = {

        qpay: "QPay",

        card: lang(
            "Банкны карт",
            "Bank card"
        ),

        transfer: lang(
            "Дансаар шилжүүлэх",
            "Bank transfer"
        )

    };

    return methods[method] ?? method ?? "-";

}


// ORDER STATISTICS

function renderOrderStats(orders) {

    const total = orders.reduce(

        (sum, order) =>
            sum + (Number(order.total) || 0),

        0

    );

    const courses = orders.reduce(

        (sum, order) =>
            sum + (order.courses?.length ?? 0),

        0

    );

    const stats = [

        {
            icon: "fa-bag-shopping",
            label: lang("Нийт захиалга", "Total orders"),
            value: orders.length
        },

        {
            icon: "fa-wallet",
            label: lang("Нийт төлбөр", "Total spent"),
            value: formatPrice(total)
        },

        {
            icon: "fa-book-open",
            label: lang("Авсан сургалт", "Purchased courses"),
            value: courses
        }

    ];

    return `

        <div class="orders-stats">

            ${stats.map(stat => `

                <article class="orders-stat">

                    <div class="orders-stat-icon">

                        <i class="fa-solid ${stat.icon}"></i>

                    </div>

                    <strong>
                        ${escapeHtml(String(stat.value))}
                    </strong>

                    <span>${stat.label}</span>

                </article>

            `).join("")}

        </div>

    `;

}


// COURSE ITEM

function renderOrderCourse(course) {

    const title = getLocalizedValue(
        course.title ?? course.name
    ) || course.courseId;

    return `

        <div class="order-course">

            <div class="order-course-icon">

                <i class="fa-solid fa-book-open"></i>

            </div>

            <div class="order-course-info">

                <a href="#/course?id=${encodeURIComponent(course.courseId)}">

                    ${escapeHtml(title)}

                </a>

                <small>

                    ${escapeHtml(course.courseId)}

                </small>

            </div>

            <strong>

                ${formatPrice(Number(course.price) || 0)}

            </strong>

        </div>

    `;

}


// ORDER CARD

function renderOrderCard(order) {

    const courses = Array.isArray(order.courses)
        ? order.courses
        : [];

    return `

        <article class="order-card">

            <div class="order-card-header">

                <div>

                    <h3>

                        ${escapeHtml(order.id)}

                    </h3>

                    <p>

                        <i class="fa-regular fa-calendar"></i>

                        ${formatOrderDate(order.createdAt)}

                    </p>

                </div>

                <span class="order-status">

                    <i class="fa-solid fa-circle-check"></i>

                    ${lang(
                        "Төлөгдсөн (Demo)",
                        "Paid (Demo)"
                    )}

                </span>

            </div>


            <div class="order-courses">

                ${courses.map(renderOrderCourse).join("")}

            </div>


            <div class="order-card-footer">

                <div class="order-payment-info">

                    <small>

                        ${lang(
                            "Төлбөрийн хэлбэр",
                            "Payment method"
                        )}

                    </small>

                    <strong>

                        ${escapeHtml(
                            getPaymentMethod(order.paymentMethod)
                        )}

                    </strong>

                </div>


                <div class="order-total-info">

                    <small>

                        ${lang(
                            "Нийт төлбөр",
                            "Total amount"
                        )}

                    </small>

                    <strong>

                        ${formatPrice(Number(order.total) || 0)}

                    </strong>

                </div>


                <button
                    type="button"
                    class="order-details-button"
                    data-order-id="${escapeHtml(order.id)}">

                    <i class="fa-solid fa-receipt"></i>

                    ${lang("Дэлгэрэнгүй", "Details")}

                </button>

            </div>

        </article>

    `;

}


// EMPTY STATE

function renderEmptyOrders(hasOrders) {

    return `

        <div class="orders-empty">

            <i class="fa-solid fa-bag-shopping"></i>

            <h3>

                ${hasOrders

                    ? lang(
                        "Хайлтад тохирох захиалга олдсонгүй",
                        "No matching orders"
                    )

                    : lang(
                        "Худалдан авалт байхгүй байна",
                        "No purchases yet"
                    )

                }

            </h3>

            <p>

                ${lang(
                    "Сонирхсон сургалтаа хайж олоорой.",
                    "Explore courses that interest you."
                )}

            </p>

            <a href="#/courses" class="order-details-button">

                ${lang("Сургалт үзэх", "Browse courses")}

                <i class="fa-solid fa-arrow-right"></i>

            </a>

        </div>

    `;

}


// ORDER DETAILS MODAL

function renderOrderModal() {

    return `

        <dialog id="orderModal" class="order-modal">

            <div class="order-modal-header">

                <h2>

                    ${lang(
                        "Захиалгын дэлгэрэнгүй",
                        "Order details"
                    )}

                </h2>

                <button
                    type="button"
                    id="closeOrderModal"
                    aria-label="${lang("Хаах", "Close")}">

                    <i class="fa-solid fa-xmark"></i>

                </button>

            </div>

            <div id="orderModalContent"></div>

        </dialog>

    `;

}


// MODAL CONTENT

function renderOrderDetails(order) {

    const rows = [

        [
            lang("Захиалгын дугаар", "Order ID"),
            order.id
        ],

        [
            lang("Огноо", "Date"),
            formatOrderDate(order.createdAt)
        ],

        [
            lang("Төлбөрийн хэлбэр", "Payment method"),
            getPaymentMethod(order.paymentMethod)
        ],

        [
            lang("Төлөв", "Status"),
            lang("Амжилттай (Demo)", "Successful (Demo)")
        ],

        [
            lang("Үндсэн үнэ", "Subtotal"),
            formatPrice(Number(order.subtotal) || 0)
        ],

        [
            lang("Хөнгөлөлт", "Discount"),
            formatPrice(Number(order.discount) || 0)
        ]

    ];

    return `

        <div class="order-modal-body">

            ${rows.map(([label, value]) => `

                <div class="order-detail-row">

                    <span>${escapeHtml(label)}</span>

                    <strong>

                        ${escapeHtml(String(value ?? "-"))}

                    </strong>

                </div>

            `).join("")}


            <div class="order-detail-total">

                <span>

                    ${lang("Нийт төлбөр", "Total amount")}

                </span>

                <strong>

                    ${formatPrice(Number(order.total) || 0)}

                </strong>

            </div>


            <div class="order-modal-courses">

                ${(order.courses ?? [])
                    .map(renderOrderCourse)
                    .join("")}

            </div>


            <p class="order-demo-notice">

                <i class="fa-solid fa-circle-info"></i>

                ${lang(
                    "Энэ нь туршилтын төлбөрийн мэдээлэл бөгөөд албан ёсны баримт биш.",
                    "This is a demo payment record, not an official receipt."
                )}

            </p>


            <a href="#/my-learning"
               class="order-details-button">

                <i class="fa-solid fa-book-open"></i>

                ${lang(
                    "Миний сургалтууд",
                    "My learning"
                )}

            </a>

        </div>

    `;

}


// RENDER PAGE

export function renderOrderHistoryPage() {

    const user = getCurrentUser();

    if (!user) return "";

    return `

        <section class="orders-page">

            <div class="app-container">

                <a href="#/profile" class="orders-back">

                    <i class="fa-solid fa-arrow-left"></i>

                    Dashboard

                </a>


                <div class="orders-hero">

                    <div>

                        <span>SKILLZONE ORDERS</span>

                        <h1>

                            ${lang(
                                "Худалдан авалтын түүх",
                                "Order history"
                            )}

                        </h1>

                        <p>

                            ${lang(
                                "Захиалга болон төлбөрийн мэдээллээ харах.",
                                "View your orders and payment history."
                            )}

                        </p>

                    </div>

                    <i class="fa-solid fa-bag-shopping"></i>

                </div>


                <div id="ordersStats"></div>


                <div class="orders-toolbar">

                    <div class="orders-search">

                        <i class="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="search"
                            id="orderSearch"
                            placeholder="${lang(
                                "Захиалга хайх...",
                                "Search orders..."
                            )}">

                    </div>


                    <select id="orderSort">

                        <option value="recent">

                            ${lang("Шинэ эхэнд", "Newest first")}

                        </option>

                        <option value="oldest">

                            ${lang("Хуучин эхэнд", "Oldest first")}

                        </option>

                        <option value="price-desc">

                            ${lang("Үнэ буурахаар", "Highest price")}

                        </option>

                        <option value="price-asc">

                            ${lang("Үнэ өсөхөөр", "Lowest price")}

                        </option>

                    </select>

                </div>


                <p id="ordersResultCount"></p>

                <div id="ordersContent"></div>

                ${renderOrderModal()}

            </div>

        </section>

    `;

}


// BIND EVENTS

export function bindOrderHistoryPage() {

    if (!getCurrentUser()) {

        window.location.hash = "/login";

        return;

    }

    const page = document.querySelector(".orders-page");

    if (!page) return;

    const orders = getOrders();

    const content = page.querySelector("#ordersContent");

    const search = page.querySelector("#orderSearch");

    const sort = page.querySelector("#orderSort");

    const resultCount = page.querySelector("#ordersResultCount");

    const modal = page.querySelector("#orderModal");

    const modalContent = page.querySelector("#orderModalContent");


    page.querySelector("#ordersStats").innerHTML =

        renderOrderStats(orders);


    function renderOrders() {

        const query = search.value.trim().toLowerCase();

        const filtered = orders.filter(order => {

            const values = [

                order.id,

                getPaymentMethod(order.paymentMethod),

                ...(order.courses ?? []).map(course =>

                    getLocalizedValue(
                        course.title ?? course.name
                    ) || course.courseId

                )

            ];

            return values.some(value =>

                String(value ?? "")
                    .toLowerCase()
                    .includes(query)

            );

        });


        if (sort.value === "recent") {

            filtered.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

        } else if (sort.value === "oldest") {

            filtered.sort((a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt)
            );

        } else if (sort.value === "price-desc") {

            filtered.sort((a, b) =>
                Number(b.total) - Number(a.total)
            );

        } else if (sort.value === "price-asc") {

            filtered.sort((a, b) =>
                Number(a.total) - Number(b.total)
            );

        }


        resultCount.textContent = lang(

            `${filtered.length} захиалга`,

            `${filtered.length} orders`

        );


        content.innerHTML = filtered.length

            ? filtered.map(renderOrderCard).join("")

            : renderEmptyOrders(orders.length > 0);

    }


    search.addEventListener("input", renderOrders);

    sort.addEventListener("change", renderOrders);


    content.addEventListener("click", event => {

        const button = event.target.closest("[data-order-id]");

        if (!button) return;

        const order = orders.find(

            item => item.id === button.dataset.orderId

        );

        if (!order) return;

        modalContent.innerHTML = renderOrderDetails(order);

        modal.showModal();

    });


    page.querySelector("#closeOrderModal")

        .addEventListener("click", () => {

            modal.close();

        });


    modal.addEventListener("click", event => {

        if (event.target === modal) {

            modal.close();

        }

        if (event.target.closest("a")) {

            modal.close();

        }

    });


    renderOrders();

}