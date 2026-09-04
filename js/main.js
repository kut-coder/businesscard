const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const setMenuOpen = (open) => {
  nav?.classList.toggle("open", open);
  menuBtn?.setAttribute("aria-expanded", open ? "true" : "false");
  menuBtn?.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
};
menuBtn?.addEventListener("click", () => {
  setMenuOpen(!nav?.classList.contains("open"));
});
nav?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => setMenuOpen(false));
});

const habitApp = document.getElementById("habitApp");
if (habitApp) {
  const TOTAL = 21;
  const daysEl = document.getElementById("habitDays");
  const ringFg = document.getElementById("habitRingFg");
  const pctEl = document.getElementById("habitPct");
  const doneEl = document.getElementById("habitDoneCount");
  const openEl = document.getElementById("habitOpenCount");
  const statusEl = document.getElementById("habitStatus");
  const weekEl = document.getElementById("habitWeekLabel");
  const markBtn = document.getElementById("habitDone");
  const resetBtn = document.getElementById("habitReset");
  const ringLen = 2 * Math.PI * 15.5;
  let doneDays = 0;
  const habitCheer = [
    "Отлично",
    "Супер",
    "Так держать",
    "Классно",
    "Молодец",
    "Есть!",
    "Сильный шаг",
    "Красиво",
    "В ритме",
    "Здорово",
    "Уверенно",
    "Огонь",
    "Продолжаем",
    "Браво",
    "Замечено",
    "Ты в деле",
    "Чётко",
    "Важный день",
    "Почти финиш",
    "Финишная прямая",
  ];

  function weekStart(day) {
    return Math.floor((day - 1) / 7) * 7 + 1;
  }

  function habitStatusText(done, current) {
    if (done <= 0) {
      return "Сейчас идёт день 1 из 21.";
    }
    if (done >= TOTAL) {
      return "21 день пройден. Можно начать новый круг.";
    }
    const cheer = habitCheer[done - 1] || "Отлично";
    return `${cheer}: день ${done} отмечен. Сейчас идёт день ${current} из 21.`;
  }

  function renderHabit() {
    const current = Math.min(doneDays + 1, TOTAL);
    const start = weekStart(Math.min(current, TOTAL));
    const end = Math.min(start + 6, TOTAL);
    const weekNum = Math.floor((start - 1) / 7) + 1;
    weekEl.textContent = `Неделя ${weekNum} · дни ${start}–${end}`;
    daysEl.innerHTML = "";

    for (let i = start; i <= end; i += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "habit-day";
      if (i <= doneDays) cell.classList.add("is-done");
      else if (i === current && doneDays < TOTAL) cell.classList.add("is-today");
      else cell.classList.add("is-locked");
      cell.innerHTML = `<span class="habit-day-num">${i}</span><span class="habit-day-mark">${i <= doneDays ? "✓" : i === current ? "·" : ""}</span>`;
      cell.title = "День " + i;
      if (i === current && doneDays < TOTAL) {
        cell.addEventListener("click", markDay);
      }
      daysEl.appendChild(cell);
    }

    const pct = Math.round((doneDays / TOTAL) * 100);
    pctEl.textContent = pct + "%";
    doneEl.textContent = String(doneDays);
    openEl.textContent = String(Math.min(1, TOTAL - doneDays));
    ringFg.style.strokeDasharray = `${ringLen}`;
    ringFg.style.strokeDashoffset = String(ringLen - (doneDays / TOTAL) * ringLen);

    statusEl.textContent = habitStatusText(doneDays, current);

    if (doneDays >= TOTAL) {
      markBtn.disabled = true;
      markBtn.textContent = "Готово";
    } else {
      markBtn.disabled = false;
      markBtn.textContent = "Отметить день";
    }
  }

  function markDay() {
    if (doneDays >= TOTAL) return;
    doneDays += 1;
    renderHabit();
  }

  markBtn?.addEventListener("click", markDay);
  resetBtn?.addEventListener("click", () => {
    doneDays = 0;
    renderHabit();
  });

  renderHabit();
}

document.querySelectorAll("[data-crm]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-crm]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".crm-view").forEach((v) => v.classList.remove("active"));
    document.getElementById("crm-" + btn.dataset.crm).classList.add("active");
  });
});

