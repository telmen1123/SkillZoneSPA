
import {

    t,
    getLanguage,
    formatNumber

} from "../i18n/i18n.js";

import {

    escapeHtml

} from "../fn/format.js";


function lang(mn, en) {

    return getLanguage() === "mn"
        ? mn
        : en;

}


// Avatar өнгө

const colors = [

    "blue",
    "purple",
    "green",
    "orange",
    "pink",
    "cyan"

];


// Багшийн карт

export function renderInstructorCard(
    instructor,
    index = 0
) {

    const color =
        colors[index % colors.length];

    const categories =
        instructor.categories.map(
            category => t(`categories.${category}`)
        ).join(", ");

    const url =
        `#/courses?q=${encodeURIComponent(instructor.name)}`;


    return `

        <article class="instructor-card">

            <div class="instructor-card-top">

                <div class="instructor-avatar
                            avatar-${color}">

                    <i class="fa-solid fa-user"></i>

                </div>

                <h3>

                    ${escapeHtml(instructor.name)}

                </h3>

                <p class="instructor-category">

                    ${escapeHtml(categories)}

                </p>

                <div class="instructor-rating">

                    <i class="fa-solid fa-star"></i>

                    <strong>

                        ${instructor.rating.toFixed(1)}

                    </strong>

                </div>

            </div>


            <div class="instructor-stats">

                <div class="instructor-stat">

                    <i class="fa-solid fa-book-open"></i>

                    <strong>

                        ${formatNumber(
                            instructor.courseCount
                        )}

                    </strong>

                    <span>

                        ${lang(
                            "Сургалт",
                            "Courses"
                        )}

                    </span>

                </div>


                <div class="instructor-stat">

                    <i class="fa-solid fa-users"></i>

                    <strong>

                        ${formatNumber(
                            instructor.students
                        )}

                    </strong>

                    <span>

                        ${lang(
                            "Бүртгэл",
                            "Enrollments"
                        )}

                    </span>

                </div>

            </div>


            <a href="${url}"
               class="instructor-view-button">

                ${lang(
                    "Сургалтууд үзэх",
                    "View courses"
                )}

                <i class="fa-solid fa-arrow-right"></i>

            </a>

        </article>

    `;

}
