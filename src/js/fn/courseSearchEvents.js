
import {
    renderCourseTables
} from "../components/courseTables.js";

import {
    renderCourseGrid,
    renderCourseToolbar,
    bindCourseViewEvents
} from "../components/courseGrid.js";

import {
    getLocalizedValue,
    getLanguage,
    t
} from "../i18n/i18n.js";

import {
    updateCartButtons
} from "./cartEvents.js";


// ========================================
// APPLICATION STATE
// ========================================

let courseData = [];

let activeCategory = "";

let currentView = "grid";

const VIEW_STORAGE_KEY = "skillzone-course-view";

const DEFAULT_TYPES = [
    "basic",
    "pricing",
    "rating",
    "images"
];


// ========================================
// INITIALIZE COURSE DATA
// ========================================

export function initCourseData(items) {

    courseData = Array.isArray(items) ? items : [];

    activeCategory = "";

    const savedView = localStorage.getItem(
        VIEW_STORAGE_KEY
    );

    currentView = ["grid", "table"].includes(savedView)
        ? savedView
        : "grid";

}


// ========================================
// COURSE INFORMATION
// ========================================

function getCourseCode(item) {

    return String(
        item.code ??
        item.courseCode ??
        item.course_code ??
        item.id ??
        ""
    );

}


function getCourseName(item) {

    return getLocalizedValue(
        item.name ??
        item.title ??
        item.course_name
    );

}


function getCourseCategory(item) {

    return String(
        item.category?.id ??
        item.category?.code ??
        getLocalizedValue(item.category) ??
        ""
    ).trim().toLowerCase();

}


function getCourseLevel(item) {

    return String(
        item.level?.en ??
        item.level ??
        ""
    ).trim().toLowerCase();

}


// ========================================
// SELECTED INFORMATION TYPES
// ========================================

function getSelectedTypes() {

    const inputs = document.querySelectorAll(
        'input[name="courseInfo"]'
    );

    if (!inputs.length) {

        return DEFAULT_TYPES;

    }

    return Array.from(inputs)

        .filter(input => input.checked)

        .map(input => input.value);

}


// ========================================
// SEARCH AND FILTER
// ========================================

function filterCourses() {

    const keyword = (
        document.getElementById("searchTxt")?.value ?? ""
    ).trim().toLowerCase();


    const minPrice =
        document.getElementById("minPrice")?.value ?? "";


    const maxPrice =
        document.getElementById("maxPrice")?.value ?? "";


    const minRating = Number(
        document.getElementById("minRating")?.value ?? 0
    );


    const sortBy =
        document.getElementById("sortBy")?.value ??
        "default";


    const levels = Array.from(

        document.querySelectorAll(
            'input[name="level"]:checked'
        )

    ).map(input => input.value.toLowerCase());


    let results = courseData.filter(item => {

        const name = String(
            getCourseName(item) ?? ""
        ).toLowerCase();

        const code = getCourseCode(item).toLowerCase();

        const instructor = String(
            getLocalizedValue(
                item.instructor?.name ??
                item.instructor
            ) ?? ""
        ).toLowerCase();

        const category = getCourseCategory(item);

        const translatedCategory = t(
            `categories.${category}`
        ).toLowerCase();

        const price = Number(item.price ?? 0);

        const rating = Number(item.rating ?? 0);

        const level = getCourseLevel(item);


        // Хайлтын нөхцөл

        const matchesKeyword =

            !keyword ||

            name.includes(keyword) ||

            code.includes(keyword) ||

            instructor.includes(keyword) ||

            category.includes(keyword) ||

            translatedCategory.includes(keyword);


        // Үнийн шүүлтүүр

        const matchesMinPrice =

            minPrice === "" ||

            price >= Number(minPrice);


        const matchesMaxPrice =

            maxPrice === "" ||

            price <= Number(maxPrice);


        // Үнэлгээний шүүлтүүр

        const matchesRating =

            rating >= minRating;


        // Түвшний шүүлтүүр

        const matchesLevel =

            levels.length === 0 ||

            levels.includes(level);


        // Ангиллын шүүлтүүр

        const matchesCategory =

            !activeCategory ||

            category === activeCategory.toLowerCase();


        return (

            matchesKeyword &&

            matchesMinPrice &&

            matchesMaxPrice &&

            matchesRating &&

            matchesLevel &&

            matchesCategory

        );

    });


    // ========================================
    // SORTING
    // ========================================

    const sortFunctions = {

        priceAsc: (a, b) =>

            Number(a.price ?? 0) -
            Number(b.price ?? 0),


        priceDesc: (a, b) =>

            Number(b.price ?? 0) -
            Number(a.price ?? 0),


        ratingDesc: (a, b) =>

            Number(b.rating ?? 0) -
            Number(a.rating ?? 0),


        studentsDesc: (a, b) =>

            Number(b.students ?? b.studentCount ?? 0) -
            Number(a.students ?? a.studentCount ?? 0)

    };


    const compare = sortFunctions[sortBy];


    if (typeof compare === "function") {

        results = typeof results.toSorted === "function"

            ? results.toSorted(compare)

            : [...results].sort(compare);

    }


    return results;

}


// ========================================
// RENDER RESULTS
// ========================================

