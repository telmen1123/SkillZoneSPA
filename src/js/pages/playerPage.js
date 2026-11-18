
import {
    getCurrentUser
} from "../services/authService.js";

import {
    getCourses
} from "../services/courseService.js";

import {
    getLearningData,
    getProgress,
    completeLesson
} from "../services/learningService.js";

import {
    getCourseLessons,
    groupLessons
} from "../services/lessonService.js";

import {
    getLanguage,
    getLocalizedValue
} from "../i18n/i18n.js";

import {
    escapeHtml
} from "../fn/format.js";


// LANGUAGE

function lang(mn, en) {

    return getLanguage() === "mn" ? mn : en;

}


// COURSE ID

function getCourseId(course) {

    return String(
        course.code ??
        course.courseCode ??
        course.course_code ??
        course.id ??
        ""
    );

}


// URL PARAMETERS

function getURLParams() {

    const hash = window.location.hash;

    const query = hash.split("?")[1] ?? "";

    return new URLSearchParams(query);

}


// PAGE HEADER

export function renderPlayerPage() {

    return `

        <section class="player-page">

            <div class="app-container">

                <a href="#/my-learning"
                   class="player-back">

                    <i class="fa-solid fa-arrow-left"></i>

                    ${lang(
                        "Миний сургалтууд",
                        "My learning"
                    )}

                </a>

                <div id="playerContent">

                    <div class="has-text-centered py-6">

                        <i class="fa-solid fa-spinner fa-spin"></i>

                        ${lang(
                            "Уншиж байна...",
                            "Loading..."
                        )}

                    </div>

                </div>

            </div>

        </section>

    `;

}


// EMPTY / ACCESS DENIED

function renderAccessDenied() {

    return `

        <div class="player-empty">

            <i class="fa-solid fa-lock"></i>

            <h2>

                ${lang(
                    "Сургалт үзэх эрх байхгүй байна.",
                    "You do not have access to this course."
                )}

            </h2>

            <p>

                ${lang(
                    "Та эхлээд сургалтаа захиална уу.",
                    "Please enroll in the course first."
                )}

            </p>

            <a href="#/courses"
               class="player-primary-button">

                ${lang(
                    "Сургалтууд үзэх",
                    "Browse courses"
                )}

            </a>

        </div>

    `;

}


// LESSON ITEM

function renderLessonItem(
    lesson,
    selectedId,
    completedLessons
) {

    const active = lesson.id === selectedId;

    const completed =
        lesson.id <= completedLessons;

    const title = getLocalizedValue(
        lesson.title
    );

    const icon = completed

        ? "fa-circle-check"

        : active

            ? "fa-circle-play"

            : "fa-circle";


    return `

        <button

            type="button"

            class="player-lesson
                   ${active ? "is-active" : ""}
                   ${completed ? "is-completed" : ""}"

            data-lesson-id="${lesson.id}"

            aria-current="${active ? "true" : "false"}"

        >

            <span class="player-lesson-icon">

                <i class="fa-solid ${icon}"></i>

            </span>

            <span class="player-lesson-info">

                <strong>

                    ${lesson.id}.

                    ${escapeHtml(title)}

                </strong>

                <small>

                    ${lesson.duration > 0

                        ? `${lesson.duration} ${lang("мин", "min")}`

                        : lang("Туршилтын хичээл", "Demo lesson")

                    }

                </small>

            </span>

        </button>

    `;

}


// SIDEBAR

function renderLessonSidebar(
    lessons,
    selectedId,
    record
) {

    const modules = groupLessons(lessons);

    return `

        <aside class="player-sidebar">

            <div class="player-sidebar-header">

                <h2>

                    ${lang(
                        "Сургалтын агуулга",
                        "Course content"
                    )}

                </h2>

                <span>

                    ${record.completedLessons} /
                    ${record.totalLessons}

                    ${lang("хичээл", "lessons")}

                </span>

            </div>

            <div class="player-modules">

                ${modules.map(module => `

                    <details

                        class="player-module"

                        ${module.lessons.some(
                            item => item.id === selectedId
                        ) ? "open" : ""}

                    >

                        <summary>

                            <strong>

                                ${module.title}

                            </strong>

                            <span>

                                ${module.lessons.length}

                                ${lang("хичээл", "lessons")}

                            </span>

                        </summary>


                        <div class="player-module-lessons">

                            ${module.lessons.map(lesson =>

                                renderLessonItem(

                                    lesson,

                                    selectedId,

                                    record.completedLessons

                                )

                            ).join("")}

                        </div>

                    </details>

                `).join("")}

            </div>

        </aside>

    `;

}


