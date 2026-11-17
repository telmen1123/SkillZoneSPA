
import { t } from "../i18n/i18n.js";

const footerGroups = [
    {
        key: "footer.platform",
        links: [
            { key: "courses.title", path: "#/courses" },
            { key: "nav.instructors", path: "#/instructors" },
            { key: "nav.myLearning", path: "#/my-learning" },
            { key: "nav.blog", path: "#/blog" }
        ]
    },
    {
        key: "footer.support",
        links: [
            { key: "footer.faq", path: "#/faq" },
            { key: "footer.terms", path: "#/terms" },
            { key: "footer.privacy", path: "#/privacy" },
            { key: "footer.contact", path: "#/contact" }
        ]
    }
];

const socialLinks = [
    {
        name: "Facebook",
        icon: "fa-facebook-f",
        url: "https://www.facebook.com/telmen.177671"
    },
    {
        name: "Instagram",
        icon: "fa-instagram",
        url: "https://www.instagram.com/telmenn_____/"
    },
    {
        name: "Gmail",
        icon: "fa-envelope",
        url: "mailto:telmenbatulzii29@gmail.com"
    },
    {
        name: "GitHub",
        icon: "fa-github",
        url: "https://github.com/telmen1123"
    }
];

export function renderFooter() {

    const year = new Date().getFullYear();

    const groupsHTML = footerGroups.map(
        ({ key, links }) => `
            <div class="footer-group">

                <h3>${t(key)}</h3>

                ${links.map(({ key, path }) => `
                    <a href="${path}">
                        ${t(key)}
                    </a>
                `).join("")}

            </div>
        `
    ).join("");

    const socialHTML = socialLinks.map(
        ({ name, icon, url }) => `
            <a href="${url}"
               class="footer-social-icon"
               ${name !== "Gmail"
                   ? 'target="_blank" rel="noopener noreferrer"'
                   : ""}
               aria-label="${name}"
               title="${name}">

                <i class="${name === "Gmail"
                    ? "fa-solid"
                    : "fa-brands"} ${icon}"></i>

            </a>
        `
    ).join("");

    return `
        <div class="skill-footer">

            <div class="app-container">

                <div class="footer-grid">

                    <!-- Brand -->
                    <div class="footer-about">

                        <a href="#/"
                           class="brand-logo footer-brand">

                            <span class="brand-icon">
                                <i class="fa-solid fa-play"></i>
                            </span>

                            <span>SkillZone</span>

                        </a>

                        <p>${t("footer.description")}</p>

                        <div class="footer-social">
                            ${socialHTML}
                        </div>

                    </div>

                    <!-- Footer menu -->
                    ${groupsHTML}

                    <!-- Contact -->
                    <div class="footer-group">

                        <h3>${t("footer.contact")}</h3>

                        <a href="mailto:telmenbatulzii29@gmail.com">
                            <i class="fa-regular fa-envelope"></i>
                            telmenbatulzii29@gmail.com
                        </a>

                        <a href="https://github.com/telmen1123"
                           target="_blank"
                           rel="noopener noreferrer">

                            <i class="fa-brands fa-github"></i>
                            telmen1123

                        </a>

                        <p>
                            <i class="fa-solid fa-location-dot"></i>
                            ${t("footer.location")}
                        </p>

                    </div>

                </div>

                <!-- Copyright -->
                <div class="footer-bottom">

                    <p>
                        © ${year} SkillZone.
                        ${t("footer.copyright")}
                    </p>

                    <p>${t("footer.madeIn")} 🇲🇳</p>

                </div>

            </div>

        </div>
    `;
}
