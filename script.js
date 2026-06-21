/* ==================================================
   EDUMOST CATALOG v2
   Универсальный каталог уроков - script.js
================================================== */

let allLessons = [];
let allSubjects = [];

/* ==================================================
   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
================================================== */

function getPL(field) {
    return field?.pl || "";
}

function getUA(field) {
    return field?.ua || "";
}

function getSubjectInfo(code) {
    return (
        allSubjects.find(
            subject => subject.code === code
        ) || {}
    );
}

/* ==================================================
   ЗАГРУЗКА ДАННЫХ
================================================== */

async function loadCatalog() {

    try {

        const lessonsResponse =
            await fetch(
                "./data/lessons.json"
            );

        allLessons =
            await lessonsResponse.json();

        const subjectsResponse =
            await fetch(
                "./data/subjects.json"
            );

        allSubjects =
            await subjectsResponse.json();

        renderStats();
        renderSubjects();
        renderLessons(allLessons);
        initFilters();

    } catch (error) {

        console.error(
            "Ошибка загрузки каталога:",
            error
        );

    }
}

/* ==================================================
   СТАТИСТИКА
================================================== */

function renderStats() {

    document.getElementById(
        "totalLessons"
    ).textContent =
        allLessons.length;

    document.getElementById(
        "readyLessons"
    ).textContent =
        allLessons.filter(
            lesson =>
                lesson.status === "READY"
        ).length;

    document.getElementById(
        "planLessons"
    ).textContent =
        allLessons.filter(
            lesson =>
                lesson.status === "PLAN"
        ).length;
}

/* ==================================================
   ПРЕДМЕТЫ
================================================== */

function renderSubjects() {

    const container =
        document.getElementById(
            "subjectsContainer"
        );

    container.innerHTML = "";

    allSubjects.forEach(subject => {

        container.innerHTML += `

        <div
            class="subject-card"
            style="
                border-top:
                6px solid
                ${subject.color}
            "
        >

            <h3>
                ${subject.icon}
                ${subject.name_pl}
            </h3>

            <p>
                ${subject.code}
            </p>

        </div>

        `;

    });
}

/* ==================================================
   КАРТОЧКИ УРОКОВ
================================================== */

function renderLessons(lessons) {

    const container =
        document.getElementById(
            "lessonsContainer"
        );

    container.innerHTML = "";

    if (!lessons.length) {

        container.innerHTML = `

        <div class="empty-state">
            Нічого не знайдено
        </div>

        `;

        return;
    }

    lessons.forEach(lesson => {

        const subject =
            getSubjectInfo(
                lesson.subject
            );

        const titlePL =
            getPL(
                lesson.title
            );

        const titleUA =
            getUA(
                lesson.title
            );

        const chapterPL =
            getPL(
                lesson.chapter
            );

        const chapterUA =
            getUA(
                lesson.chapter
            );

        const bookPL =
            getPL(
                lesson.book
            );

        const keywords =
            lesson.keywords?.length
                ? lesson.keywords.join(" • ")
                : "";

        const learningGoals =
            lesson.learningGoals?.length
                ? `
                <div class="lesson-goals">

                    <strong>
                        Учень повинен:
                    </strong>

                    <ul>

                        ${lesson.learningGoals
                            .slice(0, 4)
                            .map(
                                goal => `
                                <li>
                                    ${goal.ua}
                                </li>
                                `
                            )
                            .join("")
                        }

                    </ul>

                </div>
                `
                : "";

        container.innerHTML += `

        <div class="lesson-card">

            <div
                class="subject-badge"
                style="
                    background:
                    ${subject.color || "#999"}
                "
            >
                ${subject.icon || "📘"}
                ${subject.name_pl || lesson.subject}
            </div>

            <span class="lesson-id">
                ${lesson.id}
            </span>

            <h3>
                ${titlePL}
            </h3>

            <p class="lesson-title-ua">
                ${titleUA}
            </p>

            ${
                chapterPL
                    ? `
                    <div class="lesson-chapter">
                        📚
                        ${chapterPL}
                    </div>
                    `
                    : ""
            }

            ${
                chapterUA
                    ? `
                    <div class="lesson-chapter-ua">
                        ${chapterUA}
                    </div>
                    `
                    : ""
            }

            ${
                bookPL
                    ? `
                    <div class="lesson-book">
                        📖 ${bookPL}
                    </div>
                    `
                    : ""
            }

            ${
                keywords
                    ? `
                    <div class="lesson-keywords">
                        ${keywords}
                    </div>
                    `
                    : ""
            }

            ${learningGoals}

            <div class="lesson-meta">

                <span>
                    🎓 Клас:
                    ${lesson.class}
                </span>

                <span>
                    📌 Статус:
                    ${lesson.status}
                </span>

            </div>

            ${
                lesson.url
                    ? `
                    <a
                        href="${lesson.url}"
                        target="_blank"
                        class="lesson-button"
                    >
                        Відкрити урок
                    </a>
                    `
                    : ""
            }

        </div>

        `;

    });
}

/* ==================================================
   ФИЛЬТРЫ
================================================== */

function initFilters() {

    const subjectFilter =
        document.getElementById(
            "subjectFilter"
        );

    allSubjects.forEach(subject => {

        subjectFilter.innerHTML += `

        <option
            value="${subject.code}"
        >
            ${subject.icon}
            ${subject.name_pl}
        </option>

        `;

    });

    document
        .getElementById(
            "searchInput"
        )
        .addEventListener(
            "input",
            filterLessons
        );

    document
        .getElementById(
            "classFilter"
        )
        .addEventListener(
            "change",
            filterLessons
        );

    document
        .getElementById(
            "subjectFilter"
        )
        .addEventListener(
            "change",
            filterLessons
        );
}

/* ==================================================
   ПОИСК И ФИЛЬТРАЦИЯ
================================================== */

function filterLessons() {

    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase();

    const selectedClass =
        document
            .getElementById(
                "classFilter"
            )
            .value;

    const selectedSubject =
        document
            .getElementById(
                "subjectFilter"
            )
            .value;

    const filtered =
        allLessons.filter(
            lesson => {

                const titlePL =
                    getPL(
                        lesson.title
                    ).toLowerCase();

                const titleUA =
                    getUA(
                        lesson.title
                    ).toLowerCase();

                const keywords =
                    lesson.keywords
                        ?.join(" ")
                        .toLowerCase() || "";

                const matchesSearch =

                    titlePL.includes(search)

                    ||

                    titleUA.includes(search)

                    ||

                    lesson.id
                        .toLowerCase()
                        .includes(search)

                    ||

                    keywords.includes(search);

                const matchesClass =

                    !selectedClass ||

                    lesson.class ==
                        selectedClass;

                const matchesSubject =

                    !selectedSubject ||

                    lesson.subject ===
                        selectedSubject;

                return (

                    matchesSearch &&

                    matchesClass &&

                    matchesSubject

                );
            }
        );

    renderLessons(filtered);
}

/* ==================================================
   СТАРТ
================================================== */

loadCatalog();