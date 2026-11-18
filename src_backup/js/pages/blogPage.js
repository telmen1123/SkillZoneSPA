
import {
    getBlogs
} from "../services/blogService.js";

import {
    renderBlogCard
} from "../components/blogCard.js";

import {
    renderNotification
} from "../layouts/notificationLayout.js";

import {
    t,
    getLanguage,
    getLocalizedValue
} from "../i18n/i18n.js";

function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}

const categories = [
    "all",
    "programming",
    "ai",
    "design",
    "personal",
    "language"
];

export function renderBlogPage() {

    return `

        <div class="blog-page">

            <section class="blog-hero">

                <div class="app-container">

                    <span class="blog-hero-label">

                        SKILLZONE BLOG

                    </span>

                    <h1>

                        ${lang(
                            "МЭДЭЭ, МЭДЭЭЛЭЛ",
                            "News and articles"
                        )}

                    </h1>

                    <p>

                        ${lang(
                            "Шинэ мэдлэг, технологийн мэдээлэл, хэрэгтэй зөвлөгөө.",
                            "Discover technology, knowledge and useful learning tips."
                        )}

                    </p>

                    <div class="blog-search">

                        <i class="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="search"
                            id="blogSearch"
                            aria-label="${lang(
                                "Нийтлэл хайх",
                                "Search articles"
                            )}"
                            placeholder="${lang(
                                "Нийтлэл хайх...",
                                "Search articles..."
                            )}"
                        >

                    </div>

                </div>

            </section>

            <section class="app-container blog-content">

                <div class="blog-filters">

                    ${categories.map(category => `

                        <button
                            type="button"
                            class="blog-filter-button
                            ${category === "all" ? "is-active" : ""}"
                            data-blog-category="${category}"
                            aria-pressed="${category === "all"}"
                        >

                            ${t(`categories.${category}`)}

                        </button>

                    `).join("")}

                </div>

                <div id="blogCount"></div>

                <div id="blogResults">

                    ${renderNotification(
                        t("common.loading"),
                        "loading"
                    )}

                </div>

            </section>

        </div>

    `;

}

export async function bindBlogPage() {

    const results =
        document.getElementById("blogResults");

    const search =
        document.getElementById("blogSearch");

    const count =
        document.getElementById("blogCount");

    if (!results) return;

    let activeCategory = "all";

    try {

        const blogs = await getBlogs();

        if (!results.isConnected) return;

        function renderResults() {

            const keyword = (
                search?.value ?? ""
            ).trim().toLowerCase();

            const filtered = blogs.filter(blog => {

                const title = String(
                    getLocalizedValue(blog.title) ?? ""
                ).toLowerCase();

                const description = String(
                    getLocalizedValue(blog.description) ?? ""
                ).toLowerCase();

                const matchesSearch =
                    title.includes(keyword) ||
                    description.includes(keyword);

                const matchesCategory =
                    activeCategory === "all" ||
                    blog.category === activeCategory;

                return matchesSearch && matchesCategory;

            }).sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            if (count) {

                count.textContent =
                    `${lang("Нийт", "Total")} ` +
                    `${filtered.length} ` +
                    `${lang("нийтлэл", "articles")}`;

            }

            if (!filtered.length) {

                results.innerHTML = renderNotification(
                    lang(
                        "Нийтлэл олдсонгүй.",
                        "No articles found."
                    ),
                    "warning"
                );

                return;

            }

            results.innerHTML = `

                <div class="blog-grid">

                    ${filtered.map(renderBlogCard).join("")}

                </div>

            `;

        }

        search?.addEventListener(
            "input",
            renderResults
        );

        const buttons = document.querySelectorAll(
            "[data-blog-category]"
        );

        buttons.forEach(button => {

            button.addEventListener("click", () => {

                activeCategory =
                    button.dataset.blogCategory;

                buttons.forEach(item => {

                    const active = item === button;

                    item.classList.toggle(
                        "is-active",
                        active
                    );

                    item.setAttribute(
                        "aria-pressed",
                        String(active)
                    );

                });

                renderResults();

            });

        });

        renderResults();

    } catch (error) {

        if (!results.isConnected) return;

        console.error("Blog page error:", error);

        results.innerHTML = renderNotification(
            t("common.error"),
            "danger"
        );

    }

}