const mealPlans = {
  energy: [
    {
      title: "Завтрак",
      items: ["2 шт. яиц (омлет со шпинатом и помидором)", "50 г овсянки на воде", "1 горсть ягод"],
    },
    {
      title: "Перекус",
      items: ["150 г натурального йогурта", "10 шт. миндаля"],
    },
    {
      title: "Обед",
      items: ["150 г куриной грудки", "60 г гречки (сухой)", "салат из огурца и зелени", "1 ч. л. оливкового масла"],
    },
    {
      title: "Ужин",
      items: ["150 г трески на пару", "100 г брокколи", "100 г кабачка"],
    },
  ],
  cycle: [
    {
      title: "Завтрак",
      items: ["150 г творога 5%", "1 ст. л. семян тыквы", "1 горсть ягод"],
    },
    {
      title: "Перекус",
      items: ["2 шт. гречневых хлебцев", "2 ст. л. паштета из чечевицы", "5 шт. помидоров черри"],
    },
    {
      title: "Обед",
      items: ["120 г говядины тушёной", "70 г гречки (сухой)", "салат из капусты с лимонным соком"],
    },
    {
      title: "Ужин",
      items: ["150 г индейки запечённой", "200 г стручковой фасоли", "200 мл кефира"],
    },
  ],
  family: [
    {
      title: "Завтрак",
      items: ["2 шт. яиц всмятку", "1 ломтик ржаного хлеба", "20 г сыра", "1 шт. огурца"],
    },
    {
      title: "Обед",
      items: ["70 г бурого риса", "150 г куриного филе", "1 шт. среднего помидора", "½ шт. сладкого перца"],
    },
    {
      title: "Перекус",
      items: ["1 шт. яблока", "200 мл питьевого йогурта без сахара"],
    },
    {
      title: "Ужин",
      items: ["1 шт. кабачка", "1 шт. перца", "150 г брокколи", "150 г запечённой рыбы"],
    },
  ],
};

let selectedGoal = "energy";
document.querySelectorAll("#goalChips .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll("#goalChips .chip").forEach((c) => c.classList.remove("on"));
    chip.classList.add("on");
    selectedGoal = chip.dataset.goal;
  });
});

document.getElementById("buildDay")?.addEventListener("click", () => {
  const board = document.getElementById("mealBoard");
  const meals = mealPlans[selectedGoal];
  board.innerHTML = meals
    .map(
      (m) =>
        `<div class="meal-card"><b>${m.title}</b><ul>${m.items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`
    )
    .join("");
  board.hidden = false;
  document.getElementById("planHint").hidden = false;
});

const sampleMenu = [
  {
    meal: "Завтрак",
    items: [
      { name: "Отварные яйца", amount: 2, unit: "шт." },
      { name: "Помидор черри", amount: 5, unit: "шт." },
      { name: "Листья салата", amount: 3, unit: "лист" },
      { name: "Хлеб на закваске", amount: 2, unit: "ломтика" },
    ],
  },
  {
    meal: "Обед",
    items: [
      { name: "Куриное филе", amount: 150, unit: "г" },
      { name: "Гречка", amount: 60, unit: "г" },
      { name: "Огурец", amount: 1, unit: "шт." },
      { name: "Листья салата", amount: 4, unit: "лист" },
      { name: "Оливковое масло", amount: 1, unit: "ст. л." },
    ],
  },
  {
    meal: "Ужин",
    items: [
      { name: "Гречка", amount: 60, unit: "г" },
      { name: "Шампиньоны", amount: 150, unit: "г" },
      { name: "Помидор черри", amount: 4, unit: "шт." },
      { name: "Огурец", amount: 1, unit: "шт." },
    ],
  },
];

function ruUnit(amount, unit) {
  if (unit !== "лист") return unit;
  const n = Math.abs(amount) % 100;
  const d = n % 10;
  if (n > 10 && n < 20) return "листов";
  if (d === 1) return "лист";
  if (d >= 2 && d <= 4) return "листа";
  return "листов";
}