// PROGRESS

function renderPlayerProgress(record) {

    const progress = getProgress(record);

    return `

        <div class="player-progress">

            <div class="player-progress-label">

                <span>

                    ${lang(
                        "Таны сургалтын явц",
                        "Your course progress"
                    )}

                </span>

                <strong>${progress}%</strong>

            </div>

            <div
                class="player-progress-track"
                role="progressbar"
                aria-label="${lang("Сургалтын явц", "Progress")}"
                aria-valuenow="${progress}"
                aria-valuemin="0"
                aria-valuemax="100">

                <div style="width:${progress}%"></div>

            </div>

        </div>

    `;

}


// VIDEO

function renderVideo(lesson) {

    if (!lesson.video) {

        return `

            <div class="player-video-empty">

                <i class="fa-solid fa-circle-play"></i>

                <p>

                    ${lang(
                        "Видео хараахан нэмэгдээгүй байна.",
                        "Video is not available yet."
                    )}

                </p>

            </div>

        `;

    }

    return `

        <video

            id="lessonVideo"

            class="player-video"

            controls

            playsinline

            preload="metadata"

            src="${escapeHtml(lesson.video)}"

        >

            ${lang(
                "Таны браузер видео дэмжихгүй байна.",
                "Your browser does not support video."
            )}

        </video>

        <div id="playerVideoError"
             class="player-video-error"
             hidden>

            ${lang(
                "Видео файл олдсонгүй. videos хавтсаа шалгана уу.",
                "Video not found. Check your videos folder."
            )}

        </div>

    `;

}


// PLAYER CONTENT

function renderPlayerContent(
    course,
    lesson,
    lessons,
    record
) {

    const title = getLocalizedValue(
        course.title ?? course.name
    );

    const lessonTitle = getLocalizedValue(
        lesson.title
    );

    const completed =
        lesson.id <= record.completedLessons;

    const canComplete =
        lesson.id === record.completedLessons + 1;


    return `

        <div class="player-heading">

            <div>

                <span>SKILLZONE LEARNING</span>

                <h1>

                    ${escapeHtml(title)}

                </h1>

            </div>

            ${renderPlayerProgress(record)}

        </div>


        <div class="player-layout">


            <!-- MAIN VIDEO -->

            <main class="player-main">

                <div class="player-video-wrapper">

                    ${renderVideo(lesson)}

                </div>


                <!-- LESSON INFORMATION -->

                <section class="player-card">

                    <span class="player-lesson-number">

                        ${lang("Хичээл", "Lesson")}

                        ${lesson.id} / ${lessons.length}

                    </span>

                    <h2>

                        ${escapeHtml(lessonTitle)}

                    </h2>

                    <p>

                        ${lang(
                            "Видео хичээлээ үзээд дараагийн хичээлдээ шилжээрэй.",
                            "Watch the lesson and continue to the next one."
                        )}

                    </p>

                    <div class="player-controls">

                        <button

                            type="button"

                            id="previousLesson"

                            class="player-secondary-button"

                            ${lesson.id === 1 ? "disabled" : ""}

                        >

                            <i class="fa-solid fa-chevron-left"></i>

                            ${lang("Өмнөх", "Previous")}

                        </button>


                        <button

                            type="button"

                            id="nextLesson"

                            class="player-secondary-button"

                            ${lesson.id === lessons.length
                                ? "disabled"
                                : ""
                            }

                        >

                            ${lang("Дараах", "Next")}

                            <i class="fa-solid fa-chevron-right"></i>

                        </button>

                    </div>


                    <!-- COMPLETE LESSON -->

                    <button

                        type="button"

                        id="completeLessonBtn"

                        class="player-primary-button
                               player-complete-button"

                        ${completed || !canComplete
                            ? "disabled"
                            : ""
                        }

                    >

                        <i class="fa-solid fa-circle-check"></i>

                        ${completed

                            ? lang(
                                "Хичээл дууссан",
                                "Lesson completed"
                            )

                            : lang(
                                "Хичээл дуусгах",
                                "Mark as complete"
                            )

                        }

                    </button>

                    ${!completed && !canComplete

                        ? `<p class="player-hint">

                            ${lang(
                                "Өмнөх хичээлээ эхлээд дуусгана уу.",
                                "Complete the previous lesson first."
                            )}

                           </p>`

                        : ""

                    }

                </section>


                <!-- DESCRIPTION -->

                <section class="player-card">

                    <h3>

                        ${lang(
                            "Сургалтын тухай",
                            "About this course"
                        )}

                    </h3>

                    <p>

                        ${escapeHtml(
                            getLocalizedValue(
                                course.description ?? ""
                            )
                        )}

                    </p>

                </section>

            </main>


            <!-- SIDEBAR -->

            ${renderLessonSidebar(
                lessons,
                lesson.id,
                record
            )}

        </div>

    `;

}


