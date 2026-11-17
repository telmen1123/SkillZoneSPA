
import {
    t,
    getLocalizedValue
} from "./i18n/i18n.js";

function createPage(titleKey, icon, description) {

    return () => `
        <section class="section">

            <div class="app-container">

                <div class="app-card has-text-centered">

                    <span class="icon is-large
                                 has-text-primary mb-4">

                        <i class="fa-solid ${icon} fa-3x"></i>

                    </span>

                    <h1 class="title is-2">
                        ${t(titleKey)}
                    </h1>

                    <p class="subtitle is-5">
                        ${getLocalizedValue(description)}
                    </p>

                    <a href="#/" class="app-button">

                        <i class="fa-solid fa-house"></i>

                        ${t("nav.home")}

                    </a>

                </div>

            </div>

        </section>
    `;
}

// SPA хуудасны замууд
export const routes = {

    "/": createPage(
        "brand",
        "fa-graduation-cap",
        {
            mn: "Цахим сургалтын платформ",
            en: "Online Learning Platform"
        }
    ),

    "/courses": createPage(
        "courses.title",
        "fa-book-open",
        {
            mn: "Бүх цахим сургалтын жагсаалт",
            en: "Explore all online courses"
        }
    ),

    "/instructors": createPage(
        "nav.instructors",
        "fa-chalkboard-user",
        {
            mn: "Манай сургалтын багш нар",
            en: "Meet our instructors"
        }
    ),

    "/blog": createPage(
        "nav.blog",
        "fa-newspaper",
        {
            mn: "Мэдээ, мэдээлэл, зөвлөгөө",
            en: "News, articles and learning tips"
        }
    ),

    "/wishlist": createPage(
        "nav.wishlist",
        "fa-heart",
        {
            mn: "Хадгалсан сургалтууд",
            en: "Your saved courses"
        }
    ),

    "/cart": createPage(
        "cart.title",
        "fa-cart-shopping",
        {
            mn: "Сонгосон сургалтууд",
            en: "Your selected courses"
        }
    ),

    "/notifications": createPage(
        "nav.notifications",
        "fa-bell",
        {
            mn: "Шинэ мэдээлэл болон мэдэгдлүүд",
            en: "Latest updates and notifications"
        }
    ),

    "/login": createPage(
        "auth.login",
        "fa-user",
        {
            mn: "Хэрэглэгчийн бүртгэл",
            en: "Access your account"
        }
    ),

    "/my-learning": createPage(
        "learning.title",
        "fa-graduation-cap",
        {
            mn: "Худалдаж авсан сургалтууд",
            en: "Your purchased courses"
        }
    ),

    "/faq": createPage(
        "footer.faq",
        "fa-circle-question",
        {
            mn: "Хэрэглэгчийн асуулт, хариулт",
            en: "Questions and answers"
        }
    ),

    "/terms": createPage(
        "footer.terms",
        "fa-file-contract",
        {
            mn: "Үйлчилгээний нөхцөлийн мэдээлэл",
            en: "Terms and conditions of service"
        }
    ),

    "/privacy": createPage(
        "footer.privacy",
        "fa-shield-halved",
        {
            mn: "Хэрэглэгчийн мэдээллийн хамгаалалт",
            en: "Protection of your personal information"
        }
    ),

    "/contact": createPage(
        "footer.contact",
        "fa-envelope",
        {
            mn: "Санал хүсэлт илгээх",
            en: "Send us your feedback"
        }
    ),

    "/404": createPage(
        "404",
        "fa-triangle-exclamation",
        {
            mn: "Таны хайсан хуудас олдсонгүй",
            en: "The page you requested was not found"
        }
    )

};
