
import {
    t,
    getLanguage
} from "../i18n/i18n.js";

// Сургалтын нэрээр хайх компонент
export function renderSearchCourseName() {

    const isMN = getLanguage() === "mn";

    return `

        <div class="sidebar-section">

            <label
                for="searchTxt"
                class="menu-label app-menu-label">

                ${isMN
                    ? "Сургалтын нэрээр хайх"
                    : "Search by course name"}

            </label>

            <div class="field">

                <p class="control has-icons-left">

                    <input
                        class="input is-primary"
                        type="search"
                        id="searchTxt"
                        name="courseName"
                        placeholder="${t("nav.search")}"
                        autocomplete="off"/>

                    <span class="icon is-small is-left">

                        <i class="fa-solid
                                  fa-magnifying-glass">
                        </i>

                    </span>

                </p>

            </div>

            <div class="field">

                <p class="control">

                    <button
                        class="button is-primary is-fullwidth"
                        type="button"
                        id="searchBtn">

                        <span class="icon">

                            <i class="fa-solid
                                      fa-magnifying-glass">
                            </i>

                        </span>

                        <span>
                            ${t("common.search")}
                        </span>

                    </button>

                </p>

            </div>

        </div>

    `;

}
