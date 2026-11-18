import {
    getCurrentUser,
    updateProfile,
    updateAvatar,
    changePassword
} from "../services/authService.js";

import {
    getLanguage
} from "../i18n/i18n.js";

import {
    escapeHtml
} from "../fn/format.js";


function lang(mn, en) {

    return getLanguage() === "mn" ? mn : en;

}


function getInitials(name) {

    return String(name ?? "User")

        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word[0] ?? "")
        .join("")
        .toUpperCase();

}


function renderAvatar(user) {

    const avatar = user.avatar ?? "";

    if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(avatar)) {

        return `
            <img
                src="${escapeHtml(avatar)}"
                alt="Profile">
        `;

    }

    return escapeHtml(getInitials(user.name));

}


function renderField(label, name, value, type = "text", extra = "") {

    return `

        <label class="settings-field">

            <span>${label}</span>

            <input
                type="${type}"
                name="${name}"
                value="${escapeHtml(value ?? "")}"
                ${extra}>

        </label>

    `;

}


function renderPasswordField(label, name) {

    return `

        <label class="settings-field">

            <span>${label}</span>

            <div class="settings-password-field">

                <input
                    type="password"
                    name="${name}"
                    minlength="8"
                    required>

                <button
                    type="button"
                    data-password-toggle
                    aria-label="${lang("Нууц үг харах", "Show password")}"
                    aria-pressed="false">

                    <i class="fa-regular fa-eye"></i>

                </button>

            </div>

        </label>

    `;

}


function showMessage(element, message, success = true) {

    element.hidden = false;

    element.textContent = message;

    element.className = `settings-message ${
        success ? "is-success" : "is-error"
    }`;

}


function getErrorMessage(error) {

    const messages = {

        INVALID_NAME: lang(
            "Нэр 2–80 тэмдэгт байх ёстой.",
            "Name must be 2–80 characters."
        ),

        INVALID_PASSWORD: lang(
            "Одоогийн нууц үг буруу байна.",
            "Current password is incorrect."
        ),

        WEAK_PASSWORD: lang(
            "Нууц үг хамгийн багадаа 8 тэмдэгт байна.",
            "Password must contain at least 8 characters."
        ),

        SAME_PASSWORD: lang(
            "Шинэ нууц үг өмнөхөөс ялгаатай байна.",
            "Choose a different password."
        ),

        INVALID_AVATAR: lang(
            "Зургийн төрөл эсвэл хэмжээ тохирохгүй байна.",
            "Invalid image type or size."
        ),

        STORAGE_ERROR: lang(
            "Хадгалах зай хүрэлцэхгүй байна.",
            "Unable to save data."
        )

    };

    return messages[error] ?? lang(
        "Алдаа гарлаа. Дахин оролдоно уу.",
        "Something went wrong. Please try again."
    );

}


