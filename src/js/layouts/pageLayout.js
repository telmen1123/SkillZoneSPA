
export function renderPageLayout({

    id = "",
    title = "",
    subtitle = "",
    content = "",
    actions = "",

    sectionClass = "section app-page",
    containerClass = "app-container",
    titleClass = "title is-2 app-title"

} = {}) {

    return `

        <section
            ${id ? `id="${id}"` : ""}
            class="${sectionClass}">

            <div class="${containerClass}">

                ${title || subtitle || actions ? `

                    <header class="app-page-header">

                        <div class="app-page-heading">

                            ${title ? `
                                <h1 class="${titleClass}">
                                    ${title}
                                </h1>
                            ` : ""}

                            ${subtitle ? `
                                <p class="app-page-subtitle">
                                    ${subtitle}
                                </p>
                            ` : ""}

                        </div>

                        ${actions ? `
                            <div class="app-page-actions">
                                ${actions}
                            </div>
                        ` : ""}

                    </header>

                    <div class="app-line"></div>

                ` : ""}

                <div class="app-page-content">

                    ${content}

                </div>

            </div>

        </section>

    `;

}
