
import {
    getProgress
} from "../services/learningService.js";

import {
    getCourseCover
} from "../services/imageService.js";

import {
    getLanguage,
    getLocalizedValue
} from "../i18n/i18n.js";

import {
    escapeHtml
} from "../fn/format.js";


function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}


export function renderLearningCard(record, course) {

    const id = record.courseId;

    const title = course
        ? getLocalizedValue(course.title ?? course.name)
        : id;

    const instructor = course
        ? getLocalizedValue(course.instructor)
        : "";

    const image = getCourseCover(id);

    const progress = getProgress(record);

    const completed =
        record.completedLessons >= record.totalLessons;

    const status = completed
        ? "completed"
        : record.completedLessons > 0
            ? "active"
            : "new";

    const statusText = completed
        ? lang("Дуусгасан", "Completed")
        : status === "active"
            ? lang("Суралцаж буй", "In progress")
            : lang("Эхлээгүй", "Not started");

    const buttonText = completed
        ? lang("Дахин үзэх", "Review course")
        : status === "new"
            ? lang("Суралцаж эхлэх", "Start learning")
            : lang("Үргэлжлүүлэн сурах", "Continue learning");


    return `
        <article class="learning-card">

            <div class="learning-card-image">

                ${image
                    ? `<img
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(title)}"
                        loading="lazy">`

                    : `<i class="fa-solid fa-book-open"></i>`
                }

                <span class="learning-status ${status}">

                    ${statusText}

                </span>

            </div>

            <div class="learning-card-body">

                <h3>
                    ${escapeHtml(title)}
                </h3>

                <p class="learning-instructor">

                    <i class="fa-regular fa-user"></i>

                    ${escapeHtml(instructor)}

                </p>

                <div class="learning-card-meta">

                    <span>

                        <i class="fa-solid fa-circle-play"></i>

                        ${record.completedLessons} /
                        ${record.totalLessons}

                        ${lang("хичээл", "lessons")}

                    </span>

                    <span>

                        <i class="fa-regular fa-clock"></i>

                        ${Math.round(record.studyMinutes / 60 * 10) / 10}

                        ${lang("цаг", "h")}

                    </span>

                </div>

                <div class="learning-progress-label">

                    <span>
                        ${lang("Сургалтын явц", "Progress")}
                    </span>

                    <strong>
                        ${progress}%
                    </strong>

                </div>

                <div
                    class="learning-progress-track ${status}"
                    role="progressbar"
                    aria-label="${lang("Сургалтын явц", "Progress")}"
                    aria-valuenow="${progress}"
                    aria-valuemin="0"
                    aria-valuemax="100">

                    <div style="width:${progress}%"></div>

                </div>

                <button
                    type="button"
                    class="learning-start-button"
                    data-learning-id="${escapeHtml(id)}">

                    <i class="fa-solid fa-circle-play"></i>

                    ${buttonText}

                </button>

            </div>

        </article>
    `;

}
