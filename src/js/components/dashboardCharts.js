
import {
    getLearningStats,
    getWeeklyActivity
} from "../services/learningService.js";

import { getLanguage } from "../i18n/i18n.js";

let weeklyChart = null;
let progressChart = null;

function lang(mn, en) {
    return getLanguage() === "mn" ? mn : en;
}


// Chart устгах

export function destroyDashboardCharts() {
    weeklyChart?.destroy();
    progressChart?.destroy();

    weeklyChart = null;
    progressChart = null;
}


// Chart үүсгэх

export function renderDashboardCharts() {

    destroyDashboardCharts();

    const weeklyCanvas = document.getElementById(
        "weeklyLearningChart"
    );

    const progressCanvas = document.getElementById(
        "learningProgressChart"
    );

    if (!weeklyCanvas || !progressCanvas) return;

    if (!window.Chart) {
        document.querySelectorAll(".dashboard-chart-area")
            .forEach(area => {
                area.textContent = lang(
                    "График ачаалагдсангүй.",
                    "Chart could not be loaded."
                );
            });

        return;
    }

    const dark = document.documentElement.dataset.theme === "dark";
    const axisColor = dark ? "#a0aec0" : "#667085";
    const gridColor = dark ? "#2c3950" : "#edf1f7";
    const emptyColor = dark ? "#30415b" : "#e4e7ec";

    const stats = getLearningStats();
    const weekly = getWeeklyActivity();

    const labels = weekly.map(item =>
        new Date(`${item.date}T00:00:00`)
            .toLocaleDateString(
                getLanguage() === "mn"
                    ? "mn-MN"
                    : "en-US",
                { weekday: "short" }
            )
    );


    // BAR CHART

    weeklyChart = new window.Chart(weeklyCanvas, {
        type: "bar",

        data: {
            labels,

            datasets: [{
                label: lang("Суралцсан цаг", "Study hours"),

                data: weekly.map(item => item.hours),

                backgroundColor: weekly.map(
                    (_, index) =>
                        index === weekly.length - 1
                            ? "#1455ff"
                            : "#b8ceff"
                ),

                hoverBackgroundColor: "#1455ff",

                borderRadius: 7,
                borderSkipped: false,
                maxBarThickness: 35
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    displayColors: false,
                    padding: 12,
                    callbacks: {
                        label: context =>
                            `${context.parsed.y} ${lang("цаг", "hours")}`
                    }
                }
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: axisColor
                    }
                },

                y: {
                    beginAtZero: true,
                    suggestedMax: 4,

                    border: {
                        display: false
                    },

                    grid: {
                        color: gridColor
                    },

                    ticks: {
                        color: axisColor,

                        callback: value =>
                            `${value}${lang("ц", "h")}`
                    }
                }
            }
        }
    });


    // DOUGHNUT CHART

    const hasCourses = stats.total > 0;

    progressChart = new window.Chart(progressCanvas, {
        type: "doughnut",

        data: {
            labels: [
                lang("Дуусгасан", "Completed"),
                lang("Суралцаж байгаа", "In progress"),
                lang("Эхлээгүй", "Not started")
            ],

            datasets: [{
                data: hasCourses
                    ? [
                        stats.completed,
                        stats.inProgress,
                        stats.notStarted
                    ]
                    : [0, 0, 1],

                backgroundColor: hasCourses
                    ? ["#10b981", "#1455ff", emptyColor]
                    : [emptyColor, emptyColor, emptyColor],

                borderWidth: 0,
                hoverOffset: 5,
                borderRadius: hasCourses ? 4 : 0
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "78%",

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    enabled: hasCourses
                }
            }
        }
    });

}

window.addEventListener("themechange", () => {
    if (document.getElementById("weeklyLearningChart") &&
        document.getElementById("learningProgressChart")) {
        renderDashboardCharts();
    }
});
