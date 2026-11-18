import { getLanguage } from "../i18n/i18n.js";

function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}

export function renderCourseInfoSettings() {
    const types = [
        ["basic", "Үндсэн мэдээлэл", "Basic information"],
        ["pricing", "Үнийн мэдээлэл", "Pricing"],
        ["details", "Сургалтын дэлгэрэнгүй", "Course details"],
        ["rating", "Үнэлгээ", "Rating"],
        ["description", "Тайлбар", "Description"],
        ["images", "Сургалтын зургууд", "Course images"]
    ];

    return `
        <div class="mb-5">
            <h3 class="has-text-weight-bold mb-4">
                ${lang("Харуулах мэдээлэл", "Display information")}
            </h3>

            ${types.map(([value, mn, en]) => `
                <label class="checkbox is-block mb-3">
                    <input
                        type="checkbox"
                        class="course-info-checkbox"
                        name="courseInfo"
                        value="${value}"
                        ${["basic", "pricing", "rating", "images"]
                            .includes(value) ? "checked" : ""}
                    >
                    ${lang(mn, en)}
                </label>
            `).join("")}
        </div>

        <hr>
    `;
}

export function renderSearchSettings() {

    return `
        <div class="search-settings">

            <h3 class="has-text-weight-bold mb-3">
                ${lang("Үнэ", "Price")}
            </h3>

            <div class="field">
                <label class="label is-small">
                    ${lang("Доод үнэ", "Minimum price")}
                </label>

                <input
                    class="input"
                    id="minPrice"
                    type="number"
                    min="0"
                    placeholder="0 ₮"
                >
            </div>

            <div class="field">
                <label class="label is-small">
                    ${lang("Дээд үнэ", "Maximum price")}
                </label>

                <input
                    class="input"
                    id="maxPrice"
                    type="number"
                    min="0"
                    placeholder="300,000 ₮"
                >
            </div>

            <hr>

            <h3 class="has-text-weight-bold mb-3">
                ${lang("Түвшин", "Level")}
            </h3>

            ${[
                ["beginner", "Анхан шат", "Beginner"],
                ["intermediate", "Дунд шат", "Intermediate"],
                ["advanced", "Ахисан шат", "Advanced"]
            ].map(([value, mn, en]) => `
                <label class="checkbox is-block mb-3">
                    <input
                        type="checkbox"
                        name="level"
                        value="${value}"
                    >
                    ${lang(mn, en)}
                </label>
            `).join("")}

            <hr>

            <h3 class="has-text-weight-bold mb-3">
                ${lang("Үнэлгээ", "Rating")}
            </h3>

            <div class="select is-fullwidth">
                <select id="minRating">
                    <option value="0">
                        ${lang("Бүх үнэлгээ", "All ratings")}
                    </option>
                    <option value="4">4.0+</option>
                    <option value="4.5">4.5+</option>
                    <option value="4.8">4.8+</option>
                    <option value="4.9">4.9+</option>
                </select>
            </div>

            <hr>

            <h3 class="has-text-weight-bold mb-3">
                ${lang("Эрэмбэлэх", "Sort by")}
            </h3>

            <div class="select is-fullwidth">
                <select id="sortBy">
                    <option value="default">
                        ${lang("Анхдагч", "Default")}
                    </option>
                    <option value="priceAsc">
                        ${lang("Үнэ өсөхөөр", "Price ascending")}
                    </option>
                    <option value="priceDesc">
                        ${lang("Үнэ буурахаар", "Price descending")}
                    </option>
                    <option value="ratingDesc">
                        ${lang("Өндөр үнэлгээ", "Highest rating")}
                    </option>
                    <option value="studentsDesc">
                        ${lang("Олон суралцагч", "Most students")}
                    </option>
                </select>
            </div>

            <button
                type="button"
                id="resetFilters"
                class="button is-light is-fullwidth mt-4"
            >
                <span class="icon">
                    <i class="fa-solid fa-rotate-left"></i>
                </span>

                <span>
                    ${lang("Шүүлтүүр цэвэрлэх", "Reset filters")}
                </span>
            </button>

        </div>
    `;
}