function formatQty(item) {
  return item.amount + " " + ruUnit(item.amount, item.unit);
}
document.getElementById("loadMenu")?.addEventListener("click", () => {
  const box = document.getElementById("menuDay");
  box.innerHTML = sampleMenu
    .map(
      (block) =>
        `<div class="menu-block"><h4>${block.meal}</h4><ul>${block.items
          .map((i) => `<li><span>${i.name}</span><span class="qty">${formatQty(i)}</span></li>`)
          .join("")}</ul></div>`
    )
    .join("");
  box.hidden = false;
  document.getElementById("makeList").hidden = false;
  document.getElementById("shopList").hidden = true;
});

document.getElementById("makeList")?.addEventListener("click", () => {
  const totals = new Map();
  sampleMenu.forEach((block) => {
    block.items.forEach((item) => {
      const key = item.name + "|" + item.unit;
      const prev = totals.get(key);
      if (prev) prev.amount += item.amount;
      else totals.set(key, { name: item.name, amount: item.amount, unit: item.unit });
    });
  });
  const rows = [...totals.values()].sort((a, b) => a.name.localeCompare(b.name, "ru"));
  const list = document.getElementById("shopList");
  list.innerHTML =
    "<h4>Итого к закупке</h4><ul>" +
    rows.map((r) => `<li><span>${r.name}</span><span class="total">${formatQty(r)}</span></li>`).join("") +
    "</ul><button class=\"shop-pdf\" type=\"button\">Скачать PDF</button>";
  list.hidden = false;
});

const chatLog = document.getElementById("chatLog");
const chatQuick = document.getElementById("chatQuick");
const chatFlow = {
  start: {
    bot: "Привет! Я помощник Ольги. Какой у вас сейчас вопрос?",
    buttons: [
      { label: "По заменам", next: "swaps" },
      { label: "По режиму", next: "regime" },
      { label: "По самочувствию", next: "feel" },
    ],
  },
  swaps: {
    bot: "Что хотите заменить в меню протокола?",
    buttons: [
      { label: "Нет яиц", next: "swap_eggs" },
      { label: "Нет гречки", next: "swap_buck" },
      { label: "Без молочного", next: "swap_dairy" },
    ],
  },
  swap_eggs: {
    bot: "Яйца в завтраке можно заменить на 120 г тофу или 150 г творога 5%. Порцию белка сохраняем. Если замена нужна надолго, лучше согласовать с Ольгой.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  swap_buck: {
    bot: "Гречку замените на бурый рис или киноа в той же сухой порции (около 60 г). Если крупы не идут совсем, Ольга пересоберёт гарнир.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  swap_dairy: {
    bot: "Молочное в протоколе не обязательное. Йогурт — на растительный без сахара или на порцию рыбы. При непереносимости Ольга скорректирует день.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  regime: {
    bot: "О каком моменте дня вопрос?",
    buttons: [
      { label: "Пропускаю завтрак", next: "reg_breakfast" },
      { label: "Ужин поздний", next: "reg_dinner" },
      { label: "Перекусы сбились", next: "reg_snack" },
    ],
  },
  reg_breakfast: {
    bot: "По протоколу «тихая энергия» завтрак с белком — опора. Если утром не естся, поставьте тёплый приём до 11:00: яйца или йогурт. Если так несколько дней, напишите Ольге.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  reg_dinner: {
    bot: "Ужин лучше за 2–3 часа до сна, тёплый, без большой порции крупы. Если график не даёт, Ольга подстроит окно под вашу смену.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  reg_snack: {
    bot: "Перекус — если голод между едой, не «за компанию». Йогурт, орехи, яблоко. Если тянет сладкое каждые два часа, это уже к Ольге: я не разбираю дневник целиком.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  feel: {
    bot: "Что сейчас с самочувствием? Я подскажу по протоколу. Если тревожно, сразу переключу на Ольгу.",
    buttons: [
      { label: "Тяга к сладкому", next: "feel_sweet" },
      { label: "Нет сил утром", next: "feel_tired" },
      { label: "Тревожит состояние", next: "feel_alert" },
    ],
  },
  feel_sweet: {
    bot: "Тяга часто после пропущенного обеда или кофе натощак. Сначала доберите белок в основной еде. Если тяга резкая и новая, Ольга посмотрит дневник.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  feel_tired: {
    bot: "Утренний спад — частый сюжет. Проверьте белок за завтраком и не уехал ли ужин за полночь. Если слабость держится, напишите Ольге: я диагноз не ставлю.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  feel_alert: {
    bot: "Если самочувствие тревожит — сыпь, резкий спад, боль — я не консультирую. Свяжитесь с Ольгой, при необходимости она направит к врачу.",
    buttons: [{ label: "Связаться с Ольгой", next: "olga" }],
  },
  olga: {
    bot: "Передала ваш запрос Ольге, в ближайшее время она с вами свяжется.<br><br><span class=\"hint\">В рабочей версии сообщение уходит к вам в мессенджер.</span>",
    buttons: [{ label: "Сначала", next: "start" }],
  },
};

