
import {
    getImagesByCourseCode
} from "../services/imageService.js";

import {
    getLanguage
} from "../i18n/i18n.js";


let slideshowImages = [];

let currentIndex = 0;

let imageModalEventsBound = false;

let zoomLevel = 1;

let translateX = 0;

let translateY = 0;

let isDragging = false;

let startX = 0;

let startY = 0;

let previousFocus = null;


// Хэлний тохиргоо
function lang(mn, en) {

    return getLanguage() === "mn" ? mn : en;

}


// ==============================
// 2. Render image modal
// ==============================

export function renderImageModal() {

    return `

        <div id="imageModal"
             class="modal"
             role="dialog"
             aria-modal="true"
             aria-labelledby="modalImgTitle"
             aria-hidden="true">

            <div class="modal-background"
                 id="modalBg">
            </div>

            <div class="modal-card image-modal-card">

                <header class="modal-card-head">

                    <p class="modal-card-title"
                       id="modalImgTitle">
                    </p>

                    <button
                        class="button is-small mr-2"
                        id="fullscreenBtn"
                        type="button"
                        title="${lang(
                            "Бүтэн дэлгэц",
                            "Fullscreen"
                        )}">

                        <i class="fa-solid fa-expand"></i>

                    </button>

                    <button
                        class="delete"
                        id="closeImgModalBtn"
                        type="button"
                        aria-label="${lang("Хаах", "Close")}">
                    </button>

                </header>

                <section class="modal-card-body
                                has-text-centered">

                    <div class="image-viewport">

                        <img
                            id="slideshowImage"
                            class="modal-slideshow-image zoomable-image"
                            draggable="false"
                            alt="">

                    </div>

                    <p id="imageCounter"
                       class="has-text-grey mt-3">
                    </p>

                    <div class="buttons is-centered mt-3">

                        <button
                            class="button is-primary"
                            id="prevImageBtn"
                            type="button"
                            aria-label="${lang("Өмнөх зураг", "Previous image")}">

                            <i class="fa-solid fa-chevron-left"></i>

                        </button>

                        <button
                            class="button"
                            id="zoomOutBtn"
                            type="button"
                            aria-label="${lang("Жижигрүүлэх", "Zoom out")}">

                            <i class="fa-solid fa-magnifying-glass-minus"></i>

                        </button>

                        <button
                            class="button"
                            id="resetZoomBtn"
                            type="button">

                            100%

                        </button>

                        <button
                            class="button"
                            id="zoomInBtn"
                            type="button"
                            aria-label="${lang("Томруулах", "Zoom in")}">

                            <i class="fa-solid fa-magnifying-glass-plus"></i>

                        </button>

                        <button
                            class="button is-primary"
                            id="nextImageBtn"
                            type="button"
                            aria-label="${lang("Дараагийн зураг", "Next image")}">

                            <i class="fa-solid fa-chevron-right"></i>

                        </button>

                    </div>

                </section>

            </div>

        </div>

    `;

}


// ==============================
// 3. Open image modal
// ==============================

export function showImages(courseCode, courseName) {

    slideshowImages = getImagesByCourseCode(

        courseCode

    );

    if (!slideshowImages.length) return;

    const modal = document.getElementById(
        "imageModal"
    );

    if (!modal) return;

    previousFocus = document.activeElement;

    currentIndex = 0;

    document.getElementById(
        "modalImgTitle"
    ).textContent = courseName;

    modal.classList.add("is-active");

    modal.setAttribute("aria-hidden", "false");

    document.documentElement.classList.add(
        "is-clipped"
    );

    updateImage();

    document.getElementById(
        "closeImgModalBtn"
    )?.focus();

}


// ==============================
// 4. Update image
// ==============================

function updateImage() {

    const image = document.getElementById(
        "slideshowImage"
    );

    const counter = document.getElementById(
        "imageCounter"
    );

    if (!image || !counter) return;

    image.src = slideshowImages[currentIndex];

    image.alt = document.getElementById(
        "modalImgTitle"
    ).textContent;

    counter.textContent =

        `${currentIndex + 1} / ${slideshowImages.length}`;

    document.getElementById(
        "prevImageBtn"
    ).disabled = slideshowImages.length <= 1;

    document.getElementById(
        "nextImageBtn"
    ).disabled = slideshowImages.length <= 1;

    resetZoom();

}


// ==============================
// 5. Previous and next image
// ==============================

function prevImage() {

    if (!slideshowImages.length) return;

    currentIndex = (

        currentIndex - 1 + slideshowImages.length

    ) % slideshowImages.length;

    updateImage();

}


function nextImage() {

    if (!slideshowImages.length) return;

    currentIndex = (

        currentIndex + 1

    ) % slideshowImages.length;

    updateImage();

}


// ==============================
// 6. Zoom image
// ==============================

