// Sdílený "engine" slepé mapy. Neví nic konkrétního o řekách/vodních dílech —
// jen umí vykreslit obrys ČR a nad ním libovolnou sadu klikatelných prvků
// (linky typu "path" nebo body typu "point") a vyhodnotit odpovědi.

(function () {
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function normalize(s) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();
  }

  function pointsToPathD(pts) {
    return pts.map((p, i) => (i === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
  }

  function midpoint(pts) {
    return pts[Math.floor(pts.length / 2)];
  }

  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Nepodařilo se načíst " + url);
    return res.json();
  }

  async function init() {
    const modeKey = getQueryParam("mode") || MODE_ORDER[0];
    const mode = MODES[modeKey];

    const root = document.getElementById("app");

    if (!mode) {
      root.innerHTML =
        '<p class="error">Neznámý režim „' + modeKey + '“. <a href="index.html">Zpět na výběr</a>.</p>';
      return;
    }

    document.title = "Slepá mapa ČR — " + mode.title;
    document.getElementById("mode-title").textContent = "Slepá mapa Česka — " + mode.title;

    let outlineData, modeData;
    try {
      [outlineData, modeData] = await Promise.all([
        fetchJSON("data/outline-cr.json"),
        fetchJSON(mode.dataFile),
      ]);
    } catch (err) {
      root.innerHTML = '<p class="error">Chyba při načítání dat: ' + err.message + "</p>";
      return;
    }

    runGame(mode, outlineData, modeData);
  }

  function runGame(mode, outlineData, modeData) {
    const canvas = outlineData.canvas;
    const svg = document.getElementById("map-svg");
    svg.setAttribute("viewBox", "0 0 " + canvas.w + " " + canvas.h);

    // --- Obrys ---
    const outlinePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    outlinePath.setAttribute("d", pointsToPathD(outlineData.outline) + " Z");
    outlinePath.setAttribute("class", "outline");
    svg.appendChild(outlinePath);

    // --- Prvky ke kvízu ---
    const items = {}; // name -> {answers, type, geo}
    const isPath = modeData.type === "path";

    modeData.items.forEach((it) => {
      items[it.name] = { answers: it.answers, type: modeData.type, geo: isPath ? it.points : it.point };

      if (isPath) {
        const visible = document.createElementNS("http://www.w3.org/2000/svg", "path");
        visible.setAttribute("d", pointsToPathD(it.points));
        visible.setAttribute("class", "river-line");
        visible.setAttribute("data-name", it.name);
        svg.appendChild(visible);

        const hit = document.createElementNS("http://www.w3.org/2000/svg", "path");
        hit.setAttribute("d", pointsToPathD(it.points));
        hit.setAttribute("class", "river-hit");
        hit.setAttribute("data-name", it.name);
        svg.appendChild(hit);
      } else {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", it.point[0]);
        circle.setAttribute("cy", it.point[1]);
        circle.setAttribute("r", 6);
        circle.setAttribute("class", "point-mark");
        circle.setAttribute("data-name", it.name);
        svg.appendChild(circle);
      }
    });

    // --- Orientační města ---
    const citiesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    citiesGroup.setAttribute("class", "cities");
    Object.entries(outlineData.cities).forEach(([name, pos]) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", pos[0]);
      dot.setAttribute("cy", pos[1]);
      dot.setAttribute("r", 2.2);
      dot.setAttribute("class", "city-dot");
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", pos[0] + 5);
      label.setAttribute("y", pos[1] + 3);
      label.setAttribute("class", "city-label");
      label.textContent = name;
      g.appendChild(dot);
      g.appendChild(label);
      citiesGroup.appendChild(g);
    });
    svg.appendChild(citiesGroup);

    // --- Stav hry ---
    const total = Object.keys(items).length;
    const solved = new Set();
    let selected = null;

    const scoreEl = document.getElementById("score");
    const panel = document.getElementById("panel");

    function updateScore() {
      scoreEl.textContent = "Vyřešeno " + solved.size + " z " + total;
    }

    function classForName(name) {
      if (solved.has(name)) return "solved";
      if (selected === name) return "selected";
      return "";
    }

    function refreshStyles() {
      svg.querySelectorAll("[data-name]").forEach((el) => {
        const name = el.getAttribute("data-name");
        el.classList.remove("solved", "selected");
        const cls = classForName(name);
        if (cls) el.classList.add(cls);
      });
    }

    function addLabel(name) {
      const geo = items[name].geo;
      const pos = items[name].type === "path" ? midpoint(geo) : geo;
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", pos[0] + (items[name].type === "path" ? 6 : 9));
      text.setAttribute("y", pos[1] + (items[name].type === "path" ? -6 : 4));
      text.setAttribute("class", "solved-label");
      text.textContent = name;
      svg.appendChild(text);
    }

    function renderPanel() {
      if (solved.size === total) {
        panel.innerHTML =
          '<div class="done-title">Hotovo! 🎉</div>' +
          '<div class="done-sub">Uhodl/a jsi všech ' +
          total +
          " prvků.</div>" +
          '<button id="btn-reset-done" class="btn-primary">Spustit znovu</button>';
        document.getElementById("btn-reset-done").addEventListener("click", resetAll);
        return;
      }

      if (selected) {
        panel.innerHTML =
          '<div class="prompt">' +
          mode.prompt +
          "</div>" +
          '<form id="answer-form">' +
          '<input id="answer-input" autocomplete="off" placeholder="napiš název…" />' +
          '<div class="btn-row">' +
          '<button type="submit" class="btn-primary">Ověřit</button>' +
          '<button type="button" id="btn-cancel" class="btn-ghost">Zrušit</button>' +
          "</div>" +
          '<button type="button" id="btn-reveal" class="btn-link">Nevím, ukaž odpověď</button>' +
          '<div id="feedback" class="feedback"></div>' +
          "</form>";

        const input = document.getElementById("answer-input");
        input.focus();
        document.getElementById("answer-form").addEventListener("submit", (e) => {
          e.preventDefault();
          submitAnswer(input.value);
        });
        document.getElementById("btn-cancel").addEventListener("click", () => {
          selected = null;
          refreshStyles();
          renderPanel();
        });
        document.getElementById("btn-reveal").addEventListener("click", reveal);
      } else {
        panel.innerHTML =
          '<div class="hint">Klikni na naznačen' +
          (modeData.type === "path" ? "ou linku" : "ý bod") +
          " na mapě a napiš, jak se ten prvek jmenuje.</div>";
      }
    }

    function selectItem(name) {
      if (solved.has(name)) return;
      selected = name;
      refreshStyles();
      renderPanel();
    }

    function submitAnswer(raw) {
      const guess = normalize(raw);
      if (!guess) return;
      const item = items[selected];
      if (item.answers.includes(guess)) {
        solved.add(selected);
        addLabel(selected);
        selected = null;
        updateScore();
        refreshStyles();
        renderPanel();
      } else {
        const input = document.getElementById("answer-input");
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 400);
        const fb = document.getElementById("feedback");
        if (fb) {
          fb.textContent = "Zkus to znovu.";
          fb.className = "feedback err";
        }
      }
    }

    function reveal() {
      solved.add(selected);
      addLabel(selected);
      selected = null;
      updateScore();
      refreshStyles();
      renderPanel();
    }

    function resetAll() {
      solved.clear();
      selected = null;
      svg.querySelectorAll(".solved-label").forEach((el) => el.remove());
      updateScore();
      refreshStyles();
      renderPanel();
    }

    svg.querySelectorAll("[data-name]").forEach((el) => {
      el.addEventListener("click", () => selectItem(el.getAttribute("data-name")));
    });

    document.getElementById("btn-reset").addEventListener("click", resetAll);

    updateScore();
    renderPanel();
  }

  window.addEventListener("DOMContentLoaded", init);
})();
