
import {
    getCourses
} from "../services/courseService.js";

import {
    loadImages
} from "../services/imageService.js";

import {
    renderCourseToolbar
} from "../components/courseGrid.js";

import {
    buildCourseGroups,
    renderCourseGroupList
} from "../components/searchCourseGroupListSidebar.js";

import {
    initCourseData,
    bindSearchEvents,
    renderDefaultTables
} from "../fn/courseSearchEvents.js";

import {
    renderSidebarPageLayout
} from "../layouts/sidebarPageLayout.js";

import {
    renderPageLayout
} from "../layouts/pageLayout.js";

import {
    renderNotification
} from "../layouts/notificationLayout.js";

import {
    bindSidebar,
    bindMenuListToggle
} from "../fn/sidebarEvents.js";

import {
    renderSearchCourseName
} from "../components/searchCourseNameSidebar.js";

import {
    renderSearchSettings,
    renderCourseInfoSettings
} from "../components/searchSettingsSidebar.js";

import {
    renderImageModal,
    bindImageModalEvents
} from "../components/imageModal.js";

import {
    bindCartEvents
} from "../fn/cartEvents.js";

import {
    bindWishlistEvents
} from "../fn/wishlistEvents.js";

import {
    t
} from "../i18n/i18n.js";


// Анхны хуудас

export function renderCoursesPage() {

    return renderPageLayout({

        pageId: "courses",

        pageTitle: t("courses.title"),

        content: renderNotification(

            t("common.loading"),

            "loading"

        )

    });

}


// Үндсэн сургалтын хуудас

export async function bindCoursesPage(params) {

    const app = document.getElementById("app");

    if (!app) return;

    const currentHash = window.location.hash;

    let pageNode = app.firstElementChild;


    try {

        // Өгөгдөл болон зураг ачаалах

        const [courseData] = await Promise.all([

            getCourses(),

            loadImages().catch(error => {

                console.warn(

                    "Failed to load images:",

                    error

                );

            })

        ]);


        if (

            window.location.hash !== currentHash ||

            app.firstElementChild !== pageNode

        ) return;


        // Өгөгдөл бэлтгэх

        initCourseData(courseData);


        const groupedCourses = buildCourseGroups(

            courseData

        );


        // Хуудасны бүтэц

        app.innerHTML = renderSidebarPageLayout({

            pageId: "courses",

            pageTitle: t("courses.title"),


            sidebarContent: `

                ${renderSearchCourseName()}

                ${renderSearchSettings()}

                ${renderCourseGroupList(groupedCourses)}

                ${renderCourseInfoSettings()}

            `,


            mainContent: `

                <section class="course-catalog">

                    <div id="courseToolbar">

                        ${renderCourseToolbar(
                            courseData.length
                        )}

                    </div>


                    <div id="resultTbl">

                        ${renderDefaultTables(
                            courseData
                        )}

                    </div>

                </section>

            `

        });


        pageNode = app.firstElementChild;


        // Image Modal

        document.getElementById("imageModal")
            ?.remove();


        document.documentElement.classList.remove(

            "is-clipped"

        );


        app.insertAdjacentHTML(

            "beforeend",

            renderImageModal()

        );


        // Navbar хайлт

        const queryParams =

            params instanceof URLSearchParams

                ? params

                : new URLSearchParams(

                    window.location.hash.split("?")[1]

                    ?? ""

                );


        const keyword = queryParams.get("q");


        const searchTxt = document.getElementById(

            "searchTxt"

        );


        if (keyword && searchTxt) {

            searchTxt.value = keyword;

        }


        // Бүх Event холбох

        bindSidebar();

        bindMenuListToggle();

        bindSearchEvents();

        bindImageModalEvents();

        bindCartEvents();

        bindWishlistEvents();


        console.info(

            `SkillZone: ${courseData.length} сургалт ачааллаа.`

        );


    } catch (error) {

        if (

            window.location.hash !== currentHash ||

            app.firstElementChild !== pageNode

        ) return;


        console.error(

            "Failed to load courses:",

            error

        );


        app.innerHTML = renderPageLayout({

            pageId: "courses",

            pageTitle: t("courses.title"),

            content: renderNotification(

                t("common.error"),

                "danger"

            )

        });

    }

}
