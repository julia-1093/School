"use strict";

(() => {
  const cubeFigure =
    '<img class="question-figure" src="./cube.svg" alt="Куб ABCDA₁B₁C₁D₁: ABCD — нижняя грань, A₁B₁C₁D₁ — верхняя; соответствующие вершины соединены вертикальными рёбрами.">';
  const questions = [
    {
      id: "zero",
      topic: "Определение",
      title: "У прямой a и плоскости α нет общих точек. Как они расположены?",
      options: [
        "Прямая лежит в плоскости",
        "Прямая пересекает плоскость",
        "Прямая параллельна плоскости",
      ],
      correct: 2,
      explanation:
        "По определению, a ∥ α означает, что у прямой и плоскости нет общих точек. Если a лежит в α, общими были бы все точки прямой.",
    },
    {
      id: "two",
      topic: "Три случая",
      title:
        "Две различные точки прямой a лежат в плоскости α. Что можно утверждать?",
      options: [
        "Вся прямая a лежит в α",
        "a параллельна α",
        "У a и α ровно одна общая точка",
      ],
      correct: 0,
      explanation:
        "Если две различные точки прямой принадлежат плоскости, то вся прямая лежит в этой плоскости. Случая «ровно две общие точки» у прямой и плоскости нет.",
    },
    {
      id: "one",
      topic: "Три случая",
      title:
        "Прямая проходит через точку M плоскости α, но целиком в α не лежит. Каков вывод?",
      options: [
        "Прямая лежит в α",
        "Прямая пересекает α только в M",
        "Прямая параллельна α",
      ],
      correct: 1,
      explanation:
        "Общая точка M уже есть, поэтому параллельности нет. Если бы существовала вторая общая точка, вся прямая лежала бы в α. Значит M — единственная точка пересечения.",
    },
    {
      id: "condition",
      topic: "Признак",
      title:
        "Известно: a ∥ b и b ⊂ α. Какое условие нужно добавить, чтобы применить признак параллельности?",
      options: ["a пересекает α", "a лежит в α", "a не лежит в α"],
      correct: 2,
      explanation:
        "Нужно проверить a ⊄ α. Без этого условия a может лежать в α вместе с параллельной ей прямой b. Все три условия признака существенны.",
    },
    {
      id: "missing",
      topic: "Ловушка в условии",
      title: "Дано только a ∥ b и b ⊂ α. Какой вывод всегда верен?",
      options: [
        "a либо лежит в α, либо параллельна α",
        "a обязательно параллельна α",
        "a обязательно пересекает α в одной точке",
      ],
      correct: 0,
      explanation:
        "Если a лежит в α, имеем первый вариант. Если не лежит, выполняется признак и a ∥ α. Одну точку пересечения эти условия исключают. Выбирать только параллельность без проверки нельзя.",
    },
    {
      id: "impossible",
      topic: "Признак",
      title:
        "Прямая a пересекает α ровно в одной точке. Может ли в α существовать прямая b, параллельная a?",
      options: ["Да", "Нет", "Любая прямая в α параллельна a"],
      correct: 1,
      explanation:
        "Нет. Прямая a не лежит в α. Если бы нашлась b ⊂ α с a ∥ b, по признаку получилось бы a ∥ α, что противоречит имеющейся точке пересечения.",
    },
    {
      id: "trace",
      topic: "Свойство",
      title: "a ∥ α, a ⊂ β, α ∩ β = b. Как расположены a и b?",
      options: ["Они скрещиваются", "Они пересекаются", "Они параллельны"],
      correct: 2,
      explanation:
        "По свойству b ∥ a. Обе прямые лежат в β, а пересечься не могут: точка пересечения была бы общей для a и α.",
    },
    {
      id: "coplanar",
      topic: "Доказательство",
      title:
        "Какое полное обоснование доказывает параллельность a и линии b = α ∩ β, если a ∥ α и a ⊂ β?",
      options: [
        "a и b не имеют общих точек",
        "a и b лежат в одной плоскости β и не имеют общих точек",
        "Обе прямые параллельны плоскости α",
      ],
      correct: 1,
      explanation:
        "В пространстве отсутствие общих точек само по себе допускает скрещивающиеся прямые. Здесь нужно учесть, что a и b обе лежат в β. А b лежит в α, поэтому называть b параллельной α неверно.",
    },
    {
      id: "cube-witness",
      topic: "Задача на куб",
      title:
        "В кубе доказываем AB ∥ (DCC₁D₁). Какую прямую в этой плоскости удобно взять параллельной AB?",
      figure: cubeFigure,
      options: ["DC", "DD₁", "BC"],
      correct: 0,
      explanation:
        "AB ∥ DC как противоположные стороны квадрата ABCD. Прямая DC лежит в плоскости задней грани (DCC₁D₁), а AB не лежит в ней. По признаку AB ∥ (DCC₁D₁). DD₁ имеет другое направление, а BC целиком в задней плоскости не лежит.",
    },
    {
      id: "cube-crossing",
      topic: "Задача на куб",
      title:
        "Как расположена прямая AC₁ относительно плоскости нижней грани (ABCD)?",
      figure: cubeFigure,
      options: [
        "Параллельна плоскости",
        "Лежит в плоскости",
        "Пересекает её в точке A",
      ],
      correct: 2,
      explanation:
        "Точка A лежит в (ABCD), а C₁ — нет. Поэтому вся прямая AC₁ не лежит в этой плоскости и пересекает её ровно в A. Общая точка исключает параллельность.",
    },
    {
      id: "cube-inside",
      topic: "Задача на куб",
      title:
        "Как расположена прямая A₁B₁ относительно плоскости передней грани (ABB₁A₁)?",
      figure: cubeFigure,
      options: [
        "Параллельна плоскости",
        "Лежит в плоскости",
        "Пересекает её только в B₁",
      ],
      correct: 1,
      explanation:
        "Обе различные точки A₁ и B₁ принадлежат плоскости (ABB₁A₁). Следовательно, вся прямая A₁B₁ лежит в ней. Она не считается параллельной этой плоскости.",
    },
    {
      id: "section",
      topic: "Сечение",
      title:
        "M лежит на DD₁. Плоскость ABM пересекает заднюю грань по прямой MN, где N ∈ CC₁. Какое направление имеет MN?",
      figure: cubeFigure,
      options: ["MN ∥ AB", "MN ∥ DD₁", "MN ∥ AD"],
      correct: 0,
      explanation:
        "AB параллельна плоскости задней грани, так как AB ∥ DC. Секущая плоскость проходит через AB и пересекает плоскость задней грани по MN. По свойству MN ∥ AB.",
    },
  ];
  const exam = [
    {
      id: "common",
      title: "На прямой a отмечены две различные точки плоскости α. Что верно?",
      options: ["a ∥ α", "a ⊂ α", "a ∩ α состоит из одной точки"],
      correct: 1,
      explanation:
        "Две различные общие точки означают, что вся прямая принадлежит плоскости. Это один из основных фактов стереометрии.",
    },
    {
      id: "criterion",
      title:
        "Какой набор условий позволяет применить признак параллельности a и α?",
      options: [
        "a ∥ b и b ⊂ α — больше ничего не нужно",
        "a ⊂ α и a ∥ b",
        "a ⊄ α, b ⊂ α и a ∥ b",
      ],
      correct: 2,
      explanation:
        "Нужны все три условия: a не лежит в α, прямая-помощник b лежит в α, и a ∥ b. Тогда a ∥ α.",
    },
    {
      id: "all-lines",
      title:
        "Если a ∥ α, обязана ли каждая прямая плоскости α быть параллельной a?",
      options: [
        "Нет: некоторые могут быть скрещивающимися с a",
        "Да, обязательно",
        "Да, если плоскость α изображена параллелограммом",
      ],
      correct: 0,
      explanation:
        "Параллельность a и плоскости не означает параллельность каждой её прямой. Например, в горизонтальной плоскости можно выбрать разные направления; прямые одного из них будут скрещиваться с расположенной над плоскостью прямой a.",
    },
    {
      id: "cube-edge",
      title: "Какая прямая помогает доказать A₁D₁ ∥ (ABCD) по признаку?",
      figure: cubeFigure,
      options: ["AA₁", "AD", "BD"],
      correct: 1,
      explanation:
        "A₁D₁ ∥ AD как противоположные стороны грани ADD₁A₁. AD лежит в (ABCD), а A₁D₁ не лежит в этой плоскости. Все условия признака выполнены.",
    },
    {
      id: "intersection",
      title: "Плоскость β содержит a ∥ α и пересекает α по b. Каков вывод?",
      options: [
        "b обязательно пересекает a",
        "a и b обязательно скрещиваются",
        "b ∥ a",
      ],
      correct: 2,
      explanation:
        "Обе прямые лежат в β, но не могут иметь общую точку из-за a ∥ α. Поэтому b ∥ a. Это свойство задаёт направление линии пересечения при построении сечений.",
    },
    {
      id: "midpoint",
      title:
        "В кубе M — середина DD₁. Прямая через M в задней грани параллельна AB. Где она пересечёт ребро этой грани?",
      figure: cubeFigure,
      options: [
        "На CC₁, в его середине",
        "На AA₁, в его середине",
        "На BC, в его середине",
      ],
      correct: 0,
      explanation:
        "AB ∥ DC. В квадрате DCC₁D₁ прямая через середину DD₁, параллельная DC, пересекает противоположную сторону CC₁ в её середине. Получаем точку N для сечения ABNM.",
    },
  ];

  const $ = (id) => document.getElementById(id);
  const plane =
    '<path d="M65 244 395 244 465 170 135 170Z" fill="#cfdfc8" fill-opacity=".85" stroke="#70976d" stroke-width="1.5"/><text x="115" y="230" fill="#315e43" font-family="Georgia,serif" font-size="23">α</text>';
  const verticalPlane =
    '<path d="M110 275 420 275 420 65 110 65Z" fill="#efd3b5" fill-opacity=".52" stroke="#bd8a5d" stroke-width="1.3"/><text x="395" y="94" fill="#8b542e" font-family="Georgia,serif" font-size="23">β</text>';
  const segment = (x1, y1, x2, y2, color, width = 3, dashed = false) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${dashed ? 'stroke-dasharray="6 6"' : ""}/>`;
  const label = (text, x, y, color = "#284e3f") =>
    `<text x="${x}" y="${y}" fill="${color}" font-family="Georgia,serif" font-size="22" font-style="italic">${text}</text>`;
  function twoPlanes(showBeta) {
    return (
      plane +
      (showBeta ? verticalPlane : "") +
      segment(32, 132, 488, 132, "#a85331", 4) +
      segment(32, 207, 488, 207, "#194d43", 3) +
      label("a", 477, 118, "#8e482c") +
      label("b", 477, 231)
    );
  }
  const cases = {
    inside: {
      title: "Прямая лежит в плоскости",
      notation: "a ⊂ α",
      count: "Бесконечно много общих точек",
      text: "Все точки прямой принадлежат плоскости. Даже часть линии за пределами нарисованного параллелограмма продолжает лежать в α.",
      drawing: () =>
        plane +
        segment(30, 207, 490, 207, "#a85331", 4) +
        label("a", 477, 192, "#8e482c"),
    },
    crossing: {
      title: "Прямая пересекает плоскость",
      notation: "a ∩ α = {M}",
      count: "1 общая точка",
      text: "Только точка M принадлежит и прямой, и плоскости. Две различные общие точки означали бы, что прямая целиком лежит в α.",
      drawing: () =>
        plane +
        segment(274, 207, 274, 325, "#a85331", 3, true) +
        segment(274, 48, 274, 207, "#a85331", 4) +
        '<circle cx="274" cy="207" r="5" fill="#194d43"/>' +
        label("a", 289, 67, "#8e482c") +
        label("M", 286, 222),
    },
    parallel: {
      title: "Прямая параллельна плоскости",
      notation: "a ∥ α",
      count: "0 общих точек",
      text: "У прямой и плоскости нет общих точек. Именно это и означает параллельность. Принадлежащая плоскости прямая сюда не относится.",
      drawing: () =>
        plane +
        segment(30, 132, 490, 132, "#a85331", 4) +
        label("a", 477, 118, "#8e482c"),
    },
  };
  function showCase(name) {
    const model = cases[name];
    $("case-drawing").innerHTML = model.drawing();
    $("case-result").innerHTML =
      `<h4>${model.notation}</h4><p>${model.text}</p>`;
    $("case-count").textContent = model.count;
    $("case-model-title").textContent = model.title;
    $("case-model-desc").textContent = model.text;
    document
      .querySelectorAll("[data-case]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.case === name),
        ),
      );
  }

  const vertices = {
    A: [140, 310],
    B: [340, 310],
    C: [280, 235],
    D: [80, 235],
    "A₁": [140, 110],
    "B₁": [340, 110],
    "C₁": [280, 35],
    "D₁": [80, 35],
  };
  const edges = [
    ["A", "D", true],
    ["D", "C", true],
    ["D", "D₁", true],
    ["A", "B"],
    ["B", "C"],
    ["A", "A₁"],
    ["B", "B₁"],
    ["C", "C₁"],
    ["A₁", "B₁"],
    ["B₁", "C₁"],
    ["C₁", "D₁"],
    ["D₁", "A₁"],
  ];
  const offsets = {
    A: [-18, 22],
    B: [10, 18],
    C: [10, 15],
    D: [-22, 16],
    "A₁": [-25, -3],
    "B₁": [10, 3],
    "C₁": [8, -12],
    "D₁": [-25, -8],
  };
  function cubeDrawing(step) {
    let svg =
      '<path d="M80 235 280 235 280 35 80 35Z" fill="#cbdcc4" fill-opacity=".7" stroke="none"/>';
    if (step === 3)
      svg +=
        '<path d="M140 310 340 310 280 135 80 135Z" fill="#67997c" fill-opacity=".3" stroke="#194d43" stroke-width="3"/>';
    for (const [from, to, hidden] of edges) {
      const a = vertices[from],
        b = vertices[to];
      svg += segment(a[0], a[1], b[0], b[1], "#74877b", 1.7, hidden);
    }
    svg += label("α", 111, 68);
    if (step >= 0) svg += segment(140, 310, 340, 310, "#ac5734", 4);
    if (step >= 1) svg += segment(80, 235, 280, 235, "#194d43", 3);
    if (step >= 2) svg += segment(80, 135, 280, 135, "#194d43", 4);
    if (step >= 0)
      svg +=
        '<circle cx="80" cy="135" r="5" fill="#ac5734"/>' +
        label("M", 54, 143, "#8c4529");
    if (step >= 2)
      svg +=
        '<circle cx="280" cy="135" r="5" fill="#194d43"/>' +
        label("N", 292, 143);
    for (const [name, [x, y]] of Object.entries(vertices)) {
      const [dx, dy] = offsets[name];
      svg += `<circle cx="${x}" cy="${y}" r="2.5" fill="#3c5c4b"/><text x="${x + dx}" y="${y + dy}" fill="#284e3f" font-size="17" font-family="Georgia,serif">${name}</text>`;
    }
    return svg;
  }
  const cutSteps = [
    {
      title: "Выделим исходные данные",
      text: "Прямая AB лежит в секущей плоскости β. Точка M этой плоскости находится на ребре DD₁ задней грани. Значит линия пересечения β и α пройдёт через M.",
    },
    {
      title: "Сначала применим признак",
      text: "AB ∥ DC, прямая DC лежит в α = (DCC₁D₁), а AB не лежит в α. По признаку AB ∥ α. Прямая DC стала нашей прямой-помощником.",
    },
    {
      title: "Теперь используем свойство",
      text: "Плоскость β проходит через AB и пересекает α. Её след в α параллелен AB и проходит через M. Проводим через M прямую, параллельную AB, до пересечения с CC₁ в точке N.",
    },
    {
      title: "Замкнём сечение: ABNM",
      text: "Соединим A с M по левой грани, B с N — по правой. Вместе с AB и MN получаем сечение ABNM. В квадрате DCC₁D₁ прямая MN параллельна DC, поэтому N тоже является серединой CC₁.",
    },
  ];
  let cutStep = 0;
  function showCut(step) {
    cutStep = Math.max(0, Math.min(3, step));
    const data = cutSteps[cutStep];
    $("cut-drawing").innerHTML = cubeDrawing(cutStep);
    $("cut-counter").textContent = `Шаг ${cutStep + 1} / 4`;
    $("cut-step-copy").innerHTML = `<h4>${data.title}</h4><p>${data.text}</p>`;
    $("cut-description").textContent = data.text;
    $("cut-prev").disabled = cutStep === 0;
    $("cut-next").disabled = cutStep === 3;
    document.querySelectorAll("[data-cut]").forEach((button) => {
      if (Number(button.dataset.cut) === cutStep)
        button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  }
  document
    .querySelectorAll("[data-case]")
    .forEach((button) =>
      button.addEventListener("click", () => showCase(button.dataset.case)),
    );
  document
    .querySelectorAll("[data-cut]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        showCut(Number(button.dataset.cut)),
      ),
    );
  $("cut-prev").addEventListener("click", () => showCut(cutStep - 1));
  $("cut-next").addEventListener("click", () => showCut(cutStep + 1));
  $("show-proof-plane").addEventListener("change", (event) => {
    $("criterion-drawing").innerHTML = twoPlanes(event.target.checked);
  });
  $("criterion-drawing").innerHTML = twoPlanes(false);
  $("property-drawing").innerHTML = twoPlanes(true);
  showCase("parallel");
  showCut(0);
  window.createSchoolLesson({
    storageKey: "school:geometry-10-line-plane:v1",
    questions,
    exam,
    successMessage:
      "Получилось связать определения, признак параллельности и свойство, которое помогает строить сечения.",
  });
})();
