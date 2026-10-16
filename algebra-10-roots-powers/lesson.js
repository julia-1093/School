"use strict";

(() => {
  const questions = [
    {
      id: "fourth-root",
      topic: "Определение корня",
      title: "Чему равен арифметический корень четвёртой степени из 16?",
      options: ["−2", "2", "−2 и 2"],
      correct: 1,
      explanation:
        "∜16 = 2: показатель чётный, поэтому арифметический корень неотрицателен. Два решения −2 и 2 имеет уравнение b⁴ = 16, а не сама запись корня.",
    },
    {
      id: "odd-negative",
      topic: "Нечётный корень",
      title: "Вычисли ∛(−27).",
      options: ["−3", "3", "В действительных числах не определён"],
      correct: 0,
      explanation:
        "(−3)³ = −27, поэтому ∛(−27) = −3. Корень нечётной степени определён и для отрицательных подкоренных чисел.",
    },
    {
      id: "absolute",
      topic: "Важный модуль",
      title: "Чему равно √(x²) при x = −5?",
      options: ["−5", "±5", "5"],
      correct: 2,
      explanation:
        "√(x²) = |x|, поэтому при x = −5 результат равен 5. Сначала получается √25, а арифметический квадратный корень неотрицателен.",
    },
    {
      id: "rational",
      topic: "Рациональная степень",
      title: "Вычисли 27<sup>2/3</sup>.",
      options: ["3", "9", "18"],
      correct: 1,
      explanation:
        "Знаменатель 3 задаёт кубический корень, числитель 2 — квадрат: 27^(2/3) = (∛27)² = 3² = 9.",
    },
    {
      id: "negative-power",
      topic: "Рациональная степень",
      title: "Вычисли 16<sup>−1/2</sup>.",
      options: ["−4", "1/4", "4"],
      correct: 1,
      explanation:
        "Минус в показателе означает обратное число: 16^(−1/2) = 1/16^(1/2) = 1/√16 = 1/4. Знак результата остаётся положительным.",
    },
    {
      id: "root-domain",
      topic: "Область определения",
      title: "При каких x определена функция y = √(x − 3)?",
      options: ["x > 3", "x ≥ 3", "При всех действительных x"],
      correct: 1,
      explanation:
        "Нужно x − 3 ≥ 0, то есть x ≥ 3. Граница входит в область определения, потому что √0 = 0.",
    },
    {
      id: "decreasing",
      topic: "Степенная функция",
      title: "Какая функция убывает на промежутке (0; +∞)?",
      options: ["y = x²", "y = √x", "y = 1/x"],
      correct: 2,
      explanation:
        "При положительных x обратная величина 1/x уменьшается с ростом x. Функции x² и √x на этом промежутке возрастают. Убывание 1/x формулируют отдельно на каждой ветви её области определения.",
    },
    {
      id: "equation-domain",
      topic: "ОДЗ уравнения",
      title: "Каково ОДЗ уравнения √(x + 2) = x?",
      options: ["x ≥ −2", "x ≥ 0", "Все действительные числа"],
      correct: 0,
      explanation:
        "ОДЗ определяется существованием выражений: x + 2 ≥ 0, значит x ≥ −2. Условие x ≥ 0 появляется дополнительно из неотрицательности левой части. Не путай ОДЗ и это условие отбора.",
    },
    {
      id: "extra-root",
      topic: "Посторонние корни",
      title: "Реши √(x + 1) = x − 1.",
      options: ["0 и 3", "Только 3", "Только 0"],
      correct: 1,
      explanation:
        "ОДЗ: x ≥ −1; правая часть должна быть неотрицательна, поэтому x ≥ 1. После квадрата: x + 1 = (x − 1)², откуда x(x − 3) = 0. Из 0 и 3 подходит только 3: √4 = 2. При x = 0 получилось бы 1 = −1.",
    },
    {
      id: "negative-even",
      topic: "Знак корня",
      title: "Реши уравнение ∜(x − 2) = −1.",
      options: ["x = 3", "x = 1", "Решений нет"],
      correct: 2,
      explanation:
        "Арифметический корень чётной степени не может равняться отрицательному числу. Возведение в четвёртую степень без проверки знака дало бы постороннего кандидата x = 3.",
    },
    {
      id: "odd-equation",
      topic: "Нечётный корень",
      title: "Реши ∛(2x − 1) = 3.",
      options: ["x = 5", "x = 13", "x = 14"],
      correct: 2,
      explanation:
        "Возведение в куб здесь равносильно: 2x − 1 = 27, значит 2x = 28 и x = 14. Кубический корень определён для всех действительных подкоренных выражений.",
    },
    {
      id: "strict-rule",
      topic: "Неравенство и знак",
      title: "Какие условия равносильны √f(x) < g(x)?",
      options: [
        "f(x) ≥ 0, g(x) > 0, f(x) < g²(x)",
        "Только f(x) < g²(x)",
        "f(x) ≥ 0, g(x) ≥ 0, f(x) ≤ g²(x)",
      ],
      correct: 0,
      explanation:
        "Нужны все три условия. Корень определён при f ≥ 0. Чтобы неотрицательная величина была строго меньше g, необходимо g > 0. После этого можно сравнить квадраты со строгим знаком.",
    },
    {
      id: "less-equal",
      topic: "Неравенство ≤",
      title: "Реши √(x + 2) ≤ x.",
      options: ["[−2; 2]", "[2; +∞)", "(2; +∞)"],
      correct: 1,
      explanation:
        "ОДЗ x ≥ −2; из знака справа нужно x ≥ 0. Квадрат даёт x + 2 ≤ x², то есть (x − 2)(x + 1) ≥ 0. После пересечения с x ≥ 0 остаётся x ≥ 2. При x = 2 равенство выполняется, поэтому граница включена.",
    },
    {
      id: "greater",
      topic: "Неравенство >",
      title: "Реши √(x + 2) > x.",
      options: ["(−1; 2)", "[−2; 2)", "(2; +∞)"],
      correct: 1,
      explanation:
        "На ОДЗ x ≥ −2 все отрицательные x подходят автоматически. При x ≥ 0 квадрат даёт x + 2 > x², откуда 0 ≤ x < 2. Объединяем ветви: [−2; 2). В частности, x = −2 подходит: 0 > −2.",
    },
    {
      id: "constant-bound",
      topic: "Неравенство ≥",
      title: "Реши √(3 − x) ≥ 1.",
      options: ["(−∞; 2]", "[2; 3]", "(−∞; 3]"],
      correct: 0,
      explanation:
        "ОДЗ: x ≤ 3. Правая часть 1 положительна, поэтому можно возвести в квадрат: 3 − x ≥ 1, то есть x ≤ 2. Этот промежуток уже входит в ОДЗ. Граница x = 2 подходит.",
    },
    {
      id: "endpoints",
      topic: "Границы ответа",
      title: "Реши √(x − 1) < 2.",
      options: ["(1; 5)", "[1; 5]", "[1; 5)"],
      correct: 2,
      explanation:
        "ОДЗ: x ≥ 1. После квадрата x − 1 < 4, откуда x < 5. Пересечение — [1; 5). При x = 1 имеем 0 < 2, а при x = 5 получается равенство 2 = 2, которое строгому знаку не подходит.",
    },
  ];
  const exam = [
    {
      id: "modulus",
      title: "Чему равно √((−7)²)?",
      options: ["−7", "±7", "7"],
      correct: 2,
      explanation:
        "√((−7)²) = √49 = 7. Для квадратного корня из квадрата действует модуль: √(a²) = |a|.",
    },
    {
      id: "fraction",
      title: "Вычисли 81<sup>3/4</sup>.",
      options: ["9", "27", "243"],
      correct: 1,
      explanation:
        "Сначала корень четвёртой степени: ∜81 = 3. Затем куб: 3³ = 27.",
    },
    {
      id: "equation",
      title: "Реши √(2x + 3) = x.",
      options: ["Только 3", "−1 и 3", "Только −1"],
      correct: 0,
      explanation:
        "ОДЗ x ≥ −3/2, а знак справа требует x ≥ 0. После квадрата x² − 2x − 3 = 0, кандидаты −1 и 3. Подходит только 3: √9 = 3.",
    },
    {
      id: "no-solution",
      title: "Реши √(x − 2) = −2.",
      options: ["x = 6", "x = −2", "Решений нет"],
      correct: 2,
      explanation:
        "Левая часть неотрицательна на всей области определения, поэтому отрицательному числу −2 она равняться не может.",
    },
    {
      id: "strict",
      title: "Реши √(x + 1) < x − 1.",
      options: ["[3; +∞)", "(3; +∞)", "(1; +∞)"],
      correct: 1,
      explanation:
        "ОДЗ x ≥ −1, правая часть должна быть строго положительна: x > 1. После квадрата x + 1 < (x − 1)², откуда x(x − 3) > 0. Пересечение с x > 1 даёт x > 3. Точка 3 не входит: в ней равенство.",
    },
    {
      id: "non-strict",
      title: "Реши √(x + 2) ≥ x.",
      options: ["[−2; 2]", "[−2; 2)", "[2; +∞)"],
      correct: 0,
      explanation:
        "При −2 ≤ x ≤ 0 неравенство верно автоматически. При x > 0 сравнение квадратов даёт x ≤ 2. Объединение — [−2; 2]. В точке 2 равенство допускается.",
    },
  ];
  const $ = (id) => document.getElementById(id);
  const format = (value) =>
    Number(value.toFixed(3))
      .toLocaleString("ru-RU", { maximumFractionDigits: 3 })
      .replace(/-/g, "−");

  const formatInput = (value) =>
    value !== 0 && Math.abs(value) < 0.001
      ? value.toExponential().replace("e", " × 10^").replace(/-/g, "−")
      : value
          .toLocaleString("ru-RU", { maximumSignificantDigits: 17 })
          .replace(/-/g, "−");
  // Compare finite decimal values exactly, rather than losing small inputs to a tolerance.
  function decimalFraction(value) {
    const [mantissa, exponent = "0"] = String(value).split("e");
    const [whole, fractional = ""] = mantissa.split(".");
    let numerator = BigInt(whole + fractional);
    const scale = fractional.length - Number(exponent);
    if (scale < 0) numerator *= 10n ** BigInt(-scale);
    return [numerator, 10n ** BigInt(Math.max(0, scale))];
  }
  function calculateRoot() {
    const raw = $("radicand").value.trim();
    const a = Number(raw),
      n = Number($("root-index").value);
    const result = $("root-result");
    result.classList.remove("invalid");
    if (!raw || !Number.isFinite(a) || Math.abs(a) > 1000000) {
      result.classList.add("invalid");
      result.innerHTML =
        "<h4>Введите число от −1 000 000 до 1 000 000.</h4><p>Можно использовать десятичную дробь.</p>";
      return;
    }
    if (a < 0 && n % 2 === 0) {
      result.classList.add("invalid");
      result.innerHTML =
        "<h4>В действительных числах не определён.</h4><p>У чётного корня подкоренное число должно быть неотрицательным.</p>";
      return;
    }
    let b = Math.sign(a) * Math.pow(Math.abs(a), 1 / n);
    const nearest = Math.round(b);
    if (Math.pow(nearest, n) === a) b = nearest;
    const rounded = Number(b.toFixed(3));
    const [bn, bd] = decimalFraction(rounded),
      [an, ad] = decimalFraction(a);
    const approximate = bn ** BigInt(n) * ad !== an * bd ** BigInt(n);
    result.innerHTML = `<div class="root-formula"><math xmlns="http://www.w3.org/1998/Math/MathML" aria-label="Корень степени ${n} из ${a} ${approximate ? "приблизительно равен" : "равен"} ${rounded}"><mroot><mn>${formatInput(a)}</mn><mn>${n}</mn></mroot><mo>${approximate ? "≈" : "="}</mo><mn>${format(b)}</mn></math></div><p>${n % 2 === 0 ? "Чётный показатель: результат неотрицателен." : "Нечётный показатель: знак результата совпадает со знаком числа под корнем."}</p><p>Проверка: (${format(b)})<sup>${n}</sup> ${approximate ? "≈" : "="} ${formatInput(a)}</p>`;
  }
  $("radicand").addEventListener("input", calculateRoot);
  $("root-index").addEventListener("change", calculateRoot);

  const functions = {
    square: {
      name: "y = x²",
      domain: "D: все действительные числа ℝ.",
      range: "E: [0; +∞).",
      note: "Убывает на (−∞; 0], возрастает на [0; +∞). На всей ℝ не является монотонной.",
      fn: (x) => x * x,
      valid: () => true,
      segments: [[-4.5, 4.5]],
      min: -2,
      max: 2,
      step: 0.25,
    },
    cube: {
      name: "y = x³",
      domain: "D: все действительные числа ℝ.",
      range: "E: все действительные числа ℝ.",
      note: "Строго возрастает на всей ℝ. Отрицательные аргументы дают отрицательные значения.",
      fn: (x) => x * x * x,
      valid: () => true,
      segments: [[-4.5, 4.5]],
      min: -1.5,
      max: 1.5,
      step: 0.25,
    },
    sqrt: {
      name: "y = √x",
      domain: "D: [0; +∞).",
      range: "E: [0; +∞).",
      note: "Возрастает на своей области определения. При отрицательном x действительного значения нет.",
      fn: (x) => Math.sqrt(x),
      valid: (x) => x >= 0,
      segments: [[0, 4.5]],
      min: -1,
      max: 4,
      step: 0.25,
    },
    inverse: {
      name: "y = 1/x",
      domain: "D: ℝ без точки 0; x ≠ 0.",
      range: "E: ℝ без точки 0.",
      note: "Убывает отдельно на (−∞; 0) и (0; +∞). Нельзя объявлять убывание на всей области определения без разделения на ветви.",
      fn: (x) => 1 / x,
      valid: (x) => x !== 0,
      segments: [
        [-4.5, -0.12],
        [0.12, 4.5],
      ],
      min: -4,
      max: 4,
      step: 0.5,
    },
  };
  const sx = (x) => 200 + x * 35,
    sy = (y) => 160 - y * 35;
  let functionName = "square";
  function drawGrid() {
    let out = "";
    for (let i = -4; i <= 4; i++) {
      out += `<path d="M${sx(i)} 20V300 M40 ${sy(i)}H360" stroke="#ccd9d8" stroke-width="1"/>`;
      if (i % 2 === 0) {
        out += `<text x="${sx(i)}" y="181" fill="#516b62" font-size="16" text-anchor="middle">${i === 0 ? "0" : format(i)}</text>`;
        if (i !== 0)
          out += `<text x="190" y="${sy(i) + 5}" fill="#516b62" font-size="16" text-anchor="end">${format(i)}</text>`;
      }
    }
    out +=
      '<path d="M40 160H365 M200 300V15" stroke="#658276" stroke-width="1.5"/><path d="m360 156 7 4-7 4 M196 22l4-8 4 8" fill="none" stroke="#658276"/><text x="371" y="151" font-size="18" fill="#345347">x</text><text x="211" y="24" font-size="18" fill="#345347">y</text>';
    $("graph-grid").innerHTML = out;
  }
  function drawPoint() {
    const data = functions[functionName],
      x = Number($("graph-x").value);
    $("graph-x-value").value = format(x);
    if (!data.valid(x)) {
      $("graph-dot").innerHTML = "";
      $("graph-point").textContent =
        `При x = ${format(x)} функция не определена в действительных числах.`;
      return;
    }
    const y = data.fn(x),
      approx = Math.abs(y - Number(y.toFixed(3))) > 1e-10;
    $("graph-point").textContent =
      `f(${format(x)}) ${approx ? "≈" : "="} ${format(y)}`;
    $("graph-dot").innerHTML =
      `<circle cx="${sx(x)}" cy="${sy(y)}" r="5.5" fill="#ad5836" stroke="#fffefa" stroke-width="2"/>`;
  }
  function showFunction(name) {
    functionName = name;
    const data = functions[name];
    $("function-facts").innerHTML =
      `<p><strong>${data.domain}</strong></p><p>${data.range}</p><p>${data.note}</p>`;
    $("graph-caption").textContent = data.name;
    $("power-graph-title").textContent = `График ${data.name}`;
    $("power-graph-desc").textContent =
      `${data.domain} ${data.range} ${data.note}`;
    $("graph-curves").innerHTML = data.segments
      .map(([from, to]) => {
        const points = [];
        for (let i = 0; i <= 200; i++) {
          const x = from + ((to - from) * i) / 200;
          points.push(
            `${i ? "L" : "M"}${sx(x).toFixed(3)} ${sy(data.fn(x)).toFixed(3)}`,
          );
        }
        return `<path d="${points.join(" ")}" fill="none" stroke="#194d43" stroke-width="3.2"/>`;
      })
      .join("");
    Object.assign($("graph-x"), {
      min: data.min,
      max: data.max,
      step: data.step,
      value: 1,
    });
    document
      .querySelectorAll("[data-function]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.function === name),
        ),
      );
    drawPoint();
  }
  document
    .querySelectorAll("[data-function]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        showFunction(button.dataset.function),
      ),
    );
  $("graph-x").addEventListener("input", drawPoint);

  const equationSteps = [
    {
      title: "1. Область допустимых значений",
      text: "Подкоренное выражение неотрицательно: x + 2 ≥ 0. ОДЗ: x ≥ −2.",
    },
    {
      title: "2. Знак правой части",
      text: "Левая часть неотрицательна, значит x ≥ 0. Это дополнительное условие уравнения, а не исходное ОДЗ.",
    },
    {
      title: "3. Возведение в квадрат",
      text: "При x ≥ 0 получаем x + 2 = x², то есть x² − x − 2 = 0. Разложение: (x − 2)(x + 1) = 0.",
    },
    {
      title: "4. Отбор кандидатов",
      text: "Кандидаты: x = 2 и x = −1. Условию x ≥ 0 соответствует только 2. Отрицательный кандидат возник после возведения в квадрат.",
    },
    {
      title: "5. Проверка и ответ",
      text: "При x = 2: √4 = 2 — верно. При x = −1: √1 = −1 — неверно. Ответ: {2}.",
    },
  ];
  let equationStep = 0;
  function showEquation(step) {
    equationStep = Math.max(0, Math.min(4, step));
    $("equation-counter").textContent = `Шаг ${equationStep + 1} / 5`;
    $("equation-steps").innerHTML = equationSteps
      .slice(0, equationStep + 1)
      .map(
        (data, i) =>
          `<li ${i === equationStep ? 'aria-current="step"' : ""}><h4>${data.title}</h4><p>${data.text}</p></li>`,
      )
      .join("");
    $("equation-prev").disabled = equationStep === 0;
    $("equation-next").disabled = equationStep === 4;
    $("candidate-check").hidden = equationStep < 3;
  }
  $("equation-prev").addEventListener("click", () =>
    showEquation(equationStep - 1),
  );
  $("equation-next").addEventListener("click", () =>
    showEquation(equationStep + 1),
  );
  document.querySelectorAll("[data-candidate]").forEach((button) =>
    button.addEventListener("click", () => {
      $("candidate-result").textContent =
        Number(button.dataset.candidate) === 2
          ? "Подходит: при x = 2 обе части равны 2."
          : "Не подходит: при x = −1 слева √1 = 1, справа −1. ОДЗ выполнено, но равенство неверно.";
    }),
  );

  const list = (items) =>
    `<ul class="rule-conditions">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  const comparisons = {
    lt: {
      symbol: "&lt;",
      plain: "<",
      rule: list([
        "f ≥ 0 <span>Корень определён.</span>",
        "g > 0 <span>Правая часть строго положительна.</span>",
        "f < g² <span>Сравниваем квадраты.</span>",
      ]),
      steps: [
        "ОДЗ: x ≥ −2.",
        "Знак справа: x > 0.",
        "Квадрат: (x − 2)(x + 1) > 0, то есть x < −1 или x > 2.",
        "Пересечение с x > 0 оставляет x > 2.",
      ],
      answer: "(2; +∞)",
      left: 2,
      right: null,
      leftClosed: false,
      rightClosed: false,
    },
    le: {
      symbol: "≤",
      plain: "≤",
      rule: list([
        "f ≥ 0 <span>Корень определён.</span>",
        "g ≥ 0 <span>Нулевая правая часть тоже допускается.</span>",
        "f ≤ g² <span>Сравниваем квадраты с нестрогим знаком.</span>",
      ]),
      steps: [
        "ОДЗ: x ≥ −2.",
        "Знак справа: x ≥ 0.",
        "Квадрат: (x − 2)(x + 1) ≥ 0, то есть x ≤ −1 или x ≥ 2.",
        "После пересечения получаем x ≥ 2. Точка 2 входит.",
      ],
      answer: "[2; +∞)",
      left: 2,
      right: null,
      leftClosed: true,
      rightClosed: false,
    },
    gt: {
      symbol: "&gt;",
      plain: ">",
      rule:
        list(["f ≥ 0 и g < 0 <span>Эта ветвь подходит автоматически.</span>"]) +
        '<div class="branch-separator">ИЛИ</div>' +
        list([
          "f ≥ 0, g ≥ 0 и f > g² <span>Здесь обе части неотрицательны — можно сравнить квадраты.</span>",
        ]),
      steps: [
        "ОДЗ: x ≥ −2.",
        "При −2 ≤ x < 0 неравенство верно автоматически.",
        "При x ≥ 0 квадрат даёт x + 2 > x², откуда 0 ≤ x < 2.",
        "Объединяем ветви. −2 входит, а 2 не входит.",
      ],
      answer: "[−2; 2)",
      left: -2,
      right: 2,
      leftClosed: true,
      rightClosed: false,
    },
    ge: {
      symbol: "≥",
      plain: "≥",
      rule:
        list([
          "f ≥ 0 и g ≤ 0 <span>Эта ветвь подходит автоматически, в том числе при g = 0.</span>",
        ]) +
        '<div class="branch-separator">ИЛИ</div>' +
        list([
          "f ≥ 0, g > 0 и f ≥ g² <span>Положительная правая часть: сравниваем квадраты.</span>",
        ]),
      steps: [
        "ОДЗ: x ≥ −2.",
        "При −2 ≤ x ≤ 0 неравенство верно автоматически.",
        "При x > 0 квадрат даёт x + 2 ≥ x², откуда 0 < x ≤ 2.",
        "Объединяем ветви. Обе конечные границы включены.",
      ],
      answer: "[−2; 2]",
      left: -2,
      right: 2,
      leftClosed: true,
      rightClosed: true,
    },
  };
  const nx = (x) => 45 + ((x + 3) / 7) * 310;
  function showComparison(name) {
    const data = comparisons[name];
    $("inequality-rule").innerHTML = `<p>√f ${data.symbol} g ⇔</p>${data.rule}`;
    $("inequality-example").innerHTML =
      `<math xmlns="http://www.w3.org/1998/Math/MathML" aria-label="Корень из x плюс два ${data.plain} x"><msqrt><mrow><mi>x</mi><mo>+</mo><mn>2</mn></mrow></msqrt><mo>${data.symbol}</mo><mi>x</mi></math>`;
    $("inequality-steps").innerHTML = data.steps
      .map((text) => `<li>${text}</li>`)
      .join("");
    $("inequality-answer").textContent = `Ответ: ${data.answer}`;
    $("interval-title").textContent =
      `Решение: ${data.answer}. Закрашенная точка включена, пустая исключена.`;
    let svg =
      '<path d="M25 53H377m-7-5 7 5-7 5" fill="none" stroke="#768c80" stroke-width="1.5"/>';
    for (let x = -3; x <= 4; x++)
      svg += `<path d="M${nx(x)} 48V58" stroke="#6d8879"/><text x="${nx(x)}" y="84" text-anchor="middle" font-size="15" fill="#3b594a">${format(x)}</text>`;
    svg += `<path d="M${nx(data.left)} 53H${data.right === null ? 375 : nx(data.right)}" stroke="#194d43" stroke-width="5"/>`;
    svg += `<circle data-endpoint="left" data-closed="${data.leftClosed}" cx="${nx(data.left)}" cy="53" r="6" fill="${data.leftClosed ? "#194d43" : "#e6edef"}" stroke="#194d43" stroke-width="2.5"/>`;
    if (data.right !== null)
      svg += `<circle data-endpoint="right" data-closed="${data.rightClosed}" cx="${nx(data.right)}" cy="53" r="6" fill="${data.rightClosed ? "#194d43" : "#e6edef"}" stroke="#194d43" stroke-width="2.5"/>`;
    else
      svg +=
        '<path d="m365 46 11 7-11 7" fill="none" stroke="#194d43" stroke-width="3"/>';
    $("interval-drawing").innerHTML = svg;
    document
      .querySelectorAll("[data-comparison]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.comparison === name),
        ),
      );
  }
  document
    .querySelectorAll("[data-comparison]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        showComparison(button.dataset.comparison),
      ),
    );
  document.querySelectorAll("[data-challenge]").forEach((button) =>
    button.addEventListener("click", () => {
      const choice = Number(button.dataset.challenge);
      document
        .querySelectorAll("[data-challenge]")
        .forEach((option) =>
          option.setAttribute("aria-pressed", String(option === button)),
        );
      $("challenge-feedback").hidden = false;
      $("challenge-feedback").textContent =
        (choice === 1
          ? "Верно. "
          : choice === 0
            ? "Потеряна отрицательная ветвь. "
            : "Проверь включение граничных точек. ") +
        "ОДЗ: x ≤ −2 или x ≥ 2. При x ≤ −2 правая часть отрицательна, поэтому все эти x подходят. При x ≥ 2 возводим в квадрат: x² − 4 > (x − 1)², откуда x > 5/2. Ответ: (−∞; −2] ∪ (5/2; +∞).";
    }),
  );

  calculateRoot();
  drawGrid();
  showFunction("square");
  showEquation(0);
  showComparison("lt");
  window.createSchoolLesson({
    storageKey: "school:algebra-10-roots-powers:v1",
    questions,
    exam,
    successMessage:
      "Получилось связать свойства корней и степеней с ОДЗ, проверкой корней и решением иррациональных неравенств.",
  });
})();
