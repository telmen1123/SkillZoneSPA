
import {
    getCurrentUser
} from "./authService.js";

import {
    getCart,
    removeFromCart
} from "./cartService.js";

import {
    enrollCourse,
    getLearningData
} from "./learningService.js";

import {
    getCourses
} from "./courseService.js";


const STORAGE_KEY = "skillzone-orders";


// Хэрэглэгчийн захиалгын түлхүүр

function getStorageKey() {

    const user = getCurrentUser();

    return user
        ? `${STORAGE_KEY}-${user.id}`
        : null;

}


// Сургалтын ID

function getCourseId(course) {

    return String(
        course.code ??
        course.courseCode ??
        course.course_code ??
        course.id ??
        ""
    );

}


// Захиалгын мэдээлэл унших

export function getOrders() {

    const key = getStorageKey();

    if (!key) return [];

    try {

        const orders = JSON.parse(
            localStorage.getItem(key) ?? "[]"
        );

        return Array.isArray(orders) ? orders : [];

    } catch (error) {

        console.error("Order error:", error);

        return [];

    }

}


// Сагсны сургалтуудыг авах

export async function getCheckoutCourses() {

    const cart = getCart();

    const courses = await getCourses();

    const enrolled = new Set(
        getLearningData().map(item => item.courseId)
    );

    return courses.filter(course => {

        const id = getCourseId(course);

        return cart.includes(id) &&
               !enrolled.has(id);

    });

}


// Үнийн нийлбэр

export function calculateOrder(courses) {

    const subtotal = courses.reduce(
        (sum, course) =>
            sum + Math.max(
                Number(course.originalPrice) || 0,
                Number(course.price) || 0
            ),
        0
    );

    const total = courses.reduce(
        (sum, course) =>
            sum + (Number(course.price) || 0),
        0
    );

    return {
        subtotal,
        discount: subtotal - total,
        total
    };

}


// Захиалга баталгаажуулах

export async function createOrder(paymentMethod) {

    const user = getCurrentUser();

    if (!user) {

        return {
            success: false,
            error: "NOT_AUTHENTICATED"
        };

    }

    const methods = [
        "qpay",
        "card",
        "transfer"
    ];

    if (!methods.includes(paymentMethod)) {

        return {
            success: false,
            error: "INVALID_PAYMENT"
        };

    }

    const courses = await getCheckoutCourses();

    if (getCurrentUser()?.id !== user.id) {

        return {
            success: false,
            error: "NOT_AUTHENTICATED"
        };

    }

    if (!courses.length) {

        return {
            success: false,
            error: "EMPTY_CART"
        };

    }

    const totals = calculateOrder(courses);

    const order = {

        id: `SZ-${crypto.randomUUID()}`,

        userId: user.id,

        courses: courses.map(course => ({

            courseId: getCourseId(course),

            title: course.title ?? course.name,

            price: Number(course.price) || 0,

            lessons: Number(course.lessons)

        })),

        subtotal: totals.subtotal,

        discount: totals.discount,

        total: totals.total,

        paymentMethod,

        status: "demo_completed",

        createdAt: new Date().toISOString()

    };


    // Өгөгдөл шалгах

    const invalidCourse = order.courses.some(
        course =>
            !course.courseId ||
            !Number.isInteger(course.lessons) ||
            course.lessons < 1 ||
            course.price < 0
    );

    if (invalidCourse) {

        return {
            success: false,
            error: "INVALID_COURSE"
        };

    }


    // Захиалга хадгалах

    const orders = getOrders();

    orders.unshift(order);

    localStorage.setItem(
        getStorageKey(),
        JSON.stringify(orders)
    );


    // Миний сургалтад нэмэх

    order.courses.forEach(course => {

        enrollCourse(
            course.courseId,
            course.lessons
        );

        removeFromCart(course.courseId);

    });


    // Event

    window.dispatchEvent(
        new CustomEvent("orderchange", {
            detail: { order }
        })
    );

    return {
        success: true,
        order
    };

}
