const params = new URLSearchParams(window.location.search);

const classNumber = params.get("class");
const subjectCode = params.get("subject");

/* ==========================================
ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
========================================== */

function getBook(lesson) {
if (!lesson.book) return "";


return typeof lesson.book === "object"
    ? lesson.book.pl || ""
    : lesson.book;

}

function getSection(lesson) {
if (lesson.chapter?.pl) {
    return lesson.chapter.pl;
}

if (
    lesson.section &&
    typeof lesson.section === "object"
) {
    return lesson.section.tema || "";
}

return lesson.section || "";

}

function getTitlePL(lesson) {
if (lesson.title?.pl) {
    return lesson.title.pl;
}

return lesson.title_pl || "";

}

function getTitleUA(lesson) {
if (lesson.title?.ua) {
    return lesson.title.ua;
}

return lesson.title_ua || "";

}

/* ==========================================
ЗАГРУЗКА ДАННЫХ
========================================== */

Promise.all([
fetch("./data/subjects.json")
    .then(response => response.json()),

fetch(
    `./data/${classNumber}/${subjectCode}.json`
).then(response => response.json())

])

.then(([subjects, lessons]) => {
const subject =
    subjects.find(
        s => s.code === subjectCode
    );

if (subject) {

    document.getElementById(
        "pageTitle"
    ).textContent =
        `${subject.icon} ${subject.title} · ${classNumber} класс`;

    document.getElementById(
        "subjectName"
    ).textContent =
        subject.title;
}

if (lessons.length > 0) {

    const firstLesson = lessons[0];

    document.getElementById("bookPl").textContent =
        "📖 " + (firstLesson.book?.pl || "");

    document.getElementById("bookUa").textContent =
        "📖 " + (firstLesson.book?.ua || "");
}

document.getElementById(
    "classLink"
).href =
    `subjects.html?class=${classNumber}`;

document.getElementById(
    "classLink"
).textContent =
    `${classNumber} класс`;

renderLessons(lessons);

})

.catch(error => {
console.error(
    "Ошибка загрузки:",
    error
);

});

/* ==========================================
ОТРИСОВКА УРОКОВ
========================================== */

function renderLessons(lessons) {

    const tbody =
        document.getElementById("lessonsBody");

    tbody.innerHTML = "";

    lessons.forEach(lesson => {

        const chapterPl =
            lesson.chapter?.pl || "";

        const chapterUa =
            lesson.chapter?.ua || "";

        const titlePl =
            lesson.title?.pl || "";

        const titleUa =
            lesson.title?.ua || "";

        const keywords =
            lesson.keywords?.join(", ") || "";

        const learningGoals =

            lesson.learningGoals?.length

                ? lesson.learningGoals
                    .map(goal =>
                        `• ${goal.ua}`
                    )
                    .join("<br>")

                : "";

        tbody.innerHTML += `

        <tr>

            <td>
                ${lesson.id || ""}
            </td>

            <td>

                <strong>
                    ${chapterPl}
                </strong>

                ${
                    chapterUa
                        ? `<br>${chapterUa}`
                        : ""
                }

            </td>

            <td>

                <strong>
                    ${titlePl}
                </strong>

                ${
                    titleUa
                        ? `<br>${titleUa}`
                        : ""
                }

            </td>

            <td>
                ${keywords}
            </td>

            <td>
                ${learningGoals}
            </td>

            <td>

                <span
                    class="status status-${lesson.status || "PLAN"}"
                >
                    ${lesson.status || "PLAN"}
                </span>

            </td>

            <td>

                ${
                    lesson.url

                        ? `
                        <a
                            href="${lesson.url}"
                            target="_blank"
                            class="open-btn"
                        >
                            Открыть
                        </a>
                        `

                        : `
                        <span class="disabled-btn">
                            —
                        </span>
                        `
                }

            </td>

        </tr>

        `;

    });

}