// BIND PLAYER

export async function bindPlayerPage() {

    const user = getCurrentUser();

    if (!user) {

        window.location.hash = "/login";

        return;

    }

    const container = document.getElementById(
        "playerContent"
    );

    if (!container) return;

    const params = getURLParams();

    const courseId = params.get("id");


    function getRecord() {

        if (getCurrentUser()?.id !== user.id) {
            return null;
        }

        return getLearningData().find(
            item => item.courseId === courseId
        );

    }


    const record = getRecord();

    if (!record) {

        container.innerHTML =
            renderAccessDenied();

        return;

    }


    try {

        const [courses, lessons] = await Promise.all([

            getCourses(),

            getCourseLessons(
                courseId,
                record.totalLessons
            )

        ]);

        if (!container.isConnected) return;

        const course = courses.find(
            item => getCourseId(item) === courseId
        );

        if (!course || !lessons.length || !getRecord()) {

            container.innerHTML =
                renderAccessDenied();

            return;

        }


        // Сүүлд үзэж байсан хичээл

        let selectedId = Math.min(

            record.completedLessons + 1,

            lessons.length

        );


        let watchedSeconds = 0;

        let lastVideoTime = 0;


        // Render

        function renderPlayer() {

            if (!container.isConnected) return;

            const currentRecord = getRecord();

            if (!currentRecord) {

                container.innerHTML =
                    renderAccessDenied();

                return;

            }

            const lesson = lessons.find(
                item => item.id === selectedId
            );

            if (!lesson) return;

            watchedSeconds = 0;

            lastVideoTime = 0;

            container.innerHTML = renderPlayerContent(

                course,

                lesson,

                lessons,

                currentRecord

            );


            const video = container.querySelector(
                "#lessonVideo"
            );

            const videoError = container.querySelector(
                "#playerVideoError"
            );


            // Үзсэн хугацааг ойролцоогоор тооцох

            video?.addEventListener("timeupdate", () => {

                const difference =
                    video.currentTime - lastVideoTime;

                if (
                    !video.seeking &&
                    difference > 0 &&
                    difference <= 2
                ) {

                    watchedSeconds += difference;

                }

                lastVideoTime = video.currentTime;

            });


            video?.addEventListener("seeked", () => {

                lastVideoTime = video.currentTime;

            });


            // Video error

            function showVideoError() {

                if (videoError) {
                    videoError.hidden = false;
                }

            }

            video?.addEventListener(
                "error",
                showVideoError
            );

            if (video?.error) {
                showVideoError();
            }

        }


        // Event delegation

        container.onclick = event => {

            const record = getRecord();

            if (!record) {

                window.location.hash = "/login";

                return;

            }


            // Хичээл сонгох

            const lessonButton = event.target.closest(
                "[data-lesson-id]"
            );

            if (lessonButton) {

                selectedId = Number(
                    lessonButton.dataset.lessonId
                );

                renderPlayer();

                return;

            }


            // Previous lesson

            if (
                event.target.closest("#previousLesson") &&
                selectedId > 1
            ) {

                selectedId--;

                renderPlayer();

                return;

            }


            // Next lesson

            if (
                event.target.closest("#nextLesson") &&
                selectedId < lessons.length
            ) {

                selectedId++;

                renderPlayer();

                return;

            }


            // Complete lesson

            if (event.target.closest("#completeLessonBtn")) {

                const minutes = Math.floor(
                    watchedSeconds / 60
                );

                const success = completeLesson(

                    courseId,

                    selectedId,

                    minutes

                );

                if (!success) return;

                const updatedRecord = getRecord();

                if (
                    updatedRecord &&
                    updatedRecord.completedLessons >=
                    updatedRecord.totalLessons
                ) {

                    window.alert(

                        lang(
                            "Баяр хүргэе! Та сургалтаа бүрэн дуусгалаа.",
                            "Congratulations! You completed this course."
                        )

                    );

                } else if (selectedId < lessons.length) {

                    selectedId++;

                }

                renderPlayer();

            }

        };


        // Initial render

        renderPlayer();


    } catch (error) {

        console.error(
            "Player page error:",
            error
        );

        if (!container.isConnected) return;

        container.textContent = lang(

            "Хичээлийн мэдээлэл ачаалагдсангүй.",

            "Unable to load lessons."

        );

    }

}
