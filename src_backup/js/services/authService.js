const USERS_KEY = "skillzone-users";
const SESSION_KEY = "skillzone-session";


// GET USERS

export function getUsers() {

    try {

        const users = JSON.parse(
            localStorage.getItem(USERS_KEY) ?? "[]"
        );

        return Array.isArray(users) ? users : [];

    } catch (error) {

        console.error("Users error:", error);

        return [];

    }

}


// SAVE USERS

function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


// HASH PASSWORD

async function hashPassword(password, salt) {

    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    const hash = await crypto.subtle.deriveBits({

        name: "PBKDF2",
        salt: encoder.encode(salt),
        iterations: 600000,
        hash: "SHA-256"

    }, key, 256);

    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

}


// PUBLIC USER

function publicUser(user) {

    return {

        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        profession: user.profession ?? "",
        bio: user.bio ?? "",
        avatar: user.avatar ?? "",
        createdAt: user.createdAt

    };

}


// SAVE SESSION

function saveSession(user) {

    localStorage.setItem(

        SESSION_KEY,

        JSON.stringify({
            userId: user.id
        })

    );

    window.dispatchEvent(

        new CustomEvent("authchange", {

            detail: {
                user: publicUser(user)
            }

        })

    );

}


// REGISTER

export async function registerUser({
    name,
    email,
    password
}) {

    const fullName = String(name ?? "").trim();

    const normalizedEmail = String(email ?? "")
        .trim()
        .toLowerCase();

    password = String(password ?? "");

    if (fullName.length < 2) {

        return {
            success: false,
            error: "INVALID_NAME"
        };

    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {

        return {
            success: false,
            error: "INVALID_EMAIL"
        };

    }

    if (password.length < 8) {

        return {
            success: false,
            error: "WEAK_PASSWORD"
        };

    }

    const salt = crypto.randomUUID();

    const passwordHash = await hashPassword(
        password,
        salt
    );

    const users = getUsers();

    if (users.some(
        user => user.email === normalizedEmail
    )) {

        return {
            success: false,
            error: "EMAIL_EXISTS"
        };

    }

    const newUser = {

        id: crypto.randomUUID(),

        name: fullName,

        email: normalizedEmail,

        salt,

        passwordHash,

        phone: "",

        profession: "",

        bio: "",

        avatar: "",

        createdAt: new Date().toISOString()

    };

    users.push(newUser);

    saveUsers(users);

    saveSession(newUser);

    return {

        success: true,

        user: publicUser(newUser)

    };

}


// LOGIN

export async function loginUser({
    email,
    password
}) {

    const normalizedEmail = String(email ?? "")
        .trim()
        .toLowerCase();

    password = String(password ?? "");

    const user = getUsers().find(
        item => item.email === normalizedEmail
    );

    if (!user) {

        return {
            success: false,
            error: "INVALID_CREDENTIALS"
        };

    }

    const passwordHash = await hashPassword(
        password,
        user.salt
    );

    if (passwordHash !== user.passwordHash) {

        return {
            success: false,
            error: "INVALID_CREDENTIALS"
        };

    }

    saveSession(user);

    return {

        success: true,

        user: publicUser(user)

    };

}


// CURRENT USER

export function getCurrentUser() {

    try {

        const session = JSON.parse(

            localStorage.getItem(SESSION_KEY) ?? "null"

        );

        if (!session?.userId) return null;

        const user = getUsers().find(

            item => item.id === session.userId

        );

        return user ? publicUser(user) : null;

    } catch (error) {

        console.error("Session error:", error);

        return null;

    }

}


// AUTHENTICATION

export function isAuthenticated() {

    return getCurrentUser() !== null;

}


// LOGOUT

export function logoutUser() {

    localStorage.removeItem(SESSION_KEY);

    window.dispatchEvent(

        new CustomEvent("authchange", {

            detail: {
                user: null
            }

        })

    );

}


// UPDATE PROFILE

export function updateProfile(data) {

    const current = getCurrentUser();

    if (!current) {

        return {
            success: false,
            error: "NOT_AUTHENTICATED"
        };

    }

    const users = getUsers();

    const user = users.find(
        item => item.id === current.id
    );

    if (!user) {

        return {
            success: false,
            error: "NOT_AUTHENTICATED"
        };

    }

    const name = String(
        data.name ?? user.name
    ).trim();

    if (name.length < 2 || name.length > 80) {

        return {
            success: false,
            error: "INVALID_NAME"
        };

    }

    user.name = name;

    user.phone = String(
        data.phone ?? user.phone ?? ""
    ).trim().slice(0, 30);

    user.profession = String(
        data.profession ?? user.profession ?? ""
    ).trim().slice(0, 100);

    user.bio = String(
        data.bio ?? user.bio ?? ""
    ).trim().slice(0, 500);

    try {

        saveUsers(users);

        saveSession(user);

        return {

            success: true,

            user: publicUser(user)

        };

    } catch (error) {

        return {
            success: false,
            error: "STORAGE_ERROR"
        };

    }

}


// UPDATE AVATAR

export function updateAvatar(avatar) {

    const current = getCurrentUser();

    if (!current) {

        return {
            success: false,
            error: "NOT_AUTHENTICATED"
        };

    }

    avatar = String(avatar ?? "");

    if (
        avatar !== "" &&
        (
            !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(avatar) ||
            avatar.length > 2800000
        )
    ) {

        return {
            success: false,
            error: "INVALID_AVATAR"
        };

    }

    const users = getUsers();

    const user = users.find(
        item => item.id === current.id
    );

    if (!user) {

        return {
            success: false,
            error: "NOT_AUTHENTICATED"
        };

    }

    user.avatar = avatar;

    try {

        saveUsers(users);

        saveSession(user);

        return {
            success: true,
            user: publicUser(user)
        };

    } catch (error) {

        return {
            success: false,
            error: "STORAGE_ERROR"
        };

    }

}


// CHANGE PASSWORD

export async function changePassword(
    currentPassword,
    newPassword
) {

    const current = getCurrentUser();

    if (!current) {

        return {
            success: false,
            error: "NOT_AUTHENTICATED"
        };

    }

    currentPassword = String(currentPassword ?? "");

    newPassword = String(newPassword ?? "");

    if (newPassword.length < 8) {

        return {
            success: false,
            error: "WEAK_PASSWORD"
        };

    }

    const user = getUsers().find(
        item => item.id === current.id
    );

    if (!user) {

        return {
            success: false,
            error: "NOT_AUTHENTICATED"
        };

    }

    const oldHash = await hashPassword(
        currentPassword,
        user.salt
    );

    if (oldHash !== user.passwordHash) {

        return {
            success: false,
            error: "INVALID_PASSWORD"
        };

    }

    if (currentPassword === newPassword) {

        return {
            success: false,
            error: "SAME_PASSWORD"
        };

    }

    const salt = crypto.randomUUID();

    const passwordHash = await hashPassword(
        newPassword,
        salt
    );

    if (getCurrentUser()?.id !== current.id) {

        return {
            success: false,
            error: "NOT_AUTHENTICATED"
        };

    }

    const users = getUsers();

    const latestUser = users.find(
        item => item.id === current.id
    );

    if (
        !latestUser ||
        latestUser.passwordHash !== oldHash
    ) {

        return {
            success: false,
            error: "INVALID_PASSWORD"
        };

    }

    latestUser.salt = salt;

    latestUser.passwordHash = passwordHash;

    try {

        saveUsers(users);

        return {
            success: true
        };

    } catch (error) {

        return {
            success: false,
            error: "STORAGE_ERROR"
        };

    }

}