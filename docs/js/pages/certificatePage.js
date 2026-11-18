import {
    getCurrentUser
} from "../services/authService.js";

import {
    syncCertificates
} from "../services/certificateService.js";

import {
    getCourses
} from "../services/courseService.js";

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


function getCourseId(course) {

    return String(
        course.code ??
        course.courseCode ??
        course.course_code ??
        course.id ??
        ""
    );

}


// Сертификатын дизайн

function renderCertificate(certificate, course) {

    const title = course

        ? getLocalizedValue(
            course.title ?? course.name
        )

        : certificate.courseId;

    const date = new Date(
        certificate.completedAt
    ).toLocaleDateString(
        getLanguage() === "mn" ? "mn-MN" : "en-US"
    );


    return `

        <div class="certificate-document">

            <div class="certificate-frame">

                <div class="certificate-brand">

                    <i class="fa-solid fa-graduation-cap"></i>

                    SkillZone

                </div>

                <h2>CERTIFICATE</h2>

                <span class="certificate-subtitle">

                    OF COMPLETION

                </span>

                <p class="certificate-presented">

                    ${lang(
                        "Энэхүү гэрчилгээг",
                        "This certificate is presented to"
                    )}

                </p>

                <h3 class="certificate-student">

                    ${escapeHtml(certificate.studentName)}

                </h3>

                <p class="certificate-description">

                    ${lang(
                        "Дараах сургалтыг амжилттай дүүргэсэн тул олгов.",
                        "For successfully completing the course"
                    )}

                </p>

                <h4 class="certificate-course">

                    ${escapeHtml(title)}

                </h4>

                <div class="certificate-bottom">

                    <div class="certificate-signature">

                        <strong>${escapeHtml(date)}</strong>

                        <span>

                            ${lang("Огноо", "Date")}

                        </span>

                    </div>

                    <div class="certificate-seal">

                        <i class="fa-solid fa-award"></i>

                    </div>

                    <div class="certificate-signature">

                        <strong>SkillZone</strong>

                        <span>Academy</span>

                    </div>

                </div>

                <p class="certificate-id">

                    ${escapeHtml(certificate.id)}

                </p>

                <small class="certificate-demo">

                    ${lang(
                        "Туршилтын сертификат",
                        "Demo certificate"
                    )}

                </small>

            </div>

        </div>

    `;

}


// Сертификатын карт

function renderCertificateCard(certificate, course) {

    return `

        <article class="certificate-card">

            ${renderCertificate(certificate, course)}

            <div class="certificate-card-actions">

                <span class="certificate-completed">

                    <i class="fa-solid fa-circle-check"></i>

                    ${lang(
                        "Амжилттай дуусгасан",
                        "Successfully completed"
                    )}

                </span>

                <button
                    type="button"
                    class="certificate-print-button"
                    data-certificate-print="${escapeHtml(
                        certificate.id
                    )}">

                    <i class="fa-solid fa-file-pdf"></i>

                    ${lang(
                        "PDF / Хэвлэх",
                        "PDF / Print"
                    )}

                </button>

            </div>

        </article>

    `;

}


// Сертификат байхгүй үед

function renderEmptyCertificates() {

    return `

        <div class="certificate-empty">

            <i class="fa-solid fa-award"></i>

            <h2>

                ${lang(
                    "Танд сертификат байхгүй байна",
                    "You have no certificates yet"
                )}

            </h2>

            <p>

                ${lang(
                    "Сургалтаа 100% дуусгаад сертификатаа аваарай.",
                    "Complete a course to earn your certificate."
                )}

            </p>

            <a
                href="#/my-learning"
                class="certificate-print-button">

                ${lang(
                    "Миний сургалтууд",
                    "My learning"
                )}

            </a>

        </div>

    `;

}


// Хуудас үүсгэх

export function renderCertificatePage() {

    return `

        <section class="certificate-page">

            <div class="app-container">

                <a
                    href="#/profile"
                    class="certificate-back">

                    <i class="fa-solid fa-arrow-left"></i>

                    Dashboard

                </a>

                <div class="certificate-hero">

                    <div>

                        <span>SKILLZONE ACHIEVEMENTS</span>

                        <h1>

                            ${lang(
                                "Миний сертификатууд",
                                "My certificates"
                            )}

                        </h1>

                        <p>

                            ${lang(
                                "Таны хичээл зүтгэлийн баталгаа.",
                                "Celebrate your learning achievements."
                            )}

                        </p>

                    </div>

                    <i class="fa-solid fa-award"></i>

                </div>

                <div id="certificateContent">

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


// Хэвлэх болон PDF хадгалах

function printCertificate(card) {

    if (!card) return;

    document.querySelectorAll(
        ".certificate-print-target"
    ).forEach(item => {

        item.classList.remove(
            "certificate-print-target"
        );

    });

    card.classList.add(
        "certificate-print-target"
    );

    document.body.classList.add(
        "certificate-printing"
    );

    try {

        window.print();

    } finally {

        card.classList.remove(
            "certificate-print-target"
        );

        document.body.classList.remove(
            "certificate-printing"
        );

    }

}


// Event холбох

export async function bindCertificatePage() {

    const user = getCurrentUser();

    if (!user) {

        window.location.hash = "/login";

        return;

    }

    const content = document.getElementById(
        "certificateContent"
    );

    if (!content) return;

    try {

        const courses = await getCourses();

        if (!content.isConnected) return;

        if (getCurrentUser()?.id !== user.id) {

            window.location.hash = "/login";

            return;

        }

        const certificates = syncCertificates();

        if (!certificates.length) {

            content.innerHTML =
                renderEmptyCertificates();

            return;

        }

        const courseMap = new Map(

            courses.map(course => [
                getCourseId(course),
                course
            ])

        );

        content.innerHTML = `

            <div class="certificate-count">

                ${certificates.length}

                ${lang(
                    "сертификат",
                    "certificates"
                )}

            </div>

            <div class="certificate-grid">

                ${certificates.map(certificate =>

                    renderCertificateCard(

                        certificate,

                        courseMap.get(
                            certificate.courseId
                        )

                    )

                ).join("")}

            </div>

        `;


        content.onclick = event => {

            const button = event.target.closest(
                "[data-certificate-print]"
            );

            if (!button) return;

            if (getCurrentUser()?.id !== user.id) {

                window.location.hash = "/login";

                return;

            }

            printCertificate(
                button.closest(".certificate-card")
            );

        };

    } catch (error) {

        console.error(
            "Certificate page error:",
            error
        );

        if (!content.isConnected) return;

        content.textContent = lang(

            "Сертификатын мэдээлэл ачаалагдсангүй.",

            "Unable to load certificates."

        );

    }

}