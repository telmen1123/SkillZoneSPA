
import fs from "node:fs";

import path from "node:path";

import { fileURLToPath } from "node:url";


// Үндсэн src хавтас
const srcDir = fileURLToPath(

    new URL("../", import.meta.url)

);


// Зураг байрлах хавтас
const imageDir = path.join(

    srcDir,

    "img",

    "courses"

);


// Өгөгдөл хадгалах хавтас
const outputDir = path.join(

    srcDir,

    "data"

);


// Үүсгэх JSON файл
const outputFile = path.join(

    outputDir,

    "images.json"

);


// Хавтас байхгүй бол үүсгэх
function ensureDirectoryExists(dirPath) {

    fs.mkdirSync(dirPath, {

        recursive: true

    });

}


// Зургийн өргөтгөл шалгах
function isImageFile(fileName) {

    return /\.(jpg|jpeg|png|webp|avif)$/i
        .test(fileName);

}


// Сургалтын код ялгаж авах
function extractCourseCode(fileName) {

    const match = fileName.match(

        /^(SZ\d{3})_\d{3}\.(jpg|jpeg|png|webp|avif)$/i

    );

    return match
        ? match[1].toUpperCase()
        : null;

}


// Зургийн map үүсгэх
function buildImageMap(files) {

    const imageMap = {};

    for (const file of files) {

        const courseCode = extractCourseCode(file);

        if (!courseCode) {

            console.warn(

                `Skipped invalid filename: ${file}`

            );

            continue;

        }

        imageMap[courseCode] ??= [];

        imageMap[courseCode].push(

            `img/courses/${file}`

        );

    }

    return imageMap;

}


// Үндсэн ажиллагаа
function main() {

    ensureDirectoryExists(imageDir);

    ensureDirectoryExists(outputDir);

    // Зургийн файлуудыг унших
    const files = fs.readdirSync(imageDir, {

        withFileTypes: true

    })

        .filter(file => file.isFile())

        .map(file => file.name)

        .filter(isImageFile)

        .sort();


    // Зургийн өгөгдөл үүсгэх
    const imageMap = buildImageMap(files);


    // JSON файлд хадгалах
    fs.writeFileSync(

        outputFile,

        JSON.stringify(imageMap, null, 4),

        "utf8"

    );


    const totalImages = Object.values(imageMap)

        .reduce(

            (total, images) => total + images.length,

            0

        );


    console.log("==============================");

    console.log("SkillZone Image Generator");

    console.log("==============================");

    console.log(

        `Total courses: ${Object.keys(imageMap).length}`

    );

    console.log(

        `Total images: ${totalImages}`

    );

    console.log("images.json generated successfully!");

}


main();