export function renderSettingsPage() {

    const user = getCurrentUser();

    if (!user) return "";

    return `

        <section class="settings-page">

            <div class="app-container">

                <a href="#/profile" class="settings-back">

                    <i class="fa-solid fa-arrow-left"></i>
                    Dashboard

                </a>


                <div class="settings-hero">

                    <div>

                        <span>SKILLZONE ACCOUNT</span>

                        <h1>

                            ${lang(
                                "Хэрэглэгчийн тохиргоо",
                                "Account settings"
                            )}

                        </h1>

                        <p>

                            ${lang(
                                "Өөрийн бүртгэл болон хувийн мэдээллээ удирдах.",
                                "Manage your account and personal information."
                            )}

                        </p>

                    </div>

                    <i class="fa-solid fa-user-gear"></i>

                </div>


                <div class="settings-layout">


                    <!-- AVATAR -->

                    <section class="settings-card">

                        <h2>

                            ${lang("Profile зураг", "Profile photo")}

                        </h2>

                        <div class="settings-avatar-row">

                            <div
                                id="settingsAvatar"
                                class="settings-avatar">

                                ${renderAvatar(user)}

                            </div>

                            <div class="settings-avatar-actions">

                                <label class="settings-button">

                                    <i class="fa-solid fa-camera"></i>

                                    ${lang("Зураг солих", "Change photo")}

                                    <input
                                        type="file"
                                        id="avatarInput"
                                        accept="image/jpeg,image/png,image/webp"
                                        hidden>

                                </label>

                                <button
                                    type="button"
                                    id="removeAvatar"
                                    class="settings-secondary-button">

                                    ${lang("Устгах", "Remove")}

                                </button>

                                <small>

                                    JPG, PNG, WEBP · 2 MB

                                </small>

                            </div>

                        </div>

                        <p
                            id="avatarMessage"
                            role="status"
                            class="settings-message"
                            hidden>
                        </p>

                    </section>


                    <!-- PERSONAL INFORMATION -->

                    <section class="settings-card">

                        <h2>

                            <i class="fa-regular fa-user"></i>

                            ${lang(
                                "Хувийн мэдээлэл",
                                "Personal information"
                            )}

                        </h2>


                        <form id="settingsProfileForm">

                            <div class="settings-form-grid">

                                ${renderField(
                                    lang("Овог нэр", "Full name"),
                                    "name",
                                    user.name,
                                    "text",
                                    'required minlength="2" maxlength="80"'
                                )}

                                ${renderField(
                                    lang("И-мэйл хаяг", "Email address"),
                                    "email",
                                    user.email,
                                    "email",
                                    "readonly"
                                )}

                                ${renderField(
                                    lang("Утасны дугаар", "Phone number"),
                                    "phone",
                                    user.phone,
                                    "tel",
                                    'maxlength="30"'
                                )}

                                ${renderField(
                                    lang("Мэргэжил", "Profession"),
                                    "profession",
                                    user.profession,
                                    "text",
                                    'maxlength="100"'
                                )}

                            </div>


                            <label class="settings-field">

                                <span>

                                    ${lang("Миний тухай", "About me")}

                                </span>

                                <textarea
                                    name="bio"
                                    rows="4"
                                    maxlength="500">${escapeHtml(user.bio)}</textarea>

                            </label>


                            <p
                                id="profileMessage"
                                class="settings-message"
                                role="status"
                                hidden>
                            </p>


                            <div class="settings-form-actions">

                                <button
                                    type="submit"
                                    class="settings-button">

                                    <i class="fa-solid fa-floppy-disk"></i>

                                    ${lang(
                                        "Өөрчлөлт хадгалах",
                                        "Save changes"
                                    )}

                                </button>

                            </div>

                        </form>

                    </section>


                    <!-- PASSWORD -->

                    <section class="settings-card">

                        <h2>

                            <i class="fa-solid fa-lock"></i>

                            ${lang(
                                "Нууц үг солих",
                                "Change password"
                            )}

                        </h2>

                        <form id="settingsPasswordForm">

                            ${renderPasswordField(
                                lang(
                                    "Одоогийн нууц үг",
                                    "Current password"
                                ),
                                "currentPassword"
                            )}

                            ${renderPasswordField(
                                lang(
                                    "Шинэ нууц үг",
                                    "New password"
                                ),
                                "newPassword"
                            )}

                            ${renderPasswordField(
                                lang(
                                    "Шинэ нууц үг давтах",
                                    "Confirm new password"
                                ),
                                "confirmPassword"
                            )}

                            <p class="settings-hint">

                                ${lang(
                                    "Нууц үг хамгийн багадаа 8 тэмдэгт байна.",
                                    "Use at least 8 characters."
                                )}

                            </p>

                            <p
                                id="passwordMessage"
                                role="status"
                                class="settings-message"
                                hidden>
                            </p>

                            <div class="settings-form-actions">

                                <button
                                    type="submit"
                                    class="settings-button">

                                    <i class="fa-solid fa-shield-halved"></i>

                                    ${lang(
                                        "Нууц үг шинэчлэх",
                                        "Update password"
                                    )}

                                </button>

                            </div>

                        </form>

                    </section>

                </div>

            </div>

        </section>

    `;

}


// BIND EVENTS

