import {
    getLanguage
} from "../i18n/i18n.js";


function lang(mn, en) {

    return getLanguage() === "mn" ? mn : en;

}


export function renderDashboardSidebar() {

    return `

        <aside class="dashboard-sidebar">

            <div class="dashboard-sidebar-brand">

                <div class="dashboard-sidebar-logo">

                    <i class="fa-solid fa-graduation-cap"></i>

                </div>

                <div class="dashboard-brand-info">

                    <strong>SkillZone</strong>

                    <span>

                        ${lang("Суралцах орчин", "Learning space")}

                    </span>

                </div>

            </div>


            <nav class="dashboard-menu">

                <p class="dashboard-menu-label">
                    WORKSPACE
                </p>


                <a href="#/profile"
                   class="dashboard-menu-item is-active">

                    <i class="fa-solid fa-table-columns"></i>

                    <span>Dashboard</span>

                </a>


                <a href="#/my-learning"
                   class="dashboard-menu-item">

                    <i class="fa-solid fa-book-open"></i>

                    <span>

                        ${lang("Миний сургалтууд", "My learning")}

                    </span>

                </a>


                <button
                    type="button"
                    class="dashboard-menu-item"
                    data-dashboard-target="dashboardAnalytics">

                    <i class="fa-solid fa-chart-line"></i>

                    <span>

                        ${lang("Сургалтын явц", "My progress")}

                    </span>

                </button>


                <a href="#/certificates"
                   class="dashboard-menu-item">

                    <i class="fa-solid fa-award"></i>

                    <span>

                        ${lang("Сертификатууд", "Certificates")}

                    </span>

                </a>


                <a href="#/calendar"
                   class="dashboard-menu-item">

                    <i class="fa-solid fa-calendar-days"></i>

                    <span>

                        ${lang("Сургалтын хуваарь", "Learning calendar")}

                    </span>

                </a>


                <a href="#/wishlist"
                   class="dashboard-menu-item">

                    <i class="fa-regular fa-heart"></i>

                    <span>

                        ${lang("Хадгалсан сургалт", "Wishlist")}

                    </span>

                </a>


                <a href="#/cart"
                   class="dashboard-menu-item">

                    <i class="fa-solid fa-cart-shopping"></i>

                    <span>

                        ${lang("Миний сагс", "My cart")}

                    </span>

                </a>


                <a href="#/orders"
                   class="dashboard-menu-item">

                    <i class="fa-solid fa-receipt"></i>

                    <span>

                        ${lang("Худалдан авалтын түүх", "Order history")}

                    </span>

                </a>

            </nav>


            <nav class="dashboard-menu">

                <p class="dashboard-menu-label">
                    ACCOUNT
                </p>


                <a href="#/settings"
                   class="dashboard-menu-item">

                    <i class="fa-regular fa-user"></i>

                    <span>

                        ${lang("Хувийн мэдээлэл", "Personal information")}

                    </span>

                </a>


                <a href="#/settings"
                   class="dashboard-menu-item">

                    <i class="fa-solid fa-gear"></i>

                    <span>

                        ${lang("Тохиргоо", "Settings")}

                    </span>

                </a>

            </nav>


            <div class="dashboard-sidebar-bottom">

                <a href="#/courses"
                   class="dashboard-menu-item">

                    <i class="fa-solid fa-compass"></i>

                    <span>

                        ${lang("Сургалт үзэх", "Browse courses")}

                    </span>

                </a>


                <button
                    type="button"
                    id="logoutButton"
                    class="dashboard-menu-item dashboard-logout">

                    <i class="fa-solid fa-right-from-bracket"></i>

                    <span>

                        ${lang("Гарах", "Logout")}

                    </span>

                </button>

            </div>

        </aside>

    `;

}