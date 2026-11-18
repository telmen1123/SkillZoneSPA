
import { escapeHtml } from "../fn/format.js";

const notificationIcons = {

    info: "fa-circle-info",

    success: "fa-circle-check",

    warning: "fa-triangle-exclamation",

    danger: "fa-circle-exclamation",

    loading: "fa-spinner fa-spin"

};

// Мэдэгдлийн HTML үүсгэх
export function renderNotification(
    message,
    type = "warning"
) {

    const safeType = Object.hasOwn(
        notificationIcons,
        type
    )
        ? type
        : "warning";

    const icon = notificationIcons[safeType];

    const color = safeType === "loading"
        ? "info"
        : safeType;

    const role = safeType === "danger"
        ? "alert"
        : "status";

    return `

        <div
            class="notification is-light is-${color}"
            role="${role}">

            <div class="is-flex
                        is-align-items-center
                        is-gap-3">

                <span class="icon is-medium">

                    <i class="fa-solid ${icon}"
                       aria-hidden="true"></i>

                </span>

                <span>

                    ${escapeHtml(message)}

                </span>

            </div>

        </div>

    `;

}
