
import {
    loginUser,
    isAuthenticated
} from "../services/authService.js";

import {
    getLanguage
} from "../i18n/i18n.js";


function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}


// Нэвтрэх хуудас

export function renderLoginPage() {

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

                            LEARN. GROW. SUCCEED.

                        </span>

                        <h1>
                            ${lang(
                                "Таны ирээдүй эндээс эхэлнэ.",
                                "Your future starts here."
                            )}
                        </h1>

                        <p>
                            ${lang(
                                "Шинэ мэдлэг, шинэ ур чадвар, шинэ боломж.",
                                "New knowledge, new skills, new opportunities."
                            )}
                        </p>

                        <div class="auth-illustration">

                            <i class="fa-solid fa-laptop-code"></i>

                        </div>

                    </div>

                    <span class="auth-copyright">
                        © ${new Date().getFullYear()} SkillZone
                    </span>

                </div>


                <div class="auth-content">

                    <div class="auth-form-wrapper">

                        <a href="#/" class="auth-back">

                            <i class="fa-solid fa-arrow-left"></i>

                            ${lang(
                                "Нүүр хуудас",
                                "Back to home"
                            )}

                        </a>

                        <div class="auth-heading">

                            <h2>
                                ${lang(
                                    "Тавтай морил!",
                                    "Welcome back!"
                                )}
                            </h2>

                            <p>
                                ${lang(
                                    "Өөрийн бүртгэлээр нэвтэрнэ үү.",
                                    "Sign in to your account."
                                )}
                            </p>

                        </div>


                        <form id="loginForm"
                              class="auth-form">

                            <div id="loginMessage"
                                 class="auth-message"
                                 role="alert"
                                 hidden>
                            </div>


                            <div class="auth-field">

                                <label for="loginEmail">

                                    ${lang(
                                        "И-мэйл хаяг",
                                        "Email address"
                                    )}

                                </label>

                                <div class="auth-input">

                                    <i class="fa-regular fa-envelope"></i>

                                    <input
                                        type="email"
                                        id="loginEmail"
                                        placeholder="example@gmail.com"
                                        autocomplete="email"
                                        required
                                    >

                                </div>

                            </div>


                            <div class="auth-field">

                                <label for="loginPassword">

                                    ${lang(
                                        "Нууц үг",
                                        "Password"
                                    )}

                                </label>

                                <div class="auth-input">

                                    <i class="fa-solid fa-lock"></i>

                                    <input
                                        type="password"
                                        id="loginPassword"
                                        placeholder="••••••••"
                                        autocomplete="current-password"
                                        required
                                    >

                                    <button
                                        type="button"
                                        class="auth-toggle-password"
                                        id="togglePassword"
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


                            <button
                                type="submit"
                                class="auth-submit"
                                id="loginSubmit"
                            >

                                ${lang(
                                    "Нэвтрэх",
                                    "Sign in"
                                )}

                                <i class="fa-solid fa-arrow-right"></i>

                            </button>

                        </form>


                        <div class="auth-divider">

                            <span>

                                ${lang(
                                    "SkillZone-д шинээр элсэх",
                                    "New to SkillZone?"
                                )}

                            </span>

                        </div>


                        <a href="#/register"
                           class="auth-secondary-button">

                            ${lang(
                                "Бүртгэл үүсгэх",
                                "Create an account"
                            )}

                        </a>

                    </div>

                </div>

            </div>

        </section>
    `;

}


// Нэвтрэх хуудасны ажиллагаа

export function bindLoginPage() {

    if (isAuthenticated()) {

        window.location.hash = "/profile";

        return;

    }

    const form =
        document.getElementById("loginForm");

    const email =
        document.getElementById("loginEmail");

    const password =
        document.getElementById("loginPassword");

    const toggle =
        document.getElementById("togglePassword");

    const submit =
        document.getElementById("loginSubmit");

    const message =
        document.getElementById("loginMessage");

    if (!form) return;


    // Нууц үг харах, нуух

    toggle?.addEventListener("click", () => {

        const visible =
            password.type === "password";

        password.type =
            visible ? "text" : "password";

        toggle.innerHTML = visible

            ? `<i class="fa-regular fa-eye-slash"></i>`

            : `<i class="fa-regular fa-eye"></i>`;

        toggle.setAttribute(
            "aria-pressed",
            String(visible)
        );

        toggle.setAttribute(
            "aria-label",
            visible
                ? lang("Нууц үг нуух", "Hide password")
                : lang("Нууц үг харах", "Show password")
        );

    });


    // Алдааны мэдээлэл харуулах

    function showMessage(text) {

        message.textContent = text;

        message.hidden = false;

    }


    // Нэвтрэх товч

    form.addEventListener("submit", async event => {

        event.preventDefault();

        if (submit.disabled) return;

        message.hidden = true;

        submit.disabled = true;

        submit.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            ${lang(
                "Шалгаж байна...",
                "Signing in..."
            )}

        `;

        try {

            const result = await loginUser({

                email: email.value,

                password: password.value

            });

            if (!form.isConnected) return;

            if (!result.success) {

                showMessage(

                    lang(
                        "И-мэйл эсвэл нууц үг буруу байна.",
                        "Incorrect email or password."
                    )

                );

                return;

            }

            window.location.hash = "/profile";

        } catch (error) {

            console.error("Login error:", error);

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
                        "Нэвтрэх",
                        "Sign in"
                    )}

                    <i class="fa-solid fa-arrow-right"></i>

                `;

            }

        }

    });

}
