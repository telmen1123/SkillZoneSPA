import {
    t,
    getLocalizedValue
} from "./i18n/i18n.js";

import {
    renderHomePage,
    bindHomePage
} from "./pages/homePage.js";

import {
    renderCoursesPage,
    bindCoursesPage
} from "./pages/coursesPage.js";

import {
    renderCourseDetailsPage,
    bindCourseDetailsPage
} from "./pages/courseDetailsPage.js";

import {
    renderInstructorsPage,
    bindInstructorsPage
} from "./pages/instructorsPage.js";

import {
    renderBlogPage,
    bindBlogPage
} from "./pages/blogPage.js";

import {
    renderArticlePage,
    bindArticlePage
} from "./pages/articlePage.js";

import {
    renderCartPage,
    bindCartPage
} from "./pages/cartPage.js";

import {
    renderWishlistPage,
    bindWishlistPage
} from "./pages/wishlistPage.js";

import {
    renderLoginPage,
    bindLoginPage
} from "./pages/loginPage.js";

import {
    renderRegisterPage,
    bindRegisterPage
} from "./pages/registerPage.js";

import {
    renderProfilePage,
    bindProfilePage
} from "./pages/profilePage.js";

import {
    renderCheckoutPage,
    bindCheckoutPage
} from "./pages/checkoutPage.js";

import {
    renderMyLearningPage,
    bindMyLearningPage
} from "./pages/myLearningPage.js";

import {
    renderPlayerPage,
    bindPlayerPage
} from "./pages/playerPage.js";

import {
    renderCertificatePage,
    bindCertificatePage
} from "./pages/certificatePage.js";

import {
    renderCalendarPage,
    bindCalendarPage
} from "./pages/calendarPage.js";

import {
    renderNotificationsPage,
    bindNotificationsPage
} from "./pages/notificationsPage.js";

import {
    renderSettingsPage,
    bindSettingsPage
} from "./pages/settingsPage.js";

import {
    renderOrderHistoryPage,
    bindOrderHistoryPage
} from "./pages/orderHistoryPage.js";


function createPage(titleKey, icon, description) {

    return () => `

        <section class="section">

            <div class="app-container">

                <div class="app-card has-text-centered">

                    <span class="icon is-large has-text-primary mb-4">

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


export const routes = {

    "/": {
        render: renderHomePage,
        bind: bindHomePage
    },

    "/courses": {
        render: renderCoursesPage,
        bind: bindCoursesPage
    },

    "/course": {
        render: renderCourseDetailsPage,
        bind: bindCourseDetailsPage
    },

    "/instructors": {
        render: renderInstructorsPage,
        bind: bindInstructorsPage
    },

    "/blog": {
        render: renderBlogPage,
        bind: bindBlogPage
    },

    "/article": {
        render: renderArticlePage,
        bind: bindArticlePage
    },

    "/wishlist": {
        render: renderWishlistPage,
        bind: bindWishlistPage
    },

    "/cart": {
        render: renderCartPage,
        bind: bindCartPage
    },

    "/checkout": {
        render: renderCheckoutPage,
        bind: bindCheckoutPage
    },

    "/login": {
        render: renderLoginPage,
        bind: bindLoginPage
    },

    "/register": {
        render: renderRegisterPage,
        bind: bindRegisterPage
    },

    "/profile": {
        render: renderProfilePage,
        bind: bindProfilePage
    },

    "/my-learning": {
        render: renderMyLearningPage,
        bind: bindMyLearningPage
    },

    "/player": {
        render: renderPlayerPage,
        bind: bindPlayerPage
    },

    "/certificates": {
        render: renderCertificatePage,
        bind: bindCertificatePage
    },

    "/calendar": {
        render: renderCalendarPage,
        bind: bindCalendarPage
    },

    "/notifications": {
        render: renderNotificationsPage,
        bind: bindNotificationsPage
    },

    "/settings": {
        render: renderSettingsPage,
        bind: bindSettingsPage
    },

    "/orders": {
        render: renderOrderHistoryPage,
        bind: bindOrderHistoryPage
    },

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
            en: "Terms and conditions"
        }
    ),

    "/privacy": createPage(
        "footer.privacy",
        "fa-shield-halved",
        {
            mn: "Хэрэглэгчийн мэдээллийн хамгаалалт",
            en: "Privacy policy"
        }
    ),

    "/contact": createPage(
        "footer.contact",
        "fa-envelope",
        {
            mn: "Санал хүсэлт илгээх",
            en: "Contact us"
        }
    ),

    "/404": createPage(
        "404",
        "fa-triangle-exclamation",
        {
            mn: "Таны хайсан хуудас олдсонгүй",
            en: "Page not found"
        }
    )

};