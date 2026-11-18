
import {

    getInstructors

} from "../services/instructorService.js";

import {

    renderInstructorCard

} from "../components/instructorCard.js";

import {

    renderNotification

} from "../layouts/notificationLayout.js";

import {

    t,
    getLanguage,
    formatNumber

} from "../i18n/i18n.js";


function lang(mn, en) {

    return getLanguage() === "mn"
        ? mn
        : en;

}


// Багш нарын хуудас

export function renderInstructorsPage() {

    return `

        <div class="instructors-page">

            <section class="instructors-hero">

                <div class="app-container">

                    <span class="instructors-label">

                        SKILLZONE INSTRUCTORS

                    </span>

                    <h1>

                        ${lang(
                            "МАНАЙ СУРГАЛТЫН БАГШ НАР",
                            "Meet our instructors"
                        )}

                    </h1>

                    <p>

                        ${lang(
                            "Өөрийн сонирхсон чиглэлийн багштай танилцаарай.",
                            "Discover instructors in your favorite subjects."
                        )}

                    </p>

                </div>

            </section>


            <section class="app-container
                            instructors-content">

                <div class="instructors-toolbar">

                    <div id="instructorCount">

                        ${lang("Нийт", "Total")} 0

                    </div>


                    <div class="instructor-filters">

                        <div class="instructor-search">

                            <i class="fa-solid
                                      fa-magnifying-glass"></i>

                            <input

                                type="search"

                                id="instructorSearch"

                                aria-label="${lang(
                                    "Багш хайх",
                                    "Search instructors"
                                )}"

                                placeholder="${lang(
                                    "Багш хайх...",
                                    "Search instructors..."
                                )}"

                            >

                        </div>


                        <select
                            id="instructorSort"
                            class="instructor-sort"
                            aria-label="${lang(
                                "Эрэмбэлэх",
                                "Sort"
                            )}">

                            <option value="default">

                                ${lang(
                                    "Эрэмбэлэх",
                                    "Sort by"
                                )}

                            </option>

                            <option value="rating">

                                ${lang(
                                    "Өндөр үнэлгээ",
                                    "Highest rating"
                                )}

                            </option>

                            <option value="students">

                                ${lang(
                                    "Олон суралцагч",
                                    "Most enrollments"
                                )}

                            </option>

                            <option value="courses">

                                ${lang(
                                    "Олон сургалт",
                                    "Most courses"
                                )}

                            </option>

                        </select>

                    </div>

                </div>


                <div id="instructorResults">

                    ${renderNotification(
                        t("common.loading"),
                        "loading"
                    )}

                </div>

            </section>

        </div>

    `;

}


// Багшийн хуудасны event

export async function bindInstructorsPage() {

    const results = document.getElementById(
        "instructorResults"
    );

    const search = document.getElementById(
        "instructorSearch"
    );

    const sort = document.getElementById(
        "instructorSort"
    );

    const count = document.getElementById(
        "instructorCount"
    );

    if (!results) return;


    try {

        const instructors =
            await getInstructors();

        if (!results.isConnected) return;


        function renderResults() {

            const keyword = (
                search?.value ?? ""
            ).trim().toLowerCase();

            const sortBy =
                sort?.value ?? "default";


            // Хайлтын шүүлтүүр

            let filtered =
                instructors.filter(instructor => {

                    const name =
                        instructor.name.toLowerCase();

                    const categories =
                        instructor.categories.map(category =>

                            `${category} ${t(
                                `categories.${category}`
                            )}`

                        ).join(" ").toLowerCase();

                    return (

                        name.includes(keyword) ||

                        categories.includes(keyword)

                    );

                });


            // Эрэмбэлэх

            if (sortBy === "rating") {

                filtered.sort(
                    (a, b) => b.rating - a.rating
                );

            }

            if (sortBy === "students") {

                filtered.sort(
                    (a, b) => b.students - a.students
                );

            }

            if (sortBy === "courses") {

                filtered.sort(
                    (a, b) =>
                        b.courseCount - a.courseCount
                );

            }


            // Нийт багшийн тоо

            if (count) {

                count.textContent =
                    `${lang("Нийт", "Total")} ` +

                    `${formatNumber(filtered.length)} ` +

                    `${lang("багш", "instructors")}`;

            }


            // Үр дүн байхгүй бол

            if (!filtered.length) {

                results.innerHTML =
                    renderNotification(

                        lang(
                            "Багш олдсонгүй.",
                            "No instructors found."
                        ),

                        "warning"

                    );

                return;

            }


            // Багш нарын карт

            results.innerHTML = `

                <div class="instructor-grid">

                    ${filtered.map(
                        (instructor, index) =>

                            renderInstructorCard(
                                instructor,
                                index
                            )

                    ).join("")}

                </div>

            `;

        }


        // Хайлт

        search?.addEventListener(
            "input",
            renderResults
        );


        // Эрэмбэлэлт

        sort?.addEventListener(
            "change",
            renderResults
        );


        renderResults();

        console.info(
            `SkillZone: ${instructors.length} багш ачааллаа.`
        );


    } catch (error) {

        if (!results.isConnected) return;

        console.error(
            "Instructor page error:",
            error
        );

        results.innerHTML =
            renderNotification(
                t("common.error"),
                "danger"
            );

    }

}
