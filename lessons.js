// lessons.js

const params = new URLSearchParams(window.location.search);

const classNumber = params.get("class");

const subjectCode = params.get("subject");

Promise.all([
  fetch("./data/subjects.json").then((r) => r.json()),

  fetch(`./data/${classNumber}/${subjectCode}.json`).then((r) => r.json()),
])

  .then(([subjects, lessons]) => {

    const subject =
        subjects.find(
            s => s.code === subjectCode
        );

    document.getElementById(
        "pageTitle"
    ).textContent =
        `${subject.icon} ${subject.title} · ${classNumber} класс`;

    document.getElementById(
        "subjectName"
    ).textContent =
        subject.title;

    document.getElementById(
        "classLink"
    ).href =
        `subjects.html?class=${classNumber}`;

    renderLessons(lessons);

})

  .catch((error) => {
    console.error(error);
  });

  

function renderLessons(lessons) {
  const tbody = document.getElementById("lessonsBody");

  tbody.innerHTML = "";

  lessons.forEach((lesson) => {
    tbody.innerHTML += `

        <tr>

            <td>${lesson.id}</td>

            <td>${lesson.book}</td>

            <td>${lesson.section}</td>

            <td>

                <strong>
                    ${lesson.title_pl}
                </strong>

                <br>

                ${lesson.title_ua}

            </td>

            <td>

                <span
                    class="status status-${lesson.status}"
                >
                    ${lesson.status}
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
            Открыть урок
        </a>
        `
        : `
        <span class="disabled-btn">
            Нет ссылки
        </span>
        `
    }

</td>

        </tr>

        `;
  });
}
