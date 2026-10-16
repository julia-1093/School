"use strict";

// A reusable practice and self-check controller; lesson data stays in each lesson.
window.createSchoolLesson = function ({
  storageKey: STORAGE_KEY,
  questions,
  exam,
  successMessage,
}) {
  const $ = (id) => document.getElementById(id);
  const freshState = () => ({
    version: 1,
    index: 0,
    practice: {},
    exam: { answers: {}, submitted: false },
  });
  let state = freshState();

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
      `<div class="question-top"><span class="tag">${q.topic}</span><span class="question-count">Задание ${state.index + 1} / ${questions.length}</span></div><h3 id="question-title" tabindex="-1">${q.title}</h3>${q.figure || ""}<p class="question-subtitle">Выбери один ответ.</p><div class="answer-options" role="group" aria-labelledby="question-title">${q.options.map((option, i) => `<button type="button" class="answer-option ${answered && i === q.correct ? "correct" : answered && i === selected ? "wrong" : ""}" data-answer="${i}" ${answered ? "disabled" : ""}><span class="option-letter">${["А", "Б", "В", "Г"][i]}</span><span class="option-copy">${option}</span>${answered && i === q.correct ? '<span class="option-status">✓ Верно</span>' : answered && i === selected ? '<span class="option-status">Твой ответ</span>' : ""}</button>`).join("")}</div>${answered ? feedback : '<button type="button" class="text-button" data-action="help">Не знаю — объясни</button>'}<div class="question-footer"><button type="button" class="button button-light" data-action="prev" ${state.index === 0 ? "disabled" : ""}>← Назад</button><button type="button" class="button button-primary" ${state.index === questions.length - 1 ? 'data-go="check"' : 'data-action="next"'}>${state.index === questions.length - 1 ? "К самопроверке →" : "Следующее →"}</button></div>`;
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
        return `<fieldset class="exam-question" id="exam-group-${q.id}"><legend><span class="mini-label">Вопрос ${qi + 1} / ${exam.length}</span>${q.title}</legend>${q.figure || ""}<div class="exam-options">${q.options.map((option, i) => `<label class="exam-option ${submitted && i === q.correct ? "correct" : submitted && answer === i ? "wrong" : ""}" for="exam-${q.id}-${i}"><input id="exam-${q.id}-${i}" type="radio" name="exam-${q.id}" data-exam="${q.id}" value="${i}" ${answer === i ? "checked" : ""} ${submitted ? "disabled" : ""}><span>${option}${submitted && i === q.correct ? " <strong>✓</strong>" : ""}</span></label>`).join("")}</div>${submitted ? `<div class="exam-explanation"><strong>${answer === q.correct ? "✓ Верно" : "Стоит повторить"}</strong><p>${q.explanation}</p></div>` : ""}</fieldset>`;
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
        `<div class="exam-score">${score}<span aria-hidden="true"> / </span><span class="sr-only"> из </span>${exam.length}</div><div><h3 id="exam-result-title" tabindex="-1">${score === exam.length ? "Все идеи на своих местах." : score >= 4 ? "Основа уже есть." : "Есть с чем ещё разобраться."}</h3><p>${score === exam.length ? successMessage : "Прочитай объяснения ниже. Затем вернись к нужному разделу и попробуй ещё раз — в своём темпе."}</p><button type="button" class="text-button result-theory" data-go="learn">Вернуться к теории ↗</button></div>`;
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
    $(`exam-${exam[0].id}-0`).focus();
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
    renderPractice();
    renderExam();
    setTab("learn", true);
  });
  $("print-summary").addEventListener("click", () => window.print());

  renderPractice();
  renderExam();
  setTab(location.hash.slice(1));
};
