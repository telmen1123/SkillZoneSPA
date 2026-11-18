let imageMap = {};

let isLoaded = false;

const IMAGE_DATA_URL = new URL(
    "../../data/images.json",
    import.meta.url
);

const SRC_URL = new URL(
    "../../",
    import.meta.url
);


// Сургалтын код стандартчилах
function normalizeCode(code) {

    return String(code ?? "")
        .trim()
        .toUpperCase();

}


// Зургийн зам тохируулах
function normalizeImage(image) {

    let path = typeof image === "string"
        ? image
        : image?.url ?? image?.src ?? image?.path ?? image?.filename;

    if (!path) return null;

    path = path.trim().replaceAll("\\", "/");

    if (/^https?:\/\//i.test(path)) {

        return path;

    }

    path = path
        .replace(/^(\.\/|\/)+/, "")
        .replace(/^src\//, "");

    if (!path.includes("/")) {

        path = `img/courses/${path}`;

    }

    return new URL(path, SRC_URL).href;

}


// JSON өгөгдөл ачаалах
export async function loadImages() {

    if (isLoaded) {

        return imageMap;

    }

    const response = await fetch(
        IMAGE_DATA_URL,
        { cache: "no-store" }
    );

    if (!response.ok) {

        throw new Error(
            `Failed to load images.json: ${response.status}`
        );

    }

    const data = await response.json();

    console.log("Original images.json:", data);

    const source = data.images
        ?? data.courses
        ?? data;

    imageMap = {};

    for (const [key, value] of Object.entries(source)) {

        const code = normalizeCode(
            value?.courseCode
            ?? value?.course_code
            ?? value?.code
            ?? value?.id
            ?? key
        );

        const images = Array.isArray(value)
            ? value
            : value?.images ?? [value];

        imageMap[code] = images
            .map(normalizeImage)
            .filter(Boolean);

    }

    isLoaded = true;

    console.log("SkillZone image map:", imageMap);

    console.info(
        `SkillZone: ${Object.keys(imageMap).length} сургалтын зураг ачааллаа.`
    );

    console.info(
        `Нийт зураг: ${getTotalImages()}`
    );

    return imageMap;

}


// Сургалтын кодоор зураг авах
export function getImagesByCourseCode(courseCode) {

    const code = normalizeCode(courseCode);

    return imageMap[code] ?? [];

}


// Үндсэн зураг авах
export function getCourseCover(courseCode) {

    return getImagesByCourseCode(courseCode)[0]
        ?? null;

}


// Зурагтай эсэхийг шалгах
export function hasCourseImages(courseCode) {

    return getImagesByCourseCode(courseCode).length > 0;

}


// Нийт зургийн тоо
export function getTotalImages() {

    return Object.values(imageMap).reduce(
        (total, images) => total + images.length,
        0
    );

}