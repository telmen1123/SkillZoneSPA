
const STORAGE_KEY = "skillzone-wishlist";




export function getWishlist() {

    try {

        const data = JSON.parse(
            localStorage.getItem(STORAGE_KEY) ?? "[]"
        );

        return Array.isArray(data) ? data : [];

    } catch (error) {

        console.error("Wishlist load error:", error);

        return [];

    }

}


// Дуртай сургалтуудыг хадгалах

function saveWishlist(wishlist) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(wishlist)
    );

    window.dispatchEvent(

        new CustomEvent("wishlistchange", {

            detail: {
                wishlist,
                count: wishlist.length
            }

        })

    );

}


// Сургалт хадгалагдсан эсэхийг шалгах

export function isInWishlist(courseCode) {

    const code = String(courseCode ?? "").trim();

    return getWishlist().includes(code);

}


// Дуртай сургалт нэмэх

export function addToWishlist(courseCode) {

    const code = String(courseCode ?? "").trim();

    if (!code) return false;

    const wishlist = getWishlist();

    if (wishlist.includes(code)) {

        return false;

    }

    wishlist.push(code);

    saveWishlist(wishlist);

    return true;

}


// Дуртай сургалт хасах

export function removeFromWishlist(courseCode) {

    const code = String(courseCode ?? "").trim();

    const wishlist = getWishlist().filter(
        item => item !== code
    );

    saveWishlist(wishlist);

}


// Нэмэх эсвэл хасах

export function toggleWishlist(courseCode) {

    if (isInWishlist(courseCode)) {

        removeFromWishlist(courseCode);

        return false;

    }

    return addToWishlist(courseCode);

}


// Нийт хадгалсан сургалтын тоо

export function getWishlistCount() {

    return getWishlist().length;

}


// Бүх хадгалсан сургалтыг устгах

export function clearWishlist() {

    saveWishlist([]);

}
