
import {
    getLanguage
} from "../i18n/i18n.js";


const LESSONS_URL = new URL(
    "../../data/lessons.json",
    import.meta.url
);

let cachedLessons = null;


// Language

function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}


// JSON өгөгдөл унших

export async function getLessonData() {

    if (cachedLessons) {
        return cachedLessons;
    }

    const response = await fetch(LESSONS_URL);

    if (!response.ok) {
        throw new Error("Unable to load lessons");
    }

    cachedLessons = await response.json();

    return cachedLessons;

}


// Сургалтын хичээлүүд

export async function getCourseLessons(
    courseId,
    totalLessons
) {

    const data = await getLessonData();

    const lessons = data[courseId] ?? [];

    const total = Math.max(
        0,
        Math.floor(Number(totalLessons) || 0)
    );

    return Array.from(
        { length: total },
        (_, index) => {

            const id = index + 1;

            const lesson = lessons.find(
                item => Number(item.id) === id
            );

            if (lesson) {
                return lesson;
            }

            return {

                id,

                title: {
                    mn: `Хичээл ${id}`,
                    en: `Lesson ${id}`
                },

                video: "./videos/demo.mp4",

                duration: 0,

                demo: true

            };

        }
    );

}


// Хичээл бүлэглэх

export function groupLessons(lessons) {

    const modules = [];

    const groupSize = 8;

    for (
        let index = 0;
        index < lessons.length;
        index += groupSize
    ) {

        const number = modules.length + 1;

        modules.push({

            id: number,

            title: lang(
                `${number}-р бүлэг`,
                `Module ${number}`
            ),

            lessons: lessons.slice(
                index,
                index + groupSize
            )

        });

    }

    return modules;

}
