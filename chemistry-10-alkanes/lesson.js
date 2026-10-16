"use strict";

(() => {
  const STORAGE_KEY = "school:chemistry-10-alkanes:v1";
  const names = [
    "Метан",
    "Этан",
    "Пропан",
    "Бутан",
    "Пентан",
    "Гексан",
    "Гептан",
    "Октан",
    "Нонан",
    "Декан",
  ];
  const questions = [
    {
      id: "methane",
      topic: "Состав",
      title: "Как записывается молекулярная формула метана?",
      options: [
        "CH<sub>2</sub>",
        "CH<sub>4</sub>",
        "C<sub>2</sub>H<sub>6</sub>",
      ],
      correct: 1,
      explanation:
        "Метан содержит один атом C. Подставляем n = 1: H = 2 × 1 + 2 = 4. Получаем CH₄. Каждый из четырёх атомов H связан с углеродом одной связью.",
    },
    {
      id: "hexane",
      topic: "Общая формула",
      title: "В гексане 6 атомов углерода. Сколько атомов водорода?",
      options: ["12", "14", "16"],
      correct: 1,
      explanation:
        "Подставляем n = 6 в 2n + 2: 2 × 6 + 2 = 14. Формула гексана — C₆H₁₄. Не забудь прибавить два после умножения.",
    },
    {
      id: "octane",
      topic: "Гомологический ряд",
      title: "Как называется неразветвлённый алкан C₈H₁₈?",
      options: ["Гептан", "Нонан", "Октан", "Гексан"],
      correct: 2,
      explanation:
        "У октана восемь атомов C. Полезная последовательность: гексан — 6, гептан — 7, октан — 8, нонан — 9. Проверка водорода: 2 × 8 + 2 = 18.",
    },
    {
      id: "twelve",
      topic: "Общая формула",
      title: "Какова формула алкана с 12 атомами углерода?",
      options: [
        "C<sub>12</sub>H<sub>24</sub>",
        "C<sub>12</sub>H<sub>26</sub>",
        "C<sub>12</sub>H<sub>28</sub>",
      ],
      correct: 1,
      explanation:
        "Правило работает и за пределами первых десяти представителей: n = 12, H = 2 × 12 + 2 = 26. Поэтому формула — C₁₂H₂₆.",
    },
    {
      id: "next",
      topic: "Гомологический ряд",
      title: "Какой алкан идёт сразу после пентана C₅H₁₂?",
      options: [
        "Бутан C<sub>4</sub>H<sub>10</sub>",
        "Гексан C<sub>6</sub>H<sub>14</sub>",
        "Гептан C<sub>7</sub>H<sub>16</sub>",
      ],
      correct: 1,
      explanation:
        "При переходе к следующему гомологу добавляем CH₂: к пяти C — один C, к двенадцати H — два H. Получаем C₆H₁₄, гексан. Бутан — предыдущий представитель.",
    },
    {
      id: "difference",
      topic: "Гомологический ряд",
      title: "На какую группу отличаются соседние алканы?",
      options: [
        "H<sub>2</sub>",
        "CH<sub>4</sub>",
        "CH<sub>2</sub>",
        "C<sub>2</sub>H<sub>2</sub>",
      ],
      correct: 2,
      explanation:
        "Гомологическая разность — CH₂. Например, C₂H₆ и C₃H₈ отличаются на один атом C и два атома H. Это различие состава, а не свободная молекула, которую нужно буквально присоединить.",
    },
    {
      id: "identify",
      topic: "Состав",
      title: "Какая формула соответствует алкану?",
      options: [
        "C<sub>4</sub>H<sub>8</sub>",
        "C<sub>4</sub>H<sub>6</sub>",
        "C<sub>4</sub>H<sub>10</sub>",
      ],
      correct: 2,
      explanation:
        "Для четырёх атомов углерода формула алкана даёт 2 × 4 + 2 = 10 атомов H. Подходит C₄H₁₀. C₄H₈ и C₄H₆ не соответствуют общей формуле алканов.",
    },
    {
      id: "propane",
      topic: "Гомологический ряд",
      title: "Какой состав у пропана — третьего члена ряда?",
      options: [
        "C<sub>3</sub>H<sub>8</sub>",
        "C<sub>3</sub>H<sub>6</sub>",
        "C<sub>2</sub>H<sub>6</sub>",
      ],
      correct: 0,
      explanation:
        "Первые три представителя: метан CH₄, этан C₂H₆, пропан C₃H₈. Для n = 3 получаем H = 2 × 3 + 2 = 8.",
    },
    {
      id: "hybrid",
      topic: "Пространственное строение",
      title: "Какова гибридизация атома углерода в метане?",
      options: ["sp", "sp<sup>2</sup>", "sp<sup>3</sup>"],
      correct: 2,
      explanation:
        "В школьной модели одна s- и три p-орбитали образуют четыре равноценные sp³-орбитали. Они направлены к вершинам тетраэдра. Углерод во всех алканах находится в состоянии sp³-гибридизации.",
    },
    {
      id: "angle",
      topic: "Пространственное строение",
      title: "Чему примерно равен угол H–C–H в метане?",
      options: ["90°", "109,5°", "120°", "180°"],
      correct: 1,
      explanation:
        "Тетраэдрический угол — примерно 109,5°. На плоской схеме связи иногда рисуют под прямым углом, но это условность записи. В молекуле метана четыре направления связей образуют тетраэдр.",
    },
    {
      id: "shape",
      topic: "Пространственное строение",
      title: "Где находятся атомы водорода в молекуле метана?",
      options: [
        "На одной прямой с атомом C",
        "В вершинах квадрата, C в центре",
        "В вершинах тетраэдра, C в центре",
      ],
      correct: 2,
      explanation:
        "Метан имеет тетраэдрическое строение: C расположен в центре, четыре H — в вершинах. Не путай тетраэдр с плоским квадратом: у тетраэдра четыре треугольные грани.",
    },
    {
      id: "sigma",
      topic: "Связи",
      title: "Какие орбитали образуют C–C-связь в этане?",
      options: [
        "Две sp³-орбитали образуют σ-связь",
        "Две p-орбитали образуют π-связь",
        "Две 1s-орбитали водорода",
      ],
      correct: 0,
      explanation:
        "Одинарная C–C-связь в алкане — σ-связь. Она образована перекрыванием sp³-орбиталей двух атомов C вдоль линии между ядрами. В C–H-связи перекрываются sp³-орбиталь C и 1s-орбиталь H.",
    },
  ];
  const exam = [
    {
      id: "seven",
      title: "Какова формула гептана, если n = 7?",
      options: [
        "C<sub>7</sub>H<sub>14</sub>",
        "C<sub>7</sub>H<sub>16</sub>",
        "C<sub>7</sub>H<sub>18</sub>",
      ],
      correct: 1,
      explanation:
        "H = 2 × 7 + 2 = 16. Гептан имеет молекулярную формулу C₇H₁₆.",
    },
    {
      id: "nine",
      title: "Как называется неразветвлённый алкан C₉H₂₀?",
      options: ["Октан", "Декан", "Нонан"],
      correct: 2,
      explanation:
        "Нонан содержит 9 атомов C. Октан — 8, декан — 10. Для нонана: H = 2 × 9 + 2 = 20.",
    },
    {
      id: "inverse",
      title: "У алкана 18 атомов H. Сколько в нём атомов C?",
      options: ["8", "9", "10"],
      correct: 0,
      explanation:
        "Решаем обратную задачу: 2n + 2 = 18, значит 2n = 16, n = 8. Формула — C₈H₁₈.",
    },
    {
      id: "pair",
      title: "Выбери пару соседних членов гомологического ряда.",
      options: [
        "CH<sub>4</sub> и C<sub>3</sub>H<sub>8</sub>",
        "C<sub>2</sub>H<sub>6</sub> и C<sub>3</sub>H<sub>8</sub>",
        "C<sub>2</sub>H<sub>6</sub> и C<sub>2</sub>H<sub>4</sub>",
      ],
      correct: 1,
      explanation:
        "Этан C₂H₆ и пропан C₃H₈ отличаются на CH₂ и следуют друг за другом. CH₄ и C₃H₈ — гомологи, но не соседние; C₂H₄ не относится к алканам.",
    },
    {
      id: "geometry",
      title: "Какое описание метана верно?",
      options: [
        "sp²; плоская молекула; угол 120°",
        "sp³; тетраэдр; угол ≈ 109,5°",
        "sp; линейная молекула; угол 180°",
      ],
      correct: 1,
      explanation:
        "Четыре sp³-орбитали углерода направлены к вершинам тетраэдра. Поэтому метан имеет тетраэдрическую форму с углом H–C–H около 109,5°.",
    },
    {
      id: "drawing",
      title: "Почему прямой рисунок цепи не означает, что молекула плоская?",
      options: [
        "Потому что у углерода только две связи",
        "Потому что C–C-связи в алканах двойные",
        "Потому что рисунок задаёт порядок связей, а окружение C — тетраэдрическое",
      ],
      correct: 2,
      explanation:
        "Структурная формула показывает, какие атомы связаны. Пространственное расположение определяется тетраэдрическим окружением C; кроме того, вокруг одинарных C–C-связей возможно вращение.",
    },
  ];

  const $ = (id) => document.getElementById(id);
  const freshState = () => ({
    version: 1,
    index: 0,
    n: 1,
    practice: {},
    exam: { answers: {}, submitted: false },
  });
  let state = freshState();
  let rotation = 30;

  function storageUnavailable() {
    $("storage-notice").hidden = false;
  }

  // Only accept the small, known schema: stored content is never inserted as HTML.
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved?.version === 1) {
      if (
        Number.isInteger(saved.index) &&
        saved.index >= 0 &&
        saved.index < questions.length
      )
        state.index = saved.index;
      if (Number.isInteger(saved.n) && saved.n >= 1 && saved.n <= 10)
        state.n = saved.n;
      for (const q of questions) {
        const rec = saved.practice?.[q.id];
        if (
          rec &&
          (rec.selected === null ||
            (Number.isInteger(rec.selected) &&
              rec.selected >= -1 &&
              rec.selected < q.options.length))
        ) {
          state.practice[q.id] = {
            selected: rec.selected,
            firstCorrect: rec.firstCorrect === true,
            lastCorrect: rec.lastCorrect === true,
          };
        }
      }
      for (const q of exam) {
        const value = saved.exam?.answers?.[q.id];
        if (Number.isInteger(value) && value >= 0 && value < q.options.length)
          state.exam.answers[q.id] = value;
      }
      state.exam.submitted =
        saved.exam?.submitted === true &&
        exam.every((q) => state.exam.answers[q.id] !== undefined);
    }
  } catch {
    storageUnavailable();
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      storageUnavailable();
    }
  }

  function formula(n) {
    return `C${n === 1 ? "" : `<sub>${n}</sub>`}H<sub>${2 * n + 2}</sub>`;
  }

  function renderHomologues() {
    $("homologue-list").innerHTML = names
      .map(
        (name, i) =>
          `<button type="button" class="homologue-row" data-carbon="${i + 1}" aria-pressed="${state.n === i + 1}"><span class="homologue-index">${String(i + 1).padStart(2, "0")}</span><span>${name}</span><span class="homologue-formula">${formula(i + 1)}</span></button>`,
      )
      .join("");
    updateFormula();
  }

  function updateFormula() {
    const n = state.n;
    $("carbon-range").value = n;
    $("carbon-output").value = n;
    $("alkane-name").textContent = names[n - 1];
    $("alkane-formula").innerHTML = formula(n);
    $("formula-calculation").textContent = `H: 2 × ${n} + 2 = ${2 * n + 2}`;
    document
      .querySelectorAll("[data-carbon]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(Number(button.dataset.carbon) === n),
        ),
      );
  }

  function drawMolecule() {
    const yaw = (rotation * Math.PI) / 180;
    const tilt = -0.31;
    const points = [
      [1, 1, 1],
      [1, -1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
    ].map(([x, y, z]) => {
      const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
      const rz = -x * Math.sin(yaw) + z * Math.cos(yaw);
      const ry = y * Math.cos(tilt) - rz * Math.sin(tilt);
      const depth = y * Math.sin(tilt) + rz * Math.cos(tilt);
      return { x: 220 + rx * 78, y: 166 - ry * 78, z: depth };
    });
    const bond = (point) =>
      `<line x1="220" y1="166" x2="${point.x}" y2="${point.y}" stroke="${point.z < 0 ? "#a0b5a0" : "#608276"}" stroke-width="${point.z < 0 ? 7 : 9}" stroke-linecap="round"/>`;
    const atom = (point) =>
      `<g><circle cx="${point.x + 2}" cy="${point.y + 4}" r="${17 + point.z}" fill="#153b2410"/><circle cx="${point.x}" cy="${point.y}" r="${17 + point.z}" fill="url(#hydrogen-shade)" stroke="#8eaa94" stroke-width="1.2"/><text x="${point.x}" y="${point.y + 5}" text-anchor="middle" fill="#355447" font-size="14" font-family="system-ui,sans-serif" font-weight="600">H</text></g>`;
    let edges = "";
    if ($("show-tetrahedron").checked) {
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          edges += `<line x1="${points[i].x}" y1="${points[i].y}" x2="${points[j].x}" y2="${points[j].y}" stroke="#91ad95" stroke-width="1" stroke-dasharray="4 5" opacity=".65"/>`;
        }
      }
    }
    const back = points
      .filter((point) => point.z < 0)
      .sort((a, b) => a.z - b.z);
    const front = points
      .filter((point) => point.z >= 0)
      .sort((a, b) => a.z - b.z);
    $("molecule-drawing").innerHTML =
      `<defs><radialGradient id="hydrogen-shade" cx="35%" cy="25%"><stop offset="0" stop-color="#fffefa"/><stop offset="1" stop-color="#e4ebe0"/></radialGradient><radialGradient id="carbon-shade" cx="32%" cy="25%"><stop offset="0" stop-color="#447c64"/><stop offset="1" stop-color="#194d43"/></radialGradient></defs>${edges}${back.map(bond).join("")}${back.map(atom).join("")}${front.map(bond).join("")}<circle cx="220" cy="166" r="25" fill="url(#carbon-shade)"/><text x="220" y="173" text-anchor="middle" fill="#fffefa" font-family="system-ui,sans-serif" font-size="19" font-weight="650">C</text>${front.map(atom).join("")}<text x="220" y="317" text-anchor="middle" fill="#4b6957" font-family="system-ui,sans-serif" font-size="12">H–C–H ≈ 109,5° при любом повороте</text>`;
    $("rotation-range").value = rotation;
    $("rotation-output").value = `${rotation}°`;
  }

  function updateProgress() {
    const seen = questions.filter((q) => state.practice[q.id]).length;
    const first = questions.filter(
      (q) => state.practice[q.id]?.firstCorrect,
    ).length;
    $("overall-label").textContent = `Разобрано ${seen} из ${questions.length}`;
    $("overall-fill").style.width = `${(seen / questions.length) * 100}%`;
    document
      .querySelector(".progress-track")
      .setAttribute("aria-valuenow", String(seen));
    $("first-try-count").textContent = first;
    $("question-dots").innerHTML = questions
      .map((q, i) => {
        const record = state.practice[q.id];
        const status = record ? (record.lastCorrect ? "done" : "review") : "";
        const label = record
          ? record.lastCorrect
            ? "верно"
            : "нужно повторить"
          : "ещё не разобрано";
        return `<button type="button" class="question-dot ${status}" data-question="${i}" aria-label="Задание ${i + 1}: ${label}" ${state.index === i ? 'aria-current="step"' : ""}>${i + 1}</button>`;
      })
      .join("");
    $("practice-complete").hidden = seen !== questions.length;
    const review = questions.filter(
      (q) => state.practice[q.id] && !state.practice[q.id].lastCorrect,
    ).length;
    $("practice-complete-text").textContent = review
      ? `Ещё стоит повторить: ${review}. Вернись к отмеченным заданиям или попробуй итоговые вопросы.`
      : "Все задания решены верно. Теперь проверь, сможешь ли применить идеи без подсказок.";
  }

  function renderPractice(focusFeedback = false) {
    const q = questions[state.index];
    const record = state.practice[q.id];
    const answered = record && record.selected !== null;
    const selected = record?.selected;
    const correct = answered && selected === q.correct;
    const feedback = answered
      ? `<div id="practice-feedback" class="answer-feedback ${correct ? "" : selected === -1 ? "info" : "bad"}" role="status"><h4 id="feedback-title" tabindex="-1">${correct ? "Верно. Вот почему." : selected === -1 ? "Разберём вместе." : "Пока не совпало. Давай разберёмся."}</h4><p>${q.explanation}</p><button type="button" class="text-button" data-action="retry">Попробовать это задание ещё раз ↻</button></div>`
      : "";
    $("practice-content").innerHTML =
      `<div class="question-top"><span class="tag">${q.topic}</span><span class="question-count">Задание ${state.index + 1} / ${questions.length}</span></div><h3 id="question-title" tabindex="-1">${q.title}</h3><p class="question-subtitle">Выбери один ответ.</p><div class="answer-options" role="group" aria-labelledby="question-title">${q.options.map((option, i) => `<button type="button" class="answer-option ${answered && i === q.correct ? "correct" : answered && i === selected ? "wrong" : ""}" data-answer="${i}" ${answered ? "disabled" : ""}><span class="option-letter">${["А", "Б", "В", "Г"][i]}</span><span class="option-copy">${option}</span>${answered && i === q.correct ? '<span class="option-status">✓ Верно</span>' : answered && i === selected ? '<span class="option-status">Твой ответ</span>' : ""}</button>`).join("")}</div>${answered ? feedback : '<button type="button" class="text-button" data-action="help">Не знаю — объясни</button>'}<div class="question-footer"><button type="button" class="button button-light" data-action="prev" ${state.index === 0 ? "disabled" : ""}>← Назад</button><button type="button" class="button button-primary" ${state.index === questions.length - 1 ? 'data-go="check"' : 'data-action="next"'}>${state.index === questions.length - 1 ? "К самопроверке →" : "Следующее →"}</button></div>`;
    updateProgress();
    if (focusFeedback) $("feedback-title").focus({ preventScroll: true });
  }

  function answerQuestion(selected) {
    const q = questions[state.index];
    const old = state.practice[q.id];
    if (old && old.selected !== null) return;
    const correct = selected === q.correct;
    state.practice[q.id] = {
      selected,
      firstCorrect: old ? old.firstCorrect : correct,
      lastCorrect: correct,
    };
    persist();
    renderPractice(true);
    $("practice-feedback").scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }

  function navigateQuestion(index) {
    state.index = Math.max(0, Math.min(questions.length - 1, index));
    persist();
    renderPractice();
    $("question-title").focus({ preventScroll: true });
    $("practice-card").scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function renderExam() {
    const submitted = state.exam.submitted;
    $("exam-questions").innerHTML = exam
      .map((q, qi) => {
        const answer = state.exam.answers[q.id];
        return `<fieldset class="exam-question" id="exam-group-${q.id}"><legend><span class="mini-label">Вопрос ${qi + 1} / ${exam.length}</span>${q.title}</legend><div class="exam-options">${q.options.map((option, i) => `<label class="exam-option ${submitted && i === q.correct ? "correct" : submitted && answer === i ? "wrong" : ""}" for="exam-${q.id}-${i}"><input id="exam-${q.id}-${i}" type="radio" name="exam-${q.id}" data-exam="${q.id}" value="${i}" ${answer === i ? "checked" : ""} ${submitted ? "disabled" : ""}><span>${option}${submitted && i === q.correct ? " <strong>✓</strong>" : ""}</span></label>`).join("")}</div>${submitted ? `<div class="exam-explanation"><strong>${answer === q.correct ? "✓ Верно" : "Стоит повторить"}</strong><p>${q.explanation}</p></div>` : ""}</fieldset>`;
      })
      .join("");
    $("exam-submit").hidden = submitted;
    $("exam-restart").hidden = !submitted;
    $("exam-error").hidden = true;
    $("exam-result").hidden = !submitted;
    updateExamCount();
    if (submitted) {
      const score = exam.filter(
        (q) => state.exam.answers[q.id] === q.correct,
      ).length;
      $("exam-result").innerHTML =
        `<div class="exam-score">${score}<span aria-hidden="true"> / </span><span class="sr-only"> из </span>${exam.length}</div><div><h3 id="exam-result-title" tabindex="-1">${score === exam.length ? "Все идеи на своих местах." : score >= 4 ? "Основа уже есть." : "Есть с чем ещё разобраться."}</h3><p>${score === exam.length ? "Отлично! Ты связал состав, гомологический ряд и пространственное строение алканов." : "Прочитай объяснения ниже. Затем вернись к нужному разделу и попробуй ещё раз — в своём темпе."}</p><button type="button" class="text-button result-theory" data-go="learn">Вернуться к теории ↗</button></div>`;
    }
  }

  function updateExamCount() {
    $("exam-filled").textContent =
      `Выбрано ответов: ${Object.keys(state.exam.answers).length} из ${exam.length}`;
  }

  function setTab(name, focusPanel = false) {
    if (!["learn", "practice", "check"].includes(name)) name = "learn";
    document.querySelectorAll("[data-tab]").forEach((button) => {
      const active = button.dataset.tab === name;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      $(`panel-${button.dataset.tab}`).hidden = !active;
    });
    try {
      history.replaceState(null, "", `#${name}`);
    } catch {
      /* Navigation still works without History API. */
    }
    if (focusPanel) {
      $(`panel-${name}`).focus({ preventScroll: true });
      $(`panel-${name}`).scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }

  $("carbon-range").addEventListener("input", (event) => {
    state.n = Number(event.target.value);
    updateFormula();
  });
  $("carbon-range").addEventListener("change", persist);
  $("homologue-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-carbon]");
    if (!button) return;
    state.n = Number(button.dataset.carbon);
    updateFormula();
    persist();
  });
  $("rotation-range").addEventListener("input", (event) => {
    rotation = Number(event.target.value);
    drawMolecule();
  });
  $("rotate-model").addEventListener("click", () => {
    rotation = (rotation + 30) % 360;
    drawMolecule();
  });
  $("show-tetrahedron").addEventListener("change", drawMolecule);

  document.addEventListener("click", (event) => {
    const destination = event.target.closest("[data-go]");
    if (destination) setTab(destination.dataset.go, true);
  });
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tab));
    button.addEventListener("keydown", (event) => {
      const tabs = [...document.querySelectorAll("[data-tab]")];
      let index = tabs.indexOf(button);
      if (event.key === "ArrowRight") index = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft")
        index = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") index = 0;
      else if (event.key === "End") index = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[index].focus();
      setTab(tabs[index].dataset.tab);
    });
  });
  window.addEventListener("hashchange", () => setTab(location.hash.slice(1)));
  $("question-dots").addEventListener("click", (event) => {
    const button = event.target.closest("[data-question]");
    if (button) navigateQuestion(Number(button.dataset.question));
  });
  $("practice-content").addEventListener("click", (event) => {
    const answer = event.target.closest("[data-answer]");
    if (answer) {
      answerQuestion(Number(answer.dataset.answer));
      return;
    }
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "help") answerQuestion(-1);
    if (action === "retry") {
      state.practice[questions[state.index].id].selected = null;
      persist();
      renderPractice();
      $("question-title").focus({ preventScroll: true });
    }
    if (action === "prev") navigateQuestion(state.index - 1);
    if (action === "next") navigateQuestion(state.index + 1);
  });
  $("exam-form").addEventListener("change", (event) => {
    const input = event.target.closest("[data-exam]");
    if (!input || state.exam.submitted) return;
    state.exam.answers[input.dataset.exam] = Number(input.value);
    const group = $(`exam-group-${input.dataset.exam}`);
    group.classList.remove("unanswered");
    group.removeAttribute("aria-invalid");
    group.removeAttribute("aria-describedby");
    if (exam.every((q) => state.exam.answers[q.id] !== undefined))
      $("exam-error").hidden = true;
    updateExamCount();
    persist();
  });
  $("exam-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.exam.submitted) return;
    const missing = exam.filter((q) => state.exam.answers[q.id] === undefined);
    if (missing.length) {
      $("exam-error").textContent =
        `Осталось выбрать ответ: ${missing.length} из ${exam.length}. Заполни отмеченные вопросы — затем проверим всё вместе.`;
      $("exam-error").hidden = false;
      for (const q of missing) {
        const group = $(`exam-group-${q.id}`);
        group.classList.add("unanswered");
        group.setAttribute("aria-invalid", "true");
        group.setAttribute("aria-describedby", "exam-error");
      }
      $(`exam-${missing[0].id}-0`).focus();
      return;
    }
    state.exam.submitted = true;
    persist();
    renderExam();
    $("exam-result-title").focus({ preventScroll: true });
    $("exam-result").scrollIntoView({ block: "start", behavior: "smooth" });
  });
  $("exam-restart").addEventListener("click", () => {
    state.exam = { answers: {}, submitted: false };
    persist();
    renderExam();
    $("exam-seven-0").focus();
  });
  $("reset-progress").addEventListener("click", () => {
    if (
      !window.confirm(
        "Сбросить ответы в практике и самопроверке? Этот прогресс будет удалён только в данном браузере.",
      )
    )
      return;
    state = freshState();
    persist();
    renderHomologues();
    renderPractice();
    renderExam();
    setTab("learn", true);
  });
  $("print-summary").addEventListener("click", () => window.print());

  renderHomologues();
  drawMolecule();
  renderPractice();
  renderExam();
  setTab(location.hash.slice(1));
})();
