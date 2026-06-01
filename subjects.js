const params = new URLSearchParams(
    window.location.search
);

const classNumber =
    params.get("class");

document.getElementById(
    "classTitle"
).textContent =
    `${classNumber} класс`;

fetch("./data/subjects.json")
    .then(r => r.json())
    .then(subjects => {

        const grid =
            document.getElementById(
                "subjectsGrid"
            );

        subjects.forEach(subject => {

            grid.innerHTML += `

            <a
                href="lessons.html?class=${classNumber}&subject=${subject.code}"
                class="subject-card"
                style="border-top:6px solid ${subject.color}"
            >

                <span>
                    ${subject.icon}
                </span>

                <h3>
                    ${subject.title}
                </h3>

            </a>

            `;

        });

    });