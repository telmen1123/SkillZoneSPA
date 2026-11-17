
import {
    DATA_MODE,
    LOCAL_COURSES_URL,
    LOCAL_CATEGORIES_URL,
    API_COURSES_URL,
    API_CATEGORIES_URL
} from "../config.js";

let courseCache = null;
let categoryCache = null;

async function fetchData(url) {

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Failed to load data: ${response.status}`
        );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error("Invalid data format");
    }

    return data;
}

// Бүх сургалтыг авах
export async function getCourses() {

    if (courseCache !== null) {
        return structuredClone(courseCache);
    }

    const url = DATA_MODE === "api"
        ? API_COURSES_URL
        : LOCAL_COURSES_URL;

    courseCache = await fetchData(url);

    return structuredClone(courseCache);
}

// Бүх ангиллыг авах
export async function getCategories() {

    if (categoryCache !== null) {
        return structuredClone(categoryCache);
    }

    const url = DATA_MODE === "api"
        ? API_CATEGORIES_URL
        : LOCAL_CATEGORIES_URL;

    categoryCache = await fetchData(url);

    return structuredClone(categoryCache);
}

// ID-аар сургалт авах
export async function getCourseById(id) {

    const courses = await getCourses();

    return courses.find(
        course => course.id === id
    ) ?? null;
}

// Онцлох сургалтууд
export async function getFeaturedCourses() {

    const courses = await getCourses();

    return courses.filter(
        course => course.featured
    );
}

// Ангиллаар сургалт авах
export async function getCoursesByCategory(category) {

    const courses = await getCourses();

    return courses.filter(
        course => course.category === category
    );
}

// Шинэ сургалтууд
export async function getNewCourses(limit = 4) {

    const courses = await getCourses();

    return courses
        .toSorted(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        )
        .slice(0, limit);
}

// Түр хадгалсан өгөгдөл цэвэрлэх
export function clearCourseCache() {

    courseCache = null;
    categoryCache = null;

}
