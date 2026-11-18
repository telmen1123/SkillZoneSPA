
const BLOG_URL = new URL(
    "../../data/blogs.json",
    import.meta.url
);

let blogCache = null;

export async function getBlogs() {

    if (blogCache !== null) {
        return blogCache;
    }

    const response = await fetch(BLOG_URL);

    if (!response.ok) {
        throw new Error("Failed to load blogs");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error("Invalid blog data");
    }

    blogCache = data;

    return blogCache;

}

export async function getBlogById(id) {

    const blogs = await getBlogs();

    return blogs.find(
        blog => blog.id === id
    );

}