function changeZoom(amount) {

    zoomLevel = Math.min(

        4,

        Math.max(1, zoomLevel + amount)

    );

    if (zoomLevel === 1) {

        translateX = 0;

        translateY = 0;

    }

    applyTransform();

}


function applyTransform() {

    const image = document.getElementById(
        "slideshowImage"
    );

    if (!image) return;

    image.style.transform = `

        translate(${translateX}px, ${translateY}px)

        scale(${zoomLevel})

    `;

    image.style.cursor = zoomLevel > 1

        ? "grab"

        : "default";

    const zoomBtn = document.getElementById(
        "resetZoomBtn"
    );

    if (zoomBtn) {

        zoomBtn.textContent =

            `${Math.round(zoomLevel * 100)}%`;

    }

}


function resetZoom() {

    zoomLevel = 1;

    translateX = 0;

    translateY = 0;

    isDragging = false;

    applyTransform();

}


// ==============================
// 7. Fullscreen mode
// ==============================

async function toggleFullscreen() {

    const modal = document.getElementById(
        "imageModal"
    );

    if (!modal) return;

    try {

        if (document.fullscreenElement) {

            await document.exitFullscreen();

        } else if (modal.requestFullscreen) {

            await modal.requestFullscreen();

        }

    } catch (error) {

        console.warn(
            "Fullscreen unavailable:",
            error
        );

    }

}


// ==============================
// 8. Close modal
// ==============================

function closeImgModal() {

    const modal = document.getElementById(
        "imageModal"
    );

    if (!modal?.classList.contains("is-active")) {

        return;

    }

    if (document.fullscreenElement === modal) {

        document.exitFullscreen().catch(
            console.warn
        );

    }

    modal.classList.remove("is-active");

    modal.setAttribute("aria-hidden", "true");

    document.documentElement.classList.remove(
        "is-clipped"
    );

    resetZoom();

    previousFocus?.focus();

}


// ==============================
// 9. Bind modal events
// ==============================

export function bindImageModalEvents() {

    if (imageModalEventsBound) return;

    imageModalEventsBound = true;


    // Button events

    document.addEventListener("click", event => {

        const target = event.target;

        if (!(target instanceof Element)) return;

        const openBtn = target.closest(
            ".open-image-btn"
        );

        if (openBtn) {

            showImages(

                openBtn.dataset.coursecode,

                openBtn.dataset.coursename

            );

            return;

        }

        const actions = {

            closeImgModalBtn: closeImgModal,

            modalBg: closeImgModal,

            prevImageBtn: prevImage,

            nextImageBtn: nextImage,

            zoomInBtn: () => changeZoom(0.25),

            zoomOutBtn: () => changeZoom(-0.25),

            resetZoomBtn: resetZoom,

            fullscreenBtn: toggleFullscreen

        };

        const button = target.closest("button, #modalBg");

        if (button && Object.hasOwn(actions, button.id)) {

            actions[button.id]();

        }

    });


    // Mouse wheel zoom

    document.addEventListener("wheel", event => {

        if (!event.target.closest?.(".image-viewport")) {

            return;

        }

        event.preventDefault();

        changeZoom(

            event.deltaY < 0 ? 0.25 : -0.25

        );

    }, { passive: false });


    // Drag start

    document.addEventListener("pointerdown", event => {

        const image = event.target.closest?.(
            "#slideshowImage"
        );

        if (!image || zoomLevel <= 1) return;

        event.preventDefault();

        isDragging = true;

        startX = event.clientX - translateX;

        startY = event.clientY - translateY;

        image.setPointerCapture(event.pointerId);

    });


    // Drag move

    document.addEventListener("pointermove", event => {

        if (!isDragging) return;

        translateX = event.clientX - startX;

        translateY = event.clientY - startY;

        applyTransform();

        const image = document.getElementById(
            "slideshowImage"
        );

        if (image) image.style.cursor = "grabbing";

    });


    // Drag end

    function stopDragging() {

        isDragging = false;

        applyTransform();

    }

    document.addEventListener(
        "pointerup",
        stopDragging
    );

    document.addEventListener(
        "pointercancel",
        stopDragging
    );


    // Keyboard controls

    document.addEventListener("keydown", event => {

        const modal = document.getElementById(
            "imageModal"
        );

        if (!modal?.classList.contains("is-active")) {

            return;

        }

        switch (event.key) {

            case "Escape":

                closeImgModal();

                break;

            case "ArrowLeft":

                event.preventDefault();

                prevImage();

                break;

            case "ArrowRight":

                event.preventDefault();

                nextImage();

                break;

            case "+":

                changeZoom(0.25);

                break;

            case "-":

                changeZoom(-0.25);

                break;

        }

    });


    // Route changed

    window.addEventListener(

        "hashchange",

        closeImgModal

    );

}
