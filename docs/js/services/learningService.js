import {
    getCurrentUser
} from "./authService.js";


const STORAGE_KEY = "skillzone-learning";


// STORAGE KEY

function getStorageKey() {

    const user = getCurrentUser();

    return user

        ? `${STORAGE_KEY}-${user.id}`

        : null;

}


// GET LEARNING DATA

export function getLearningData() {

    const key = getStorageKey();

    if (!key) return [];

    try {

        const data = JSON.parse(
            localStorage.getItem(key) ?? "[]"
        );

        return Array.isArray(data)

            ? data

            : [];

    } catch (error) {

        console.error("Learning error:", error);

        return [];

    }

}


// SAVE LEARNING DATA

function saveLearningData(data) {

    const key = getStorageKey();

    if (!key) return false;

    localStorage.setItem(

        key,

        JSON.stringify(data)

    );


    window.dispatchEvent(

        new CustomEvent("learningchange")

    );


    return true;

}


// DATE KEY

function dateKey(date = new Date()) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


// ENROLL COURSE

export function enrollCourse(
    courseId,
    totalLessons
) {

    if (!getStorageKey()) return false;

    const id = String(courseId ?? "").trim();

    const total = Number(totalLessons);


    if (
        !id ||
        !Number.isInteger(total) ||
        total < 1
    ) {

        return false;

    }


    const data = getLearningData();


    const exists = data.some(

        item => item.courseId === id

    );


    if (exists) return false;


    data.push({

        courseId: id,

        totalLessons: total,

        completedLessons: 0,

        studyMinutes: 0,

        activity: {},

        enrolledAt: new Date().toISOString(),

        updatedAt: null,

        completedAt: null

    });


    return saveLearningData(data);

}


// GET LEARNING COURSE

export function getLearningCourse(courseId) {

    return getLearningData().find(

        item => item.courseId === String(courseId)

    ) ?? null;

}


// CHECK ENROLLMENT

export function isEnrolled(courseId) {

    return getLearningCourse(courseId) !== null;

}


// UPDATE PROGRESS

export function updateProgress(
    courseId,
    completedLessons,
    minutes = 0
) {

    const data = getLearningData();

    const course = data.find(

        item => item.courseId === String(courseId)

    );


    if (!course) return false;


    const lessons = Number(completedLessons);

    const time = Number(minutes);


    if (
        !Number.isFinite(lessons) ||
        !Number.isFinite(time)
    ) {

        return false;

    }


    course.completedLessons = Math.min(

        course.totalLessons,

        Math.max(0, Math.floor(lessons))

    );


    const studyTime = Math.max(

        0,

        Math.floor(time)

    );


    course.studyMinutes =

        (Number(course.studyMinutes) || 0) + studyTime;


    const today = dateKey();


    course.activity ??= {};


    course.activity[today] =

        (course.activity[today] ?? 0) + studyTime;


    course.updatedAt = new Date().toISOString();


    if (
        course.completedLessons >= course.totalLessons
    ) {

        course.completedAt ??=

            new Date().toISOString();

    } else {

        course.completedAt = null;

    }


    return saveLearningData(data);

}


// COMPLETE LESSON

export function completeLesson(
    courseId,
    lessonId,
    minutes = 0
) {

    const course = getLearningCourse(courseId);

    if (!course) return false;


    const id = Number(lessonId);


    if (
        !Number.isInteger(id) ||
        id < 1 ||
        id > course.totalLessons
    ) {

        return false;

    }


    // Already completed

    if (id <= course.completedLessons) {

        return false;

    }


    // Complete lessons in order

    if (id !== course.completedLessons + 1) {

        return false;

    }


    const success = updateProgress(

        courseId,

        id,

        minutes

    );


    // CREATE AUTOMATIC NOTIFICATION

    if (success) {

        window.dispatchEvent(

            new CustomEvent("lessoncompleted", {

                detail: {

                    courseId: String(courseId),

                    lessonId: id,

                    completedCourse:

                        id === course.totalLessons

                }

            })

        );

    }


    return success;

}


// CHECK LESSON COMPLETION

export function isLessonCompleted(
    courseId,
    lessonId
) {

    const course = getLearningCourse(courseId);

    if (!course) return false;

    const id = Number(lessonId);

    return (

        Number.isInteger(id) &&

        id >= 1 &&

        id <= course.completedLessons

    );

}


// CHECK COURSE COMPLETION

export function isCourseCompleted(courseId) {

    const course = getLearningCourse(courseId);

    if (!course) return false;

    return (

        course.totalLessons > 0 &&

        course.completedLessons >= course.totalLessons

    );

}


// GET NEXT LESSON

export function getNextLesson(courseId) {

    const course = getLearningCourse(courseId);

    if (!course) return 1;


    return Math.min(

        course.completedLessons + 1,

        course.totalLessons

    );

}


// GET PROGRESS

export function getProgress(course) {

    if (!course?.totalLessons) return 0;


    if (
        course.completedLessons >= course.totalLessons
    ) {

        return 100;

    }


    return Math.min(

        99,

        Math.max(

            0,

            Math.round(

                course.completedLessons /
                course.totalLessons * 100

            )

        )

    );

}


// GET COMPLETED COURSES

export function getCompletedCourses() {

    return getLearningData().filter(

        course =>

            course.totalLessons > 0 &&

            course.completedLessons >= course.totalLessons

    );

}


// GET LEARNING STATISTICS

export function getLearningStats() {

    const data = getLearningData();


    const completed = data.filter(

        item =>

            item.totalLessons > 0 &&

            item.completedLessons >= item.totalLessons

    ).length;


    const inProgress = data.filter(

        item =>

            item.completedLessons > 0 &&

            item.completedLessons < item.totalLessons

    ).length;


    const totalMinutes = data.reduce(

        (sum, item) =>

            sum + (Number(item.studyMinutes) || 0),

        0

    );


    const totalLessons = data.reduce(

        (sum, item) =>

            sum + (Number(item.totalLessons) || 0),

        0

    );


    const completedLessons = data.reduce(

        (sum, item) =>

            sum + (Number(item.completedLessons) || 0),

        0

    );


    return {

        total: data.length,

        completed,

        inProgress,

        notStarted:

            data.length - completed - inProgress,

        hours:

            Math.round(totalMinutes / 60 * 10) / 10,

        progress: totalLessons

            ? completedLessons >= totalLessons

                ? 100

                : Math.min(
                    99,
                    Math.round(
                        completedLessons / totalLessons * 100
                    )
                )

            : 0,

        certificates: completed

    };

}


// WEEKLY ACTIVITY

export function getWeeklyActivity() {

    const data = getLearningData();


    return Array.from(

        { length: 7 },

        (_, index) => {

            const date = new Date();


            date.setDate(

                date.getDate() - (6 - index)

            );


            const key = dateKey(date);


            const minutes = data.reduce(

                (sum, course) =>

                    sum + (
                        Number(course.activity?.[key]) || 0
                    ),

                0

            );


            return {

                date: key,

                hours:

                    Math.round(minutes / 60 * 10) / 10

            };

        }

    );

}


// CONTINUE LEARNING

export function getContinueLearning() {

    return getLearningData()

        .filter(

            course =>

                course.completedLessons < course.totalLessons

        )

        .sort(

            (a, b) =>

                new Date(b.updatedAt ?? b.enrolledAt) -

                new Date(a.updatedAt ?? a.enrolledAt)

        );

}