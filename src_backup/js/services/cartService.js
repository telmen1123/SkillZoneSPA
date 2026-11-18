
const STORAGE_KEY = "skillzone-cart";

export function getCart() {

    try {

        const data = JSON.parse(
            localStorage.getItem(STORAGE_KEY) ?? "[]"
        );

        return Array.isArray(data) ? data : [];

    } catch (error) {

        console.error("Cart load error:", error);

        return [];

    }

}


// ========================================
// SAVE CART
// ========================================

function saveCart(cart) {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(cart)

    );


    window.dispatchEvent(

        new CustomEvent("cartchange", {

            detail: {
                cart,
                count: cart.length
            }

        })

    );

}


// ========================================
// CHECK COURSE
// ========================================

export function isInCart(courseCode) {

    return getCart().some(

        item => item === String(courseCode)

    );

}


// ========================================
// ADD TO CART
// ========================================

export function addToCart(courseCode) {

    const code = String(courseCode ?? "").trim();

    if (!code) return false;


    const cart = getCart();


    // Давхар сургалт нэмэхгүй

    if (cart.includes(code)) {

        return false;

    }


    cart.push(code);

    saveCart(cart);

    return true;

}


// ========================================
// REMOVE FROM CART
// ========================================

export function removeFromCart(courseCode) {

    const code = String(courseCode).trim();


    const cart = getCart().filter(

        item => item !== code

    );


    saveCart(cart);

}


// ========================================
// TOGGLE CART
// ========================================

export function toggleCart(courseCode) {

    if (isInCart(courseCode)) {

        removeFromCart(courseCode);

        return false;

    }


    return addToCart(courseCode);

}


// ========================================
// CART COUNT
// ========================================

export function getCartCount() {

    return getCart().length;

}


// ========================================
// CLEAR CART
// ========================================

export function clearCart() {

    saveCart([]);

}