function renderResults(courses) {

    const toolbar = document.getElementById(
        "courseToolbar"
    );

    const resultTbl = document.getElementById(
        "resultTbl"
    );

    if (!resultTbl) return;


    // Toolbar шинэчлэх

    if (toolbar) {

        toolbar.innerHTML = renderCourseToolbar(

            courses.length,

            currentView

        );

    }


    // Grid харагдац

    if (currentView === "grid") {

        resultTbl.innerHTML = renderCourseGrid(
            courses
        );

    } else {

        // Table харагдац

        const selectedTypes = getSelectedTypes();

        resultTbl.innerHTML = selectedTypes.length

            ? renderCourseTables(
                courses,
                selectedTypes
            )

            : `
                <div class="notification is-light">

                    ${getLanguage() === "mn"
                        ? "Харуулах мэдээллийн төрлөө сонгоно уу."
                        : "Select information to display."}

                </div>
            `;

    }


    // Checkbox тохиргоо

    document.querySelectorAll(
        'input[name="courseInfo"]'
    ).forEach(input => {

        input.disabled = currentView === "grid";

    });


    // Сагсны товчнуудыг шинэчлэх

    updateCartButtons();

}


// ========================================
// DEFAULT RESULTS
// ========================================

export function renderDefaultTables(
    items = courseData
) {

    return currentView === "grid"

        ? renderCourseGrid(items)

        : renderCourseTables(
            items,
            DEFAULT_TYPES
        );

}


// ========================================
// UPDATE RESULTS
// ========================================

export function renderCurrentResults() {

    const filteredCourses = filterCourses();

    renderResults(filteredCourses);

}


// ========================================
// CHANGE VIEW
// ========================================

export function setCourseView(view) {

    if (!["grid", "table"].includes(view)) {

        return;

    }

    currentView = view;


    localStorage.setItem(

        VIEW_STORAGE_KEY,

        currentView

    );


    renderCurrentResults();

}


// ========================================
// RESET FILTERS
// ========================================

function resetFilters() {

    activeCategory = "";


    [
        "searchTxt",
        "minPrice",
        "maxPrice"
    ].forEach(id => {

        const input = document.getElementById(id);

        if (input) {

            input.value = "";

        }

    });


    document.querySelectorAll(
        'input[name="level"]'
    ).forEach(input => {

        input.checked = false;

    });


    document.querySelectorAll(
        'input[name="courseInfo"]'
    ).forEach(input => {

        input.checked = DEFAULT_TYPES.includes(
            input.value
        );

    });


    const rating = document.getElementById(
        "minRating"
    );

    const sort = document.getElementById(
        "sortBy"
    );


    if (rating) {

        rating.value = "0";

    }


    if (sort) {

        sort.value = "default";

    }


    document.querySelectorAll(
        "[data-category], [data-course-category]"
    ).forEach(element => {

        element.classList.remove("is-active");

    });


    renderCurrentResults();

}


// ========================================
// BIND SEARCH EVENTS
// ========================================

export function bindSearchEvents() {

    const searchTxt = document.getElementById(
        "searchTxt"
    );

    const searchForm = searchTxt?.closest("form");


    // Шууд хайлт

    searchTxt?.addEventListener(

        "input",

        renderCurrentResults

    );


    // Enter дарахад

    searchForm?.addEventListener(

        "submit",

        event => {

            event.preventDefault();

            renderCurrentResults();

        }

    );


    // Хайх товч

    document.querySelectorAll(
        "#searchBtn, #searchButton"
    ).forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            renderCurrentResults();

        });

    });


    // Шүүлтүүрийн ажиллагаа

    document.querySelectorAll(`

        input[name="courseInfo"],

        input[name="level"],

        #minPrice,

        #maxPrice,

        #minRating,

        #sortBy

    `).forEach(element => {

        element.addEventListener(

            "change",

            renderCurrentResults

        );

    });


    // Шүүлтүүр цэвэрлэх

    document.getElementById("resetFilters")

        ?.addEventListener(

            "click",

            resetFilters

        );


    // ========================================
    // CATEGORY EVENTS
    // ========================================

    document.querySelectorAll(
        "[data-category], [data-course-category]"
    ).forEach(element => {

        element.addEventListener("click", () => {

            const category =

                element.dataset.category ??

                element.dataset.courseCategory ??

                "";


            activeCategory =

                category.toLowerCase() === "all"

                    ? ""

                    : category;


            document.querySelectorAll(
                "[data-category], [data-course-category]"
            ).forEach(item => {

                item.classList.remove("is-active");

            });


            element.classList.add("is-active");


            renderCurrentResults();

        });

    });


    // ========================================
    // COURSE CODE EVENTS
    // ========================================

    document.querySelectorAll(
        "[data-course-code], [data-coursecode]"
    ).forEach(element => {

        if (element.closest("#resultTbl")) return;


        element.addEventListener("click", event => {

            event.preventDefault();


            const code =

                element.dataset.courseCode ??

                element.dataset.coursecode;


            const input = document.getElementById(
                "searchTxt"
            );


            if (input && code) {

                input.value = code;

                renderCurrentResults();

            }

        });

    });


    // ========================================
    // GRID / TABLE EVENTS
    // ========================================

    bindCourseViewEvents(setCourseView);


    // Анхны үр дүн

    renderCurrentResults();

}
