
import {
    registerUser,
    isAuthenticated
} from "../services/authService.js";

import {
    getLanguage
} from "../i18n/i18n.js";

function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}


// Бүртгүүлэх хуудас

export function renderRegisterPage() {

    return `
        <section class="auth-page">

            <div class="auth-layout">

                <div class="auth-banner">

                    <a href="#/" class="auth-brand">
                        <i class="fa-solid fa-graduation-cap"></i>
                        SkillZone
                    </a>

                    <div class="auth-banner-content">

                        <span class="auth-banner-label">
                            START YOUR JOURNEY
                        </span>

                        <h1>
                            ${lang(
                                "Өнөөдрөөс өөрийгөө хөгжүүл.",
                                "Start learning today."
                            )}
                        </h1>

                        <p>
                            ${lang(
                                "Шинэ мэдлэг эзэмшиж, ирээдүйн боломжоо бүтээгээрэй.",
                                "Gain new knowledge and build your future."
                            )}
                        </p>

                        <div class="auth-illustration">
                            <i class="fa-solid fa-user-graduate"></i>
                        </div>

                    </div>

                    <span class="auth-copyright">
                        © ${new Date().getFullYear()} SkillZone
                    </span>

                </div>

                <div class="auth-content">

                    <div class="auth-form-wrapper">

                        <a href="#/login" class="auth-back">

                            <i class="fa-solid fa-arrow-left"></i>

                            ${lang(
                                "Нэвтрэх хуудас",
                                "Back to login"
                            )}

                        </a>

                        <div class="auth-heading">

                            <h2>
                                ${lang(
                                    "Бүртгэл үүсгэх",
                                    "Create an account"
                                )}
                            </h2>

                            <p>
                                ${lang(
                                    "SkillZone-д нэгдэж, суралцаж эхлээрэй.",
                                    "Join SkillZone and start learning."
                                )}
                            </p>

                        </div>

                        <form id="registerForm"
                              class="auth-form">

                            <div id="registerMessage"
                                 class="auth-message"
                                 role="alert"
                                 hidden>
                            </div>

                            <!-- Нэр -->

                            <div class="auth-field">

                                <label for="registerName">
                                    ${lang("Таны нэр", "Full name")}
                                </label>

                                <div class="auth-input">

                                    <i class="fa-regular fa-user"></i>

                                    <input
                                        type="text"
                                        id="registerName"
                                        placeholder="${lang(
                                            "Нэрээ оруулна уу",
                                            "Enter your name"
                                        )}"
                                        autocomplete="name"
                                        minlength="2"
                                        maxlength="80"
                                        required
                                    >

                                </div>

                            </div>

                            <!-- И-мэйл -->

                            <div class="auth-field">

                                <label for="registerEmail">
                                    ${lang("И-мэйл хаяг", "Email address")}
                                </label>

                                <div class="auth-input">

                                    <i class="fa-regular fa-envelope"></i>

                                    <input
                                        type="email"
                                        id="registerEmail"
                                        placeholder="example@gmail.com"
                                        autocomplete="email"
                                        required
                                    >

                                </div>

                            </div>

                            <!-- Нууц үг -->

                            <div class="auth-field">

                                <label for="registerPassword">
                                    ${lang("Нууц үг", "Password")}
                                </label>

                                <div class="auth-input">

                                    <i class="fa-solid fa-lock"></i>

                                    <input
                                        type="password"
                                        id="registerPassword"
                                        placeholder="••••••••"
                                        autocomplete="new-password"
                                        minlength="8"
                                        required
                                    >

                                    <button
                                        type="button"
                                        class="auth-toggle-password"
                                        data-toggle-password="registerPassword"
                                        aria-label="${lang(
                                            "Нууц үг харах",
                                            "Show password"
                                        )}"
                                        aria-pressed="false"
                                    >
                                        <i class="fa-regular fa-eye"></i>
                                    </button>

                                </div>

                                <small class="auth-hint">

                                    ${lang(
                                        "Хамгийн багадаа 8 тэмдэгт оруулна уу.",
                                        "Use at least 8 characters."
                                    )}

                                </small>

                            </div>

                            <!-- Нууц үг давтах -->

                            <div class="auth-field">

                                <label for="confirmPassword">

                                    ${lang(
                                        "Нууц үг давтах",
                                        "Confirm password"
                                    )}

                                </label>

                                <div class="auth-input">

                                    <i class="fa-solid fa-shield-halved"></i>

                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        autocomplete="new-password"
                                        minlength="8"
                                        required
                                    >

                                    <button
                                        type="button"
                                        class="auth-toggle-password"
                                        data-toggle-password="confirmPassword"
                                        aria-label="${lang(
                                            "Нууц үг харах",
                                            "Show password"
                                        )}"
                                        aria-pressed="false"
                                    >
                                        <i class="fa-regular fa-eye"></i>
                                    </button>

                                </div>

                            </div>

                            <!-- Үйлчилгээний нөхцөл -->

                            <div class="auth-agreement">

                                <input
                                    type="checkbox"
                                    id="acceptTerms"
                                    required
                                >

                                <label for="acceptTerms">

                                    ${lang(
                                        "Би",
                                        "I agree to the"
                                    )}

                                    <a href="#/terms"
                                       target="_blank"
                                       rel="noopener noreferrer">
                                        ${lang(
                                            "үйлчилгээний нөхцөл",
                                            "terms of service"
                                        )}
                                    </a>

                                    ${lang("болон", "and")}

                                    <a href="#/privacy"
                                       target="_blank"
                                       rel="noopener noreferrer">
                                        ${lang(
                                            "нууцлалын бодлогыг",
                                            "privacy policy"
                                        )}
                                    </a>

                                    ${lang("зөвшөөрч байна.", "")}

                                </label>

                            </div>

                            <!-- Бүртгүүлэх товч -->

                            <button
                                type="submit"
                                id="registerSubmit"
                                class="auth-submit"
                            >

                                ${lang(
                                    "Бүртгүүлэх",
                                    "Create account"
                                )}

                                <i class="fa-solid fa-arrow-right"></i>

                            </button>

                        </form>

                        <div class="auth-divider">

                            <span>
                                ${lang(
                                    "Өмнө нь бүртгүүлсэн үү?",
                                    "Already have an account?"
                                )}
                            </span>

                        </div>

                        <a href="#/login"
                           class="auth-secondary-button">

                            ${lang("Нэвтрэх", "Sign in")}

                        </a>

                    </div>

                </div>

            </div>

        </section>
    `;
}


