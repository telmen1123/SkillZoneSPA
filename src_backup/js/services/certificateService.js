import {
    getCurrentUser
} from "./authService.js";

import {
    getLearningData
} from "./learningService.js";


const STORAGE_KEY = "skillzone-certificates";


// Хэрэглэгчийн storage key

function getStorageKey() {

    const user = getCurrentUser();

    return user
        ? `${STORAGE_KEY}-${user.id}`
        : null;

}


// Сертификат авах

export function getCertificates() {

    const key = getStorageKey();

    if (!key) return [];

    try {

        const data = JSON.parse(
            localStorage.getItem(key) ?? "[]"
        );

        return Array.isArray(data) ? data : [];

    } catch (error) {

        console.error("Certificate error:", error);

        return [];

    }

}


// Сертификат хадгалах

function saveCertificates(certificates) {

    const key = getStorageKey();

    if (!key) return false;

    localStorage.setItem(
        key,
        JSON.stringify(certificates)
    );

    window.dispatchEvent(
        new CustomEvent("certificatechange")
    );

    return true;

}


// Сертификат үүсгэх

export function issueCertificate(courseId) {

    const user = getCurrentUser();

    if (!user) return null;

    const id = String(courseId);

    const record = getLearningData().find(
        item => item.courseId === id
    );

    if (
        !record ||
        record.totalLessons < 1 ||
        record.completedLessons < record.totalLessons
    ) {
        return null;
    }

    const certificates = getCertificates();

    const existing = certificates.find(
        item => item.courseId === id
    );

    if (existing) return existing;

    const certificate = {

        id: `SZ-CERT-${crypto.randomUUID().toUpperCase()}`,

        userId: user.id,

        studentName: user.name,

        courseId: id,

        issuedAt: new Date().toISOString(),

        completedAt:
            record.updatedAt ?? new Date().toISOString()

    };

    certificates.push(certificate);

    return saveCertificates(certificates)
        ? certificate
        : null;

}


// Дуусгасан бүх сургалтын сертификат

export function syncCertificates() {

    const records = getLearningData();

    records.forEach(record => {

        if (
            record.totalLessons > 0 &&
            record.completedLessons >= record.totalLessons
        ) {

            issueCertificate(record.courseId);

        }

    });

    return getCertificates();

}


// ID-аар сертификат авах

export function getCertificateById(id) {

    return getCertificates().find(
        item => item.id === id
    ) ?? null;

}


// Сертификатын тоо

export function getCertificateCount() {

    return getCertificates().length;

}