function renderChat(key) {
  const node = chatFlow[key];
  const msg = document.createElement("div");
  msg.className = "msg bot";
  msg.innerHTML = node.bot;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
  chatQuick.innerHTML = "";
  node.buttons.forEach((b) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = b.label;
    btn.addEventListener("click", () => {
      if (b.next === "start") {
        chatLog.innerHTML = "";
        renderChat("start");
        return;
      }
      const user = document.createElement("div");
      user.className = "msg user";
      user.textContent = b.label;
      chatLog.appendChild(user);
      renderChat(b.next);
    });
    chatQuick.appendChild(btn);
  });
}
if (chatLog) renderChat("start");

const materialStudio = document.getElementById("materialStudio");
if (materialStudio) {
  const MS_DATA = {
    recipe: {
      fields: [
        ["title", "Название рецепта", "Тёплая тарелка с киноа"],
        ["subtitle", "Короткое описание", "Сытный обед, который удобно собрать заранее"],
        ["ingredients", "Ингредиенты", "киноа — 70 г\nтыква — 180 г\nнут — 100 г\nшпинат — горсть\nтахини — 1 ст. л."],
        ["steps", "Как приготовить", "Запеките тыкву до мягкости. Сварите киноа. Соберите всё в тарелке, добавьте нут и зелень. Полейте соусом из тахини."],
        ["note", "Комментарий специалиста", "Если хочется больше сытости, добавьте яйцо или порцию рыбы."],
      ],
    },
    guide: {
      fields: [
        ["title", "Название гайда", "Еда без гонки"],
        ["subtitle", "Подзаголовок", "Три опоры, которые помогают сделать питание устойчивее"],
        ["block1", "Блок 1", "Начните с регулярности\nНе ищите идеальный рацион. Сначала верните предсказуемые приёмы пищи."],
        ["block2", "Блок 2", "Собирайте тарелку\nДобавляйте источник белка, овощи, сложные углеводы и жиры."],
        ["block3", "Блок 3", "Оставляйте место жизни\nПитание должно выдерживать работу, поездки и семейные ужины."],
      ],
    },
    checklist: {
      fields: [
        ["title", "Название чек-листа", "Гигиена сна"],
        ["subtitle", "Короткая подсказка", "Отметьте вечером то, что уже получилось"],
        [
          "items",
          "Пункты — каждый с новой строки",
          "Сел ужинать за 2–3 часа до сна\nВыключил яркие экраны за 30–40 минут\nПроветрил комнату и приглушил свет\nВыпил воды днём, а не литрами на ночь\nПриготовил одежду и мелочи на утро\nЛёг примерно в одно и то же время\nЕсли не спится, встал и сделал что-то тихое без телефона",
        ],
        ["note", "Нижняя заметка", "Сон — такая же опора, как еда. Один спокойный вечер уже меняет самочувствие."],
      ],
    },
  };

  let msType = "recipe";
  const msState = {};
  Object.keys(MS_DATA).forEach((type) => {
    msState[type] = {};
    MS_DATA[type].fields.forEach(([key, , value]) => {
      msState[type][key] = value;
    });
  });

  const msFields = document.getElementById("msFields");
  const msLayer = document.getElementById("msDocumentLayer");

  function msEscape(str = "") {
    return String(str).replace(/[&<>'"]/g, (s) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[s])
    );
  }

  function msBuildFields() {
    msFields.innerHTML = "";
    MS_DATA[msType].fields.forEach(([key, label]) => {
      const wrap = document.createElement("div");
      wrap.className = "ms-field";
      const val = msState[msType][key];
      const long = ["ingredients", "steps", "note", "block1", "block2", "block3", "items"].includes(key);
      wrap.innerHTML = long
        ? `<label>${label}<span>${val.length} зн.</span></label><textarea data-key="${key}" class="${key === "note" ? "ms-compact" : ""}">${msEscape(val)}</textarea>`
        : `<label>${label}<span>${val.length} зн.</span></label><input data-key="${key}" value="${msEscape(val)}" />`;
      msFields.appendChild(wrap);
    });
    msFields.querySelectorAll("input,textarea").forEach((el) => {
      el.addEventListener("input", (e) => {
        msState[msType][e.target.dataset.key] = e.target.value;
        const counter = e.target.previousElementSibling?.querySelector("span");
        if (counter) counter.textContent = e.target.value.length + " зн.";
        msRenderPreview();
      });
    });
  }

  function msRenderPreview() {
    const s = msState[msType];
    msLayer.className = "ms-document-layer " + msType;
    if (msType === "recipe") {
      const items = s.ingredients
        .split(/\n+/)
        .filter(Boolean)
        .map((x) => `<li>${msEscape(x)}</li>`)
        .join("");
      msLayer.innerHTML = `<div class="ms-doc-kicker">карточка рецепта</div><h2 class="ms-doc-title">${msEscape(s.title)}</h2><div class="ms-doc-subtitle">${msEscape(s.subtitle)}</div><div class="ms-rule"></div><div class="ms-two-col"><div><div class="ms-doc-section-title">ингредиенты</div><ul class="ms-ingredients">${items}</ul></div><div><div class="ms-doc-section-title">приготовление</div><div class="ms-doc-text">${msEscape(s.steps)}</div></div></div><div class="ms-recipe-note">${msEscape(s.note)}</div><div class="ms-doc-footer"><span>бережное питание · без жёстких правил</span><strong>@maria.health</strong></div>`;
    } else if (msType === "guide") {
      const cards = ["block1", "block2", "block3"]
        .map((k, i) => {
          const [head, ...rest] = s[k].split("\n");
          return `<div class="ms-guide-card"><div class="ms-guide-number">0${i + 1}</div><strong>${msEscape(head)}</strong><p>${msEscape(rest.join("\n"))}</p></div>`;
        })
        .join("");
      msLayer.innerHTML = `<div class="ms-doc-kicker">мини-гайд</div><h2 class="ms-doc-title">${msEscape(s.title)}</h2><div class="ms-doc-subtitle">${msEscape(s.subtitle)}</div><div class="ms-guide-blocks">${cards}</div><div class="ms-doc-footer"><span>сохраните, чтобы вернуться позже</span><strong>@maria.health</strong></div>`;
    } else {
      const items = s.items
        .split(/\n+/)
        .filter(Boolean)
        .map((x) => `<div class="ms-check-item"><span class="ms-check"></span><span>${msEscape(x)}</span></div>`)
        .join("");
      msLayer.innerHTML = `<div class="ms-doc-kicker">чек-лист</div><h2 class="ms-doc-title">${msEscape(s.title)}</h2><div class="ms-doc-subtitle">${msEscape(s.subtitle)}</div><div class="ms-rule"></div><div class="ms-checklist-items">${items}</div><div class="ms-recipe-note">${msEscape(s.note)}</div><div class="ms-doc-footer"><span>простые решения для обычной недели</span><strong>@maria.health</strong></div>`;
    }
  }

  materialStudio.querySelectorAll(".ms-format-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      msType = btn.dataset.type;
      materialStudio.querySelectorAll(".ms-format-btn").forEach((x) => x.classList.toggle("active", x === btn));
      msBuildFields();
      msRenderPreview();
    });
  });

  msBuildFields();
  msRenderPreview();
}

const toTop = document.getElementById("toTop");
const toggleToTop = () => {
  toTop?.classList.toggle("visible", window.scrollY > 280);
};
toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
window.addEventListener("scroll", toggleToTop, { passive: true });
toggleToTop();
