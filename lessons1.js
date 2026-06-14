// lessons.js

const params = new URLSearchParams(window.location.search);

const classNumber = params.get("class");
const subjectCode = params.get("subject");

Promise.all([
  fetch("./data/subjects.json").then((r) => r.json()),
  fetch(`./data/${classNumber}/${subjectCode}.json`).then((r) => r.json()),
])
  .then(([subjects, lessons]) => {
    const subject = subjects.find((s) => s.code === subjectCode);

    document.getElementById("pageTitle").textContent =
      `${subject.icon} ${subject.title} · ${classNumber} класс`;

    document.getElementById("subjectName").textContent = subject.title;

    if (lessons.length > 0) {
      document.getElementById("bookPl").textContent =
        "📖 " + (lessons[0].book?.pl || "");

      document.getElementById("bookUa").textContent =
        "📖 " + (lessons[0].book?.ua || "");
    }

    document.getElementById("classLink").href =
      `subjects.html?class=${classNumber}`;

    document.getElementById("classLink").textContent = `${classNumber} класс`;

    renderLessons(lessons);
  })
  .catch((error) => {
    console.error(error);
  });

function renderLessons(lessons) {
  const tbody = document.getElementById("lessonsBody");

  tbody.innerHTML = "";

  lessons.forEach((lesson) => {
    const isEnglishSection = typeof lesson.section === "object";

    const sectionTitle = isEnglishSection
      ? lesson.section.tema || ""
      : lesson.section || "";

    const englishInfo = isEnglishSection
      ? `

        ${
          lesson.section.words?.length
            ? `
            <div class="lesson-extra">
              <small>
                <b>Words:</b><br>
                ${lesson.section.words.join(", ")}
              </small>
            </div>
            `
            : ""
        }

        ${
          lesson.section.phrases?.length
            ? `
            <div class="lesson-extra">
              <small>
                <b>Phrases:</b><br>
                ${lesson.section.phrases.join("<br>")}
              </small>
            </div>
            `
            : ""
        }

        ${
          lesson.section.speaking?.length
            ? `
            <div class="lesson-extra">
              <small>
                <b>Speaking:</b><br>
                ${lesson.section.speaking.join("<br>")}
              </small>
            </div>
            `
            : ""
        }

        ${
          lesson.section.grammar?.length
            ? `
            <div class="lesson-extra">
              <small>
                <b>Grammar:</b><br>
                ${lesson.section.grammar.join(", ")}
              </small>
            </div>
            `
            : ""
        }

        `
      : "";

    tbody.innerHTML += `

      <tr>

        <td>${lesson.id || ""}</td>

        <td>${lesson.book || ""}</td>

        <td>
          <strong>${sectionTitle}</strong>
        </td>

        <td>

          <strong>
            ${lesson.title_pl || ""}
          </strong>

          ${lesson.title_ua ? `<br>${lesson.title_ua}` : ""}

          ${englishInfo}

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
