import {
    getCurrentUser
} from "./authService.js";

import {
    isEnrolled
} from "./learningService.js";


const STORAGE_KEY = "skillzone-reviews";


export function getReviews() {

    try {

        const data = JSON.parse(
            localStorage.getItem(STORAGE_KEY) ?? "[]"
        );

        return Array.isArray(data) ? data : [];

    } catch (error) {

        console.error("Reviews error:", error);

        return [];

    }

}


function saveReviews(reviews) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reviews)
    );

    window.dispatchEvent(
        new CustomEvent("reviewchange")
    );

}


export function getCourseReviews(courseId) {

    return getReviews()

        .filter(review =>
            review.courseId === String(courseId)
        )

        .sort((a, b) =>
            new Date(b.updatedAt) -
            new Date(a.updatedAt)
        );

}


export function getMyReview(courseId) {

    const user = getCurrentUser();

    if (!user) return null;

    return getCourseReviews(courseId).find(
        review => review.userId === user.id
    ) ?? null;

}


export function canReview(courseId) {

    return !!getCurrentUser() &&
        isEnrolled(courseId);

}


export function saveReview(courseId, rating, comment) {

    const user = getCurrentUser();

    if (!user) {

        return {
            success: false,
            error: "NOT_AUTHENTICATED"
        };

    }

    courseId = String(courseId ?? "").trim();

    if (!courseId || !isEnrolled(courseId)) {

        return {
            success: false,
            error: "NOT_ENROLLED"
        };

    }

    rating = Number(rating);

    comment = String(comment ?? "").trim();

    if (
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
    ) {

        return {
            success: false,
            error: "INVALID_RATING"
        };

    }

    if (comment.length < 3 || comment.length > 1000) {

        return {
            success: false,
            error: "INVALID_COMMENT"
        };

    }

    const reviews = getReviews();

    const existing = reviews.find(review =>

        review.courseId === courseId &&
        review.userId === user.id

    );

    const now = new Date().toISOString();


    if (existing) {

        existing.rating = rating;

        existing.comment = comment;

        existing.userName = user.name;

        existing.updatedAt = now;

    } else {

        reviews.push({

            id: crypto.randomUUID(),

            courseId,

            userId: user.id,

            userName: user.name,

            rating,

            comment,

            createdAt: now,

            updatedAt: now

        });

    }

    try {

        saveReviews(reviews);

        return { success: true };

    } catch (error) {

        return {
            success: false,
            error: "STORAGE_ERROR"
        };

    }

}


export function deleteReview(courseId) {

    const user = getCurrentUser();

    if (!user) return false;

    const reviews = getReviews();

    const filtered = reviews.filter(review =>

        !(
            review.courseId === String(courseId) &&
            review.userId === user.id
        )

    );

    if (reviews.length === filtered.length) {

        return false;

    }

    try {

        saveReviews(filtered);

        return true;

    } catch (error) {

        return false;

    }

}


export function getReviewStats(courseId) {

    const reviews = getCourseReviews(courseId);

    const total = reviews.length;

    const sum = reviews.reduce(
        (result, review) => result + review.rating,
        0
    );

    const average = total
        ? Number((sum / total).toFixed(1))
        : 0;

    const distribution = [5, 4, 3, 2, 1].map(star => {

        const count = reviews.filter(
            review => review.rating === star
        ).length;

        return {

            star,

            count,

            percentage: total
                ? Math.round(count / total * 100)
                : 0

        };

    });

    return {

        total,

        average,

        distribution

    };

}