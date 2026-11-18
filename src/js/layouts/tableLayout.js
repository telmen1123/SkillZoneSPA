import { escapeHtml, safeValue } from "../fn/format.js";

import { renderNotification } from "./notificationLayout.js";

import { t } from "../i18n/i18n.js";


// Хүснэгтийн нүдний утга боловсруулах
function renderCell(col, row) {

    // Тусгай render функц байгаа эсэхийг шалгах
    if (typeof col.render === "function") {

        return col.render(row) ?? "—";

    }

    // Энгийн өгөгдөл харуулах
    return safeValue(row[col.key]);

}


// Хүснэгт үүсгэх
export function renderTable({

    title = "",

    columns = [],

    rows = [],

    emptyMessage = t("courses.noResults")

} = {}) {

    const titleHTML = title
        ? `
            <h2 class="subtitle app-subtitle">

                ${escapeHtml(title)}

            </h2>
        `
        : "";


    // Өгөгдөл байхгүй үед
    if (!rows.length || !columns.length) {

        return `

            <div class="table-container app-tbl">

                ${titleHTML}

                ${renderNotification(
                    emptyMessage,
                    "warning"
                )}

            </div>

        `;

    }


    // Хүснэгтийн баганын нэрс
    const headerHTML = columns.map(col => `

        <th scope="col">

            ${escapeHtml(col.label)}

        </th>

    `).join("");


    // Хүснэгтийн мөрүүд
    const rowsHTML = rows.map(row => `

        <tr>

            ${columns.map(col => `

                <td>

                    ${renderCell(col, row)}

                </td>

            `).join("")}

        </tr>

    `).join("");


    // Хүснэгтийн HTML бүтэц
    return `

        <div class="table-container app-tbl">

            ${titleHTML}

            <table class="table
                          is-striped
                          is-bordered
                          is-hoverable
                          is-fullwidth">

                <thead>

                    <tr>

                        ${headerHTML}

                    </tr>

                </thead>

                <tbody>

                    ${rowsHTML}

                </tbody>

            </table>

        </div>

    `;

}