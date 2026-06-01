
let allLessons = [];
let allSubjects = [];

/* ==========================
   ЗАГРУЗКА КАТАЛОГА
========================== */

async function loadCatalog() {
    try {

        const lessonsResponse =
            await fetch("./data/lessons.json");

        allLessons =
            await lessonsResponse.json();

        const subjectsResponse =
            await fetch("./data/subjects.json");

        allSubjects =
            await subjectsResponse.json();

        renderStats(allLessons);
        renderSubjects(allSubjects);
        renderLessons(allLessons);

        initFilters();

    } catch (error) {

        console.error(
            "Ошибка загрузки каталога:",
            error
        );
    }
}

/* ==========================
   СТАТИСТИКА
========================== */

function renderStats(lessons) {

    document.getElementById(
        "totalLessons"
    ).textContent =
        lessons.length;

    document.getElementById(
        "readyLessons"
    ).textContent =
        lessons.filter(
            lesson =>
                lesson.status === "READY"
        ).length;

    document.getElementById(
        "planLessons"
    ).textContent =
        lessons.filter(
            lesson =>
                lesson.status === "PLAN"
        ).length;
}

/* ==========================
   ПРЕДМЕТЫ
========================== */

function renderSubjects(subjects) {

    const container =
        document.getElementById(
            "subjectsContainer"
        );

    container.innerHTML = "";

    subjects.forEach(subject => {

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
                ${subject.name_ru}
            </h3>

            <p>
                ${subject.code}
            </p>

        </div>

        `;
    });
}

/* ==========================
   КАРТОЧКИ УРОКОВ
========================== */

function renderLessons(lessons) {

    const container =
        document.getElementById(
            "lessonsContainer"
        );

    container.innerHTML = "";

    lessons.forEach(lesson => {

        const subjectInfo =
            allSubjects.find(
                subject =>
                    subject.code ===
                    lesson.subject
            );

        container.innerHTML += `

        <div class="lesson-card">

            <div
                class="subject-badge"
                style="
                    background:
                    ${subjectInfo?.color || '#999'}
                "
            >
                ${subjectInfo?.icon || '📘'}
                ${lesson.subject}
            </div>

            <span class="lesson-id">
                ${lesson.id}
            </span>

            <h3>
                ${lesson.title_pl}
            </h3>

            <p>
                ${lesson.title_ua}
            </p>

            <p>
                Класс:
                ${lesson.class}
            </p>

            <p>
                Статус:
                ${lesson.status}
            </p>

            ${
                lesson.url
                    ? `
                <a
                    href="${lesson.url}"
                    target="_blank"
                    class="lesson-button"
                >
                    Открыть урок
                </a>
                `
                    : ""
            }

        </div>

        `;
    });
}

/* ==========================
   ФИЛЬТРЫ
========================== */

function initFilters() {

    const subjectSelect =
        document.getElementById(
            "subjectFilter"
        );

    allSubjects.forEach(subject => {

        subjectSelect.innerHTML += `

        <option
            value="${subject.code}"
        >
            ${subject.icon}
            ${subject.name_ru}
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

/* ==========================
   ПОИСК
========================== */

function filterLessons() {

    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase();

    const selectedClass =
        document.getElementById(
            "classFilter"
        ).value;

    const selectedSubject =
        document.getElementById(
            "subjectFilter"
        ).value;

    const filtered =
        allLessons.filter(
            lesson => {

                const matchesSearch =

                    lesson.title_pl
                        .toLowerCase()
                        .includes(search)

                    ||

                    lesson.title_ua
                        .toLowerCase()
                        .includes(search)

                    ||

                    lesson.id
                        .toLowerCase()
                        .includes(search);

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

/* ==========================
   СТАРТ
========================== */

loadCatalog();
