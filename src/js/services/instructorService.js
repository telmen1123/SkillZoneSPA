
import { getCourses } from "./courseService.js";


export async function getInstructors() {

    const courses = await getCourses();

    const instructorMap = new Map();

    courses.forEach(course => {

        const name = String(
            course.instructor ?? ""
        ).trim();

        if (!name) return;


        // Шинэ багш бүртгэх

        if (!instructorMap.has(name)) {

            instructorMap.set(name, {

                name: name,

                categories: new Set(),

                courses: [],

                students: 0,

                totalRating: 0,

                rating: 0

            });

        }


        const instructor =
            instructorMap.get(name);


        // Сургалтуудыг нэгтгэх

        instructor.courses.push(course);

        if (course.category) {

            instructor.categories.add(
                course.category
            );

        }

        instructor.students +=
            Number(course.students ?? 0);

        instructor.totalRating +=
            Number(course.rating ?? 0);

    });


    // Багш нарын жагсаалт үүсгэх

    return Array.from(
        instructorMap.values()
    ).map(instructor => ({

        name: instructor.name,

        categories: [
            ...instructor.categories
        ],

        courses: instructor.courses,

        courseCount:
            instructor.courses.length,

        students: instructor.students,

        rating:
            instructor.totalRating /
            instructor.courses.length

    }));

}
