
import {
    getBlogById
} from "../services/blogService.js";

import {
    renderNotification
} from "../layouts/notificationLayout.js";

import {
    getLanguage,
    getLocalizedValue,
    t
} from "../i18n/i18n.js";

import {
    escapeHtml
} from "../fn/format.js";

function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}

export function renderArticlePage() {

    return `

        <section class="article-page">

            <div class="app-container">

                <div id="articleContent">

                    ${renderNotification(
                        t("common.loading"),
                        "loading"
                    )}

                </div>

            </div>

        </section>

    `;

}

export async function bindArticlePage(params) {

    const container =
        document.getElementById("articleContent");

    if (!container) return;

    const query = params instanceof URLSearchParams

        ? params

        : new URLSearchParams(
            window.location.hash.split("?")[1] ?? ""
        );

    const id = query.get("id");

    try {

        const blog = await getBlogById(id);

        if (!container.isConnected) return;

        if (!blog) {

            container.innerHTML = renderNotification(
                lang(
                    "Нийтлэл олдсонгүй.",
                    "Article not found."
                ),
                "warning"
            );

            return;

        }

        container.innerHTML = `

            <article class="article-card">

                <a href="#/blog"
                   class="article-back">

                    <i class="fa-solid fa-arrow-left"></i>

                    ${lang(
                        "Нийтлэлүүд рүү буцах",
                        "Back to articles"
                    )}

                </a>

                <div class="article-cover blog-${escapeHtml(blog.color)}">

                    <i class="fa-solid ${escapeHtml(blog.icon)}"></i>

                    <span>SKILLZONE BLOG</span>

                </div>

                <span class="blog-card-category">

                    ${escapeHtml(
                        t(`categories.${blog.category}`)
                    )}

                </span>

                <h1>

                    ${escapeHtml(
                        getLocalizedValue(blog.title)
                    )}

                </h1>

                <div class="blog-card-meta">

                    <span>

                        <i class="fa-regular fa-user"></i>

                        ${escapeHtml(blog.author)}

                    </span>

                    <span>

                        <i class="fa-regular fa-calendar"></i>

                        ${escapeHtml(blog.date)}

                    </span>

                </div>

                <div class="article-text">

                    ${escapeHtml(
                        getLocalizedValue(blog.content)
                    )}

                </div>

                <a href="#/courses"
                   class="home-primary-button">

                    ${lang(
                        "Сургалтууд үзэх",
                        "Explore courses"
                    )}

                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            </article>

        `;

    } catch (error) {

        if (!container.isConnected) return;

        console.error("Article error:", error);

        container.innerHTML = renderNotification(
            t("common.error"),
            "danger"
        );

    }

}
