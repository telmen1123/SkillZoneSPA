
import {

    toggleCart,

    isInCart,

    getCartCount

} from "../services/cartService.js";

import {

    getLanguage

} from "../i18n/i18n.js";


// ========================================
// UPDATE CART BUTTON
// ========================================

export function updateCartButtons() {

    document.querySelectorAll(

        "[data-cart-code]"

    ).forEach(button => {


        const code = button.dataset.cartCode;

        const active = isInCart(code);

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

            ? (mn ? "Сагснаас хасах" : "Remove from cart")

            : (mn ? "Сагсанд нэмэх" : "Add to cart");


        button.title = label;

        button.setAttribute("aria-label", label);


        const iconClass = active

            ? "fa-check"

            : "fa-cart-shopping";


        button.innerHTML = `

            <i class="fa-solid ${iconClass}"></i>

        `;

    });

}


// ========================================
// UPDATE CART COUNT
// ========================================

export function updateCartCount() {

    const count = getCartCount();


    document.querySelectorAll(

        "[data-cart-count], #cartCount"

    ).forEach(element => {

        element.textContent = count;

        element.hidden = count === 0;

    });

}


// ========================================
// BIND CART EVENTS
// ========================================

export function bindCartEvents() {

    const app = document.getElementById("app");

    if (!app) return;


    // Event давхар холбогдохоос хамгаалах

    app.removeEventListener(

        "click",

        handleCartClick

    );


    app.addEventListener(

        "click",

        handleCartClick

    );


    window.removeEventListener(

        "cartchange",

        updateCartUI

    );


    window.addEventListener(

        "cartchange",

        updateCartUI

    );


    updateCartUI();

}


// ========================================
// HANDLE CLICK
// ========================================

function handleCartClick(event) {

    const button = event.target.closest(

        "[data-cart-code]"

    );

    if (!button) return;


    event.preventDefault();


    const code = button.dataset.cartCode;

    if (!code) return;


    toggleCart(code);

}


// ========================================
// UPDATE CART UI
// ========================================

function updateCartUI() {

    updateCartButtons();

    updateCartCount();

}
