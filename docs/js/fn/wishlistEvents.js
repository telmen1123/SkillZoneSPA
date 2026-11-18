
import {

    toggleWishlist,

    isInWishlist,

    getWishlistCount

} from "../services/wishlistService.js";

import {

    getLanguage

} from "../i18n/i18n.js";


// Зүрхэн товчны төлөв шинэчлэх

export function updateWishlistButtons() {

    document.querySelectorAll(

        "[data-wishlist-code]"

    ).forEach(button => {

        const code = button.dataset.wishlistCode;

        const active = isInWishlist(code);

        const mn = getLanguage() === "mn";


        button.classList.toggle(

            "is-active",

            active

        );


        button.setAttribute(

            "aria-pressed",

            String(active)

        );


        const label = active

            ? (
                mn
                    ? "Дуртай сургалтаас хасах"
                    : "Remove from wishlist"
            )

            : (
                mn
                    ? "Дуртай сургалтад нэмэх"
                    : "Add to wishlist"
            );


        button.title = label;

        button.setAttribute("aria-label", label);


        button.innerHTML = active

            ? `<i class="fa-solid fa-heart"></i>`

            : `<i class="fa-regular fa-heart"></i>`;

    });

}


// Navbar дээрх тоог шинэчлэх

export function updateWishlistCount() {

    const count = getWishlistCount();

    document.querySelectorAll(

        "[data-wishlist-count], #wishlistCount"

    ).forEach(element => {

        element.textContent = count;

        element.hidden = count === 0;

    });

}


// Зүрхэн товч дарахад

function handleWishlistClick(event) {

    const button = event.target.closest(

        "[data-wishlist-code]"

    );

    if (!button) return;

    event.preventDefault();

    const code = button.dataset.wishlistCode;

    if (!code) return;

    toggleWishlist(code);

}


// Wishlist UI шинэчлэх

function updateWishlistUI() {

    updateWishlistButtons();

    updateWishlistCount();

}


// Event холбох

export function bindWishlistEvents() {

    const app = document.getElementById("app");

    if (!app) return;


    app.removeEventListener(

        "click",

        handleWishlistClick

    );


    app.addEventListener(

        "click",

        handleWishlistClick

    );


    window.removeEventListener(

        "wishlistchange",

        updateWishlistUI

    );


    window.addEventListener(

        "wishlistchange",

        updateWishlistUI

    );


    updateWishlistUI();

}
