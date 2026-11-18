import {
    getCurrentUser
} from "./authService.js";

import {
    getLearningData
} from "./learningService.js";


const STORAGE_KEY = "skillzone-calendar";


// Storage key

function getStorageKey() {

    const user = getCurrentUser();

    return user
        ? `${STORAGE_KEY}-${user.id}`
        : null;

}


// Date format

export function getDateKey(date = new Date()) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


// Get plans

export function getPlans() {

    const key = getStorageKey();

    if (!key) return [];

    try {

        const plans = JSON.parse(
            localStorage.getItem(key) ?? "[]"
        );

        return Array.isArray(plans)
            ? plans
            : [];

    } catch (error) {

        console.error("Calendar error:", error);

        return [];

    }

}


// Save plans

function savePlans(plans) {

    const key = getStorageKey();

    if (!key) return false;

    localStorage.setItem(
        key,
        JSON.stringify(plans)
    );

    window.dispatchEvent(
        new CustomEvent("calendarchange")
    );

    return true;

}


// Validate plan

function validatePlan(plan) {

    const courseId = String(
        plan.courseId ?? ""
    );

    const date = String(
        plan.date ?? ""
    );

    const time = String(
        plan.time ?? ""
    );

    const minutes = Number(plan.minutes);

    const notes = String(
        plan.notes ?? ""
    ).trim().slice(0, 500);


    const enrolled = getLearningData().some(
        item => item.courseId === courseId
    );

    if (!enrolled) return null;


    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {

        return null;

    }

    const parsedDate = new Date(
        `${date}T00:00:00`
    );

    if (
        Number.isNaN(parsedDate.getTime()) ||
        getDateKey(parsedDate) !== date
    ) {
        return null;
    }


    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {

        return null;

    }


    if (
        !Number.isInteger(minutes) ||
        minutes < 5 ||
        minutes > 720
    ) {

        return null;

    }


    return {

        courseId,
        date,
        time,
        minutes,
        notes

    };

}


// Add plan

export function addPlan(data) {

    if (!getStorageKey()) return false;

    const valid = validatePlan(data);

    if (!valid) return false;

    const plans = getPlans();

    plans.push({

        id: crypto.randomUUID(),

        ...valid,

        completed: false,

        createdAt: new Date().toISOString(),

        updatedAt: null

    });

    return savePlans(plans);

}


// Update plan

export function updatePlan(id, data) {

    const plans = getPlans();

    const plan = plans.find(
        item => item.id === id
    );

    if (!plan) return false;

    const valid = validatePlan({

        ...plan,
        ...data

    });

    if (!valid) return false;

    Object.assign(plan, valid, {

        updatedAt: new Date().toISOString()

    });

    return savePlans(plans);

}


// Delete plan

export function deletePlan(id) {

    const plans = getPlans();

    const filtered = plans.filter(
        item => item.id !== id
    );

    if (filtered.length === plans.length) {

        return false;

    }

    return savePlans(filtered);

}


// Complete plan

export function togglePlan(id) {

    const plans = getPlans();

    const plan = plans.find(
        item => item.id === id
    );

    if (!plan) return false;

    plan.completed = !plan.completed;

    plan.updatedAt =
        new Date().toISOString();

    return savePlans(plans);

}


// Get daily plans

export function getDailyPlans(date) {

    return getPlans()

        .filter(plan => plan.date === date)

        .sort((a, b) =>
            a.time.localeCompare(b.time)
        );

}


// Get calendar statistics

export function getCalendarStats() {

    const plans = getPlans();

    const completed = plans.filter(
        plan => plan.completed
    ).length;

    const totalMinutes = plans.reduce(

        (sum, plan) => sum + plan.minutes,

        0

    );

    return {

        total: plans.length,

        completed,

        pending: plans.length - completed,

        hours: Math.round(
            totalMinutes / 60 * 10
        ) / 10,

        progress: plans.length

            ? Math.round(
                completed / plans.length * 100
            )

            : 0

    };

}