export function bindSettingsPage() {

    const user = getCurrentUser();

    if (!user) {

        window.location.hash = "/login";

        return;

    }

    const page = document.querySelector(".settings-page");

    if (!page) return;


    // UPDATE PROFILE

    const profileForm = page.querySelector(
        "#settingsProfileForm"
    );

    const profileMessage = page.querySelector(
        "#profileMessage"
    );

    profileForm.addEventListener("submit", event => {

        event.preventDefault();

        if (getCurrentUser()?.id !== user.id) {

            window.location.hash = "/login";
            return;

        }

        const data = Object.fromEntries(
            new FormData(profileForm)
        );

        const result = updateProfile(data);

        if (result.success) {

            showMessage(

                profileMessage,

                lang(
                    "Мэдээлэл амжилттай хадгалагдлаа.",
                    "Profile updated successfully."
                )

            );

            page.querySelector(
                "#settingsAvatar"
            ).innerHTML = renderAvatar(result.user);

        } else {

            showMessage(
                profileMessage,
                getErrorMessage(result.error),
                false
            );

        }

    });


    // UPLOAD AVATAR

    const avatarInput = page.querySelector(
        "#avatarInput"
    );

    const avatarMessage = page.querySelector(
        "#avatarMessage"
    );

    avatarInput.addEventListener("change", () => {

        const file = avatarInput.files[0];

        if (!file) return;

        const allowedTypes = [

            "image/jpeg",
            "image/png",
            "image/webp"

        ];

        if (
            !allowedTypes.includes(file.type) ||
            file.size > 2 * 1024 * 1024
        ) {

            showMessage(

                avatarMessage,

                lang(
                    "2 MB-аас бага JPG, PNG, WEBP зураг сонгоно уу.",
                    "Choose a JPG, PNG or WEBP image under 2 MB."
                ),

                false

            );

            avatarInput.value = "";

            return;

        }

        const reader = new FileReader();

        reader.onload = () => {

            if (!page.isConnected) return;

            if (getCurrentUser()?.id !== user.id) return;

            const result = updateAvatar(reader.result);

            if (result.success) {

                page.querySelector(
                    "#settingsAvatar"
                ).innerHTML = renderAvatar(result.user);

                showMessage(

                    avatarMessage,

                    lang(
                        "Profile зураг шинэчлэгдлээ.",
                        "Profile photo updated."
                    )

                );

            } else {

                showMessage(

                    avatarMessage,

                    getErrorMessage(result.error),

                    false

                );

            }

            avatarInput.value = "";

        };

        reader.onerror = () => {

            showMessage(

                avatarMessage,

                lang(
                    "Зургийг унших боломжгүй байна.",
                    "Unable to read the image."
                ),

                false

            );

            avatarInput.value = "";

        };

        reader.readAsDataURL(file);

    });


    // REMOVE AVATAR

    page.querySelector("#removeAvatar")
        .addEventListener("click", () => {

            if (getCurrentUser()?.id !== user.id) return;

            const result = updateAvatar("");

            if (result.success) {

                page.querySelector(
                    "#settingsAvatar"
                ).innerHTML = renderAvatar(result.user);

                showMessage(

                    avatarMessage,

                    lang(
                        "Profile зураг устгагдлаа.",
                        "Profile photo removed."
                    )

                );

            } else {

                showMessage(
                    avatarMessage,
                    getErrorMessage(result.error),
                    false
                );

            }

        });


    // SHOW PASSWORD

    page.querySelectorAll("[data-password-toggle]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const input = button.parentElement
                    .querySelector("input");

                const visible = input.type === "password";

                input.type = visible ? "text" : "password";

                button.setAttribute(
                    "aria-pressed",
                    String(visible)
                );

                button.innerHTML = visible

                    ? '<i class="fa-regular fa-eye-slash"></i>'

                    : '<i class="fa-regular fa-eye"></i>';

            });

        });


    // CHANGE PASSWORD

    const passwordForm = page.querySelector(
        "#settingsPasswordForm"
    );

    const passwordMessage = page.querySelector(
        "#passwordMessage"
    );

    let processing = false;

    passwordForm.addEventListener("submit", async event => {

        event.preventDefault();

        if (processing) return;

        if (getCurrentUser()?.id !== user.id) {

            window.location.hash = "/login";
            return;

        }

        const data = Object.fromEntries(
            new FormData(passwordForm)
        );

        if (data.newPassword !== data.confirmPassword) {

            showMessage(

                passwordMessage,

                lang(
                    "Шинэ нууц үг хоорондоо тохирохгүй байна.",
                    "Passwords do not match."
                ),

                false

            );

            return;

        }

        const submitButton = passwordForm.querySelector(
            '[type="submit"]'
        );

        processing = true;

        submitButton.disabled = true;

        try {

            const result = await changePassword(

                data.currentPassword,

                data.newPassword

            );

            if (!page.isConnected) return;

            if (result.success) {

                passwordForm.reset();

                showMessage(

                    passwordMessage,

                    lang(
                        "Нууц үг амжилттай солигдлоо.",
                        "Password changed successfully."
                    )

                );

            } else {

                showMessage(

                    passwordMessage,

                    getErrorMessage(result.error),

                    false

                );

            }

        } catch (error) {

            showMessage(

                passwordMessage,

                lang("Алдаа гарлаа.", "Something went wrong."),

                false

            );

        } finally {

            processing = false;

            submitButton.disabled = false;

        }

    });

}