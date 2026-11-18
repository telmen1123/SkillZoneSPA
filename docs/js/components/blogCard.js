
import {
    t,
    getLanguage,
    getLocalizedValue
} from "../i18n/i18n.js";

import {
    escapeHtml
} from "../fn/format.js";

function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}

export function renderBlogCard(blog) {

    const title = getLocalizedValue(blog.title);

    const description =
        getLocalizedValue(blog.description);

    const category =
        t(`categories.${blog.category}`);

    const url =
        `#/article?id=${encodeURIComponent(blog.id)}`;

    return `

        <article class="blog-card">

            <a href="${url}"
               class="blog-card-cover blog-${escapeHtml(blog.color)}">

                <i class="fa-solid ${escapeHtml(blog.icon)}"></i>

                <span class="blog-cover-brand">
                    SKILLZONE
                </span>

            </a>

            <div class="blog-card-body">

                <span class="blog-card-category">

                    ${escapeHtml(category)}

                </span>

                <h3>

                    <a href="${url}">

                        ${escapeHtml(title)}

                    </a>

                </h3>

                <p class="blog-card-description">

                    ${escapeHtml(description)}

                </p>

                <div class="blog-card-meta">

                    <span>

                        <i class="fa-regular fa-calendar"></i>

                        ${escapeHtml(blog.date)}

                    </span>

                    <span>

                        <i class="fa-regular fa-clock"></i>

                        ${blog.readTime}

                        ${lang("мин", "min")}

                    </span>

                </div>

                <div class="blog-card-footer">

                    <span>

                        <i class="fa-regular fa-user"></i>

                        ${escapeHtml(blog.author)}

                    </span>

                    <a href="${url}">

                        ${lang("Унших", "Read more")}

                        <i class="fa-solid fa-arrow-right"></i>

                    </a>

                </div>

            </div>

        </article>

    `;

}