// Алдааны мэдээлэл

function getErrorMessage(error) {

    const messages = {

        INVALID_NAME: lang(
            "Нэр хамгийн багадаа 2 тэмдэгт байх ёстой.",
            "Name must contain at least 2 characters."
        ),

        INVALID_EMAIL: lang(
            "И-мэйл хаягаа зөв оруулна уу.",
            "Enter a valid email address."
        ),

        WEAK_PASSWORD: lang(
            "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой.",
            "Password must contain at least 8 characters."
        ),

        EMAIL_EXISTS: lang(
            "Энэ и-мэйл хаяг бүртгэлтэй байна.",
            "This email address is already registered."
        )

    };

    return messages[error] ?? lang(
        "Бүртгүүлэхэд алдаа гарлаа.",
        "Registration failed."
    );

}


// Бүртгүүлэх хуудасны ажиллагаа

export function bindRegisterPage() {

    if (isAuthenticated()) {

        window.location.hash = "/profile";

        return;

    }

    const form = document.getElementById("registerForm");

    if (!form) return;

    const name = document.getElementById("registerName");
    const email = document.getElementById("registerEmail");
    const password = document.getElementById("registerPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const terms = document.getElementById("acceptTerms");
    const submit = document.getElementById("registerSubmit");
    const message = document.getElementById("registerMessage");


    // Нууц үг харах, нуух

    form.querySelectorAll("[data-toggle-password]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const input = document.getElementById(
                    button.dataset.togglePassword
                );

                if (!input) return;

                const visible = input.type === "password";

                input.type = visible ? "text" : "password";

                button.innerHTML = visible
                    ? `<i class="fa-regular fa-eye-slash"></i>`
                    : `<i class="fa-regular fa-eye"></i>`;

                button.setAttribute(
                    "aria-pressed",
                    String(visible)
                );

                button.setAttribute(
                    "aria-label",
                    visible
                        ? lang("Нууц үг нуух", "Hide password")
                        : lang("Нууц үг харах", "Show password")
                );

            });

        });


    // Алдаа харуулах

    function showMessage(text) {

        message.textContent = text;

        message.hidden = false;

    }


    // Бүртгүүлэх үйлдэл

    form.addEventListener("submit", async event => {

        event.preventDefault();

        if (submit.disabled) return;

        message.hidden = true;


        // Нууц үг таарч байгаа эсэх

        if (password.value !== confirmPassword.value) {

            showMessage(
                lang(
                    "Нууц үг хоорондоо таарахгүй байна.",
                    "Passwords do not match."
                )
            );

            confirmPassword.focus();

            return;

        }


        // Үйлчилгээний нөхцөл шалгах

        if (!terms.checked) {

            showMessage(
                lang(
                    "Үйлчилгээний нөхцөлийг зөвшөөрнө үү.",
                    "Please accept the terms of service."
                )
            );

            return;

        }


        submit.disabled = true;

        submit.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            ${lang(
                "Бүртгэж байна...",
                "Creating account..."
            )}

        `;


        try {

            const result = await registerUser({

                name: name.value,

                email: email.value,

                password: password.value

            });

            if (!form.isConnected) return;

            if (!result.success) {

                showMessage(
                    getErrorMessage(result.error)
                );

                return;

            }

            window.location.hash = "/profile";

        } catch (error) {

            console.error("Register error:", error);

            if (form.isConnected) {

                showMessage(
                    lang(
                        "Алдаа гарлаа. Дахин оролдоно уу.",
                        "Something went wrong. Please try again."
                    )
                );

            }

        } finally {

            if (form.isConnected) {

                submit.disabled = false;

                submit.innerHTML = `

                    ${lang(
                        "Бүртгүүлэх",
                        "Create account"
                    )}

                    <i class="fa-solid fa-arrow-right"></i>

                `;

            }

        }

    });